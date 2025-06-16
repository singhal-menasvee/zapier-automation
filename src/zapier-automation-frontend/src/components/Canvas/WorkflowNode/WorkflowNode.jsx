import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IntegrationPicker from './IntegrationPicker';
import NodeDropdown from './NodeDropdown';
import './WorkflowNode.css';

const WorkflowNode = ({ type, color, icon }) => {
  const [integration, setIntegration] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleIntegrationSelect = (app) => {
    setIntegration(app);
    setShowPicker(false);
  };

  const handleRename = () => {
    const newName = prompt('Enter new name for the node:');
    if (newName) {
      setIntegration({ ...integration, name: newName });
    }
    setShowDropdown(false);
  };

  const handleDelete = () => {
    alert('Delete node logic goes here.');
    setShowDropdown(false);
  };

  const openIntegrationModal = () => {
    setShowPicker(true);
    setShowDropdown(false);
  };

  return (
    <>
      <div
        className={`workflow-node ${type}`}
        style={{ borderLeftColor: color }}
        

      >
        <div className="node-header">
          <div className="node-icon" style={{ backgroundColor: `${color}20` }}>
            <FontAwesomeIcon icon={icon} style={{ color, fontSize: '1.25rem' }} />
          </div>
          <div className="node-title">
            <h3>{type === 'trigger' ? 'Trigger' : 'Action'}</h3>
            <p>{type === 'trigger' ? 'When this happens' : 'Do this'}</p>
          </div>
          <button
            className="node-menu"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
          >
            <span className="menu-dot"></span>
            <span className="menu-dot"></span>
            <span className="menu-dot"></span>
          </button>

          {showDropdown && (
            <NodeDropdown
              onRename={handleRename}
              onDelete={handleDelete}
              onSelectIntegration={openIntegrationModal}
            />
          )}
        </div>

        {integration && (
          <div className="node-content">
            <h4>{integration.name}</h4>
          </div>
        )}
      </div>

      {/* Render IntegrationPicker outside the node */}
      
    </>
  );
};

export default WorkflowNode;