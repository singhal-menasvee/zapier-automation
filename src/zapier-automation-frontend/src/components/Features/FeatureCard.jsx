import React from 'react';
import './Features.css';

const FeatureCard = ({ icon, title, description }) => {
  const getIconColor = () => {
    switch(icon) {
      case 'blue':
        return {
          bg: 'rgba(59, 130, 246, 0.2)',
          color: '#3B82F6'
        };
      case 'purple':
        return {
          bg: 'rgba(168, 85, 247, 0.2)',
          color: '#A855F7'
        };
      case 'green':
        return {
          bg: 'rgba(34, 197, 94, 0.2)',
          color: '#22C55E'
        };
      default:
        return {
          bg: 'rgba(59, 130, 246, 0.2)',
          color: '#3B82F6'
        };
    }
  };

  const iconColor = getIconColor();

  return (
    <div className="feature-card">
      <div className="feature-icon" style={{ backgroundColor: iconColor.bg }}>
        <div className="icon-symbol" style={{ backgroundColor: iconColor.color }}></div>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;