import React from 'react';
import './IntegrationCard.css';

const IntegrationCard = ({ name, color, icon }) => {
  return (
    <div className="integration-card">
      <div className="card-icon" style={{ backgroundColor: color }}>
        <div className={`icon-${icon}`}></div>
      </div>
      <p>{name}</p>
    </div>
  );
};

export default IntegrationCard;