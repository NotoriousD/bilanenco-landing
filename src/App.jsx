import { useCallback, useEffect } from 'react';
import { Amplify, API } from 'aws-amplify';

import './App.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

function App() {
  // const fetchPackages = useCallback(async () => {
  //   try {
  //     const response = await API.get('packages', '/packages');
  //     console.log(response);
  //   } catch(e) {
  //     console.log(e);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchPackages();
  // }, [fetchPackages]);

  const handleCreateOrder = async () => {
    const response = await API.post('orders', '/orders', {
      body: {
        course_id: '3ba0955e-a500-40ea-92b0-077595964440',
        fullName: 'Danil Kruhlikov',
        email: 'dkruhlikov@gmail.com',
        phone: '+380673651586'
      }
    });

    console.log(response);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={handleCreateOrder}>create</button>
      </header>
    </div>
  );
}

export default App;
