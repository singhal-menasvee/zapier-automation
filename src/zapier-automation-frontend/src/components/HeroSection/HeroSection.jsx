import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';



const HeroSection = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const handleLaunchDashboard = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      alert('Please login first!');
    }
  };
  
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Automate Everything, On-Chain & Off</h1>
        <h2>Own Your Data, Power your workflows</h2>
        <p>
          Build powerful automations that react to Web3 events, smart contracts, and traditional APIs — all in one flow. 
          No central servers, no lock-in. Just privacy-first, decentralized infrastructure.
        </p>
        <div className="hero-buttons">
          <button 
            className="primary-button"
            onClick={handleLaunchDashboard}
          >
            <FontAwesomeIcon icon={faRocket} />&nbsp;
                 Launch Dashboard
          </button>
          <button className="secondary-button">
            <FontAwesomeIcon icon= {faPlay} />&nbsp;
            Watch Demo</button>
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