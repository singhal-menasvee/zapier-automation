import React from 'react';
import './IntegrationCard.css';

const IntegrationCard = ({ name, color, icon, onClick }) => {
  return (
    <div className="integration-card cursor-pointer" onClick={onClick}>
      <div className="card-icon" style={{ backgroundColor: color }}>
        <div className={`icon-${icon}`}></div>
      </div>
      <p>{name}</p>
    </div>
  );
};

export default IntegrationCard;
