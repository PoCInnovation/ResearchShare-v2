import React from 'react';
import './App.css';

import MetaMask from '../components/MetaMask/MetaMask';
import IpfsHandling from '../components/IpfsHandler/IpfsHandler';
import Review from '../components/Review/Review';

export default function App() {
  return (
    <section className="app">
      <h1 className="app-title">Research Share</h1>
      <article className="app-wrapper">
        <article className="app-left">
          <MetaMask />
        </article>
        <article className="app-center">
          <IpfsHandling />
        </article>
        <article className="app-right">
          <Review />
        </article>
      </article>
    </section>
  )
}