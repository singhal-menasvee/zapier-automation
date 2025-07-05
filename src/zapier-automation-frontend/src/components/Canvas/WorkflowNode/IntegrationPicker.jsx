import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { integrations } from '../../../utils/Integration';
import './IntegrationPicker.css';

const IntegrationPicker = ({ onSelect }) => {
  return (
    <div className="integration-picker">
      <h4 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
        Select an App
      </h4>
      {integrations.map((app, idx) => (
        <div className="integration-option" key={idx} onClick={() => onSelect(app)}>
          <FontAwesomeIcon 
            icon={app.icon} 
            className="integration-icon" 
          />
          <span style={{ color: '#fff', fontSize: '13px' }}>{app.name}</span>
        </div>
      ))}
    </div>
  );
};

export default IntegrationPicker;