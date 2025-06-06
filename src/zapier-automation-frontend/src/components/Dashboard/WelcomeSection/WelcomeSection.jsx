import React from 'react';
import '../Dashboard.css';

const WelcomeSection = () => {
  return (
    <section className="welcome-section">
      {/* Background decorative elements */}
      <div className="background-decorations">
        <div className="bg-ellipse ellipse-1"></div>
        <div className="bg-ellipse ellipse-2"></div>
      </div>

      {/* Search bar in top right */}
      <div className="search-bar-container">
        <div className="search-bar">
          <img src="/assets/search.svg"/>
          <span className="search-text">Search</span>
        </div>
      </div>

      {/* Main welcome content */}
      <div className="welcome-content-area">
        <div className="welcome-text-content">
          <h1 className="welcome-title">Welcome user!</h1>
          <p className="welcome-subtitle">what do you wanna do today?</p>
          <button className="create-workflow-button">
            <img src="/assets/plus.svg"/>
            <span className="button-text">Create Workflow</span>
          </button>
        </div>
        
        {/* Team illustration */}
        <div className="welcome-illustration">
          <div className="team-figures">
           
            <img src= "/assets/image.png"/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;