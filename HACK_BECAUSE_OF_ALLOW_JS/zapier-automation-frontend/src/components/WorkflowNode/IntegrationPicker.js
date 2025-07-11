import React from 'react';
import IntegrationCard from './IntegrationCard'; // Assuming IntegrationCard is in the same directory or adjust path
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // For the close icon
const IntegrationPicker = ({ onSelect, onClose }) => {
    // Dummy data for available integrations
    const availableIntegrations = [
        { name: 'Google Calendar', color: '#34A853', icon: 'calendar' }, // Example icon names
        { name: 'Gmail', color: '#EA4335', icon: 'envelope' },
        { name: 'Slack', color: '#4A154B', icon: 'slack' },
        { name: 'Discord', color: '#7289DA', icon: 'discord' },
        { name: 'WhatsApp', color: '#25D366', icon: 'whatsapp' },
        { name: 'Twitter', color: '#1DA1F2', icon: 'twitter' },
        // Add more integrations as needed
    ];
    const handleCardClick = (integration) => {
        onSelect(integration); // Pass the selected integration object back to the parent
    };
    return (
    // This component will likely be rendered as a modal or an overlay.
    // For simplicity, it's a fixed-position overlay here.
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-dark text-white border border-secondary">
          <div className="modal-header border-bottom border-secondary">
            <h5 className="modal-title text-white">Select an Integration</h5>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <p className="text-secondary mb-4">Choose an application to connect to your workflow node.</p>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
              {availableIntegrations.map((integration) => (<div className="col" key={integration.name}>
                  <IntegrationCard name={integration.name} color={integration.color} icon={integration.icon} onClick={() => handleCardClick(integration)}/>
                </div>))}
            </div>
          </div>
          <div className="modal-footer border-top border-secondary">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>);
};
export default IntegrationPicker;
