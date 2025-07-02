import React, { useState } from 'react';
import IntegrationCard from '../IntegrationCard/IntegrationCard';
import GoogleCalendarPanel from './GoogleCalendarPanel';
import './RightPanel.css';

const RightPanel = () => {
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const handleIntegrationClick = (name) => {
    setSelectedIntegration(name);
  };

  return (
    <aside className="right-panel">
      <div className="panel-header">
        <h2>Node Configuration</h2>
        <p>Select a node to configure its settings</p>
      </div>

      {selectedIntegration === 'Google Calendar' && (
        <GoogleCalendarPanel onClose={() => setSelectedIntegration(null)} />
      )}

      <div className="integrations-section">
        <h3>Available Integrations</h3>
        <div className="integrations-grid">
          <IntegrationCard 
            name="Google Calendar" 
            color="#34A853" 
            icon="calendar" 
            onClick={() => handleIntegrationClick('Google Calendar')}
          />
          <IntegrationCard 
            name="Gmail" 
            color="#EF4444" 
            icon="gmail" 
            onClick={() => handleIntegrationClick('Gmail')}
          />
          <IntegrationCard 
            name="Slack" 
            color="#2563EB" 
            icon="slack" 
            onClick={() => handleIntegrationClick('Slack')}
          />
          <IntegrationCard 
            name="Discord" 
            color="#9333EA" 
            icon="discord" 
            onClick={() => handleIntegrationClick('Discord')}
          />
          <IntegrationCard 
            name="WhatsApp" 
            color="#16A34A" 
            icon="whatsapp" 
            onClick={() => handleIntegrationClick('WhatsApp')}
          />
        </div>
      </div>

      <div className="smart-contracts-section">
        <h3>Smart Contracts</h3>
        <div className="contract-actions">
          <div className="contract-action">
            <div className="action-icon" style={{ backgroundColor: '#F97316' }}></div>
            <div className="action-details">
              <h4>Transfer ETH</h4>
              <p>Ethereum Network</p>
            </div>
          </div>
          <div className="contract-action">
            <div className="action-icon" style={{ backgroundColor: '#EAB308' }}></div>
            <div className="action-details">
              <h4>Mint NFT</h4>
              <p>ERC-721</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
