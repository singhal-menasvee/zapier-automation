import React from 'react';
import './IntegrationCard.css'; // Keep custom CSS for specific card layout/styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Import specific icons you plan to use. You'll need to add more as you introduce new integrations.
import { faSlack, // For Slack
faDiscord, // For Discord
faWhatsapp, // For WhatsApp
faTwitter, // For Twitter
faEthereum // For Transfer ETH (example)
 } from '@fortawesome/free-brands-svg-icons'; // Brands icons for common services
import { faCube, faCalendarAlt, // Solid icon for calendar
faEnvelope, // Solid icon for envelope
faImage // faImage is a solid icon
 } from '@fortawesome/free-solid-svg-icons'; // Solid icons for general purposes
// Helper function to map icon string names to Font Awesome icon objects
const getIntegrationIcon = (iconName) => {
    switch (iconName) {
        case 'calendar':
            return faCalendarAlt;
        case 'envelope':
            return faEnvelope;
        case 'slack':
            return faSlack;
        case 'discord':
            return faDiscord;
        case 'whatsapp':
            return faWhatsapp;
        case 'twitter':
            return faTwitter;
        case 'ethereum': // For smart contracts
            return faEthereum;
        case 'nft': // For smart contracts (using faImage as a generic NFT placeholder)
            return faImage;
        default:
            return faCube; // Default icon if not found
    }
};
const IntegrationCard = ({ name, color, icon, onClick }) => {
    const faIcon = getIntegrationIcon(icon); // Get the Font Awesome icon object
    return (<div className="integration-card card text-center cursor-pointer h-100" onClick={onClick}> {/* Bootstrap card, text-center */}
      <div className="card-body d-flex flex-column align-items-center justify-content-center p-3"> {/* Bootstrap card-body */}
        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center mb-2" style={{ backgroundColor: color, width: '3.5rem', height: '3.5rem' }}>
          {/* Now directly using FontAwesomeIcon */}
          <FontAwesomeIcon icon={faIcon} style={{ fontSize: '1.5rem', color: 'white' }}/>
        </div>
        <p className="card-text fw-semibold mb-0">{name}</p> {/* Bootstrap card-text */}
      </div>
    </div>);
};
export default IntegrationCard;
