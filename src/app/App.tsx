import React from 'react';
import './App.css';

import MetaMask from '../components/MetaMask/MetaMask';
import IpfsHandling from '../components/IpfsHandler/IpfsHandler';
import Review from '../components/Review/Review';

export default function App() {
  return (
    <div className="app">
      <h1 className="app-title">Research Share</h1>
      <div className="app-wrapper">
        <div className="app-left">
          <MetaMask />
        </div>
        <div className="app-center">
          <IpfsHandling />
        </div>
        <div className="app-right">
          <Review />
        </div>
      </div>
    </div>
  )
}