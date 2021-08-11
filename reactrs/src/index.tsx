import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { MetaMaskProvider } from 'metamask-react';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <MetaMaskProvider>
      <App />
    </MetaMaskProvider>
  </React.StrictMode>,
  document.getElementById('root')
);