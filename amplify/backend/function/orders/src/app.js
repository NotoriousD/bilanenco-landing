/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["PAYMENT_TOKEN"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_PACKAGES_NAME
	STORAGE_PACKAGES_ARN
	STORAGE_PACKAGES_STREAMARN
	STORAGE_ORDERS_NAME
	STORAGE_ORDERS_ARN
	STORAGE_ORDERS_STREAMARN
	FUNCTION_PACKAGES_NAME
	PAYMENT_URL
Amplify Params - DO NOT EDIT */

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const uuid = require('uuid');
const { validation } = require('./validation')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const { getExchangeRates, monobankCreateInvoice } = require('./monobank')
const { statuses } = require('./statuses')

const PACKAGES_TABLE_NAME = `packages-${process.env.ENV}`;
const ORDERS_TABLE_NAME = `orders-${process.env.ENV}`;

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

const getPackageById = async (req, res, next) => {
  const params = {
    TableName: PACKAGES_TABLE_NAME,
    Key: {
      id: req.body.course_id
    }
  };
  const course = await docClient.get(params, (err, data) => {
    if(err) {
      res.status(404).json({ message: 'Something went wrong', body: err });
      return;
    }
  }).promise();

  if(Object.keys(course).length === 0) {
    res.status(404).send({ message: "Course not found by course id" });
    return;
  }

  if(course.Item.available_places === 0) {
    res.status(404).json({ message: 'There are no available places in this package' })
    return;
  }
  req.course_package = course.Item;
  next();
}

const createOrder = async (req, res, next) => {

  const { error } = validation.validate(req.body);

  if(error) {
    res.status(404).json(error);
    return;
  }

  try {
    let total_amount;
    const rate = await getExchangeRates();

    if(rate) {
      total_amount = Math.floor(req.course_package.price * rate) * 100;
    }

    const newOrder = {
      ...req.body,
      id: uuid.v4(),
      total_amount,
      invoice_id: null,
      order_status: statuses.pending,
      created_date: new Date(),
      paied_date: null,
    }

    await docClient.put({
      TableName: ORDERS_TABLE_NAME,
      Item: newOrder,
    }, (err, data) => {
      if(err) {
        res.status(404).send({ message: 'Order not created' });
      } else {
        req.order = {
          ...newOrder,
          name: req.course_package.name,
        };
    
        next();
      }
    });

  } catch(err) {
    res.status(400).json(err);
  }
};

const updageAvailablePlaces = async (req, res, next) => {
  await docClient.update({
    TableName: PACKAGES_TABLE_NAME,
    Key: {
      id: req.course_package.id,
    },
    UpdateExpression: 'set #a = :AvailablePlaces',
    ExpressionAttributeNames: {
      '#a': 'available_places',
    },
    ExpressionAttributeValues: {
      ':AvailablePlaces': req.course_package.available_places - 1,
    }
  }, (err, data) => {
    if(err) {
      res.status(404).json({ message: 'Cant decrease available places', body: err });
    } else {
      next();
    }
  })
}

app.post('/orders', getPackageById, createOrder, updageAvailablePlaces, async function(req, res) {
  const { Parameters } = await (new AWS.SSM())
  .getParameters({
    Names: ["PAYMENT_TOKEN"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();
  const PAYMENT_TOKEN = Parameters.pop().Value;
  try {
    const invoice = await monobankCreateInvoice({
      orderId: req.order.id,
      amount: req.order.total_amount,
      productId: req.body.course_id,
      name: req.order.name,
      redirectUrl: `https://workshop${process.env.ENV === 'dev' ? '-dev' : ''}.bilanenco.com/thank-you`,
      webHookUrl: `${process.env.CALLBACK_URL}/status`,
      destination: `Оплата курсу WORKSHOP (${req.order.name})`,
      token: PAYMENT_TOKEN,
    });

    if(invoice) {
      await docClient.update({
        TableName: ORDERS_TABLE_NAME,
        Key: {
          id: req.order.id,
        },
        UpdateExpression: 'set #a = :InvoiceId, #b = :Status',
        ExpressionAttributeNames: {
          '#a': 'invoice_id',
          '#b': 'order_status',
        },
        ExpressionAttributeValues: {
          ':InvoiceId': invoice.invoiceId,
          ':Status': statuses.invoiceCreated,
        }
      }, (err, data) => {
        if(err) {
          res.status(404).send({ message: 'Order not updated' });
        } else {
          res.status(200).json({ pageUrl: invoice.pageUrl })
        }
      });
    }
  } catch(err) {
    res.status(404).json(err);
  }
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
