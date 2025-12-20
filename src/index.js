import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

        <App />
  </React.StrictMode>
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


////// ---------------------------------------------- 


// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import { BrowserRouter } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';

// // --- MSW SETUP FOR CREATE REACT APP ---

// // 1. Import the mock worker
// import { worker } from './mocks/browser';

// // 2. Define an async function to start it
// async function enableMocking() {
//   if (process.env.NODE_ENV !== 'development') {
//     return;
//   }
  
//   console.log('Attempting to start Mock Service Worker...');
  
//   // worker.start() is the key. It finds the registration in the public folder.
//   return worker.start();
// }

// const root = ReactDOM.createRoot(document.getElementById('root'));

// // 3. Call the function and wait for it to finish before rendering the app
// enableMocking().then(() => {
//   console.log('Mock Service Worker has started. Rendering the app.');
//   root.render(
//     <React.StrictMode>
//           <App />
//     </React.StrictMode>
//   );
// });