const Joi = require('joi');

exports.validation = Joi.object({
  email: Joi.string().required(),
  fullName: Joi.string().required(),
  course_id: Joi.string().required(),
  phone: Joi.string().required(),
});