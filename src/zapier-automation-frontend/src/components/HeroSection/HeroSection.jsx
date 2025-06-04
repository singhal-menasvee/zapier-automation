import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Automatic Everything, On-Chain & Off</h1>
        <h2>Own Your Data, Power your workflows</h2>
        <p>
          Build powerful automations that react to Web3 events, smart contracts, and traditional APIs — all in one flow. 
          No central servers, no lock-in. Just privacy-first, decentralized infrastructure.
        </p>
        <div className="hero-buttons">
          <button className="primary-button">Launch Desktop</button>
          <button className="secondary-button">Watch Demo</button>
        </div>
      </div>
      <div className="hero-background">
        <div className="gradient-circle blue"></div>
        <div className="gradient-circle purple"></div>
      </div>
    </section>
  );
};

export default HeroSection;