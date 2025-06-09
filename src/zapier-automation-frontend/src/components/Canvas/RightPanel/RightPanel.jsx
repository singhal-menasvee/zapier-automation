import React from 'react';
import IntegrationCard from '../IntegrationCard/IntegrationCard';
import './RightPanel.css';

const RightPanel = () => {
  return (
    <aside className="right-panel">
      <div className="panel-header">
        <h2>Node Configuration</h2>
        <p>Select a node to configure its settings</p>
      </div>
      <div className="integrations-section">
        <h3>Available Integrations</h3>
        <div className="integrations-grid">
          <IntegrationCard 
            name="Gmail" 
            color="#EF4444" 
            icon="gmail"
          />
          <IntegrationCard 
            name="Slack" 
            color="#2563EB" 
            icon="slack"
          />
          <IntegrationCard 
            name="Discord" 
            color="#9333EA" 
            icon="discord"
          />
          <IntegrationCard 
            name="WhatsApp" 
            color="#16A34A" 
            icon="whatsapp"
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