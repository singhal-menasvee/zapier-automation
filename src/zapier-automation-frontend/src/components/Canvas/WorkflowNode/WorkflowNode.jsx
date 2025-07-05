import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IntegrationPicker from './IntegrationPicker';
import GoogleCalendarPanel from '../GoogleCalendarPanel';
import './WorkflowNode.css';

const WorkflowNode = ({ type, color, icon, onAppSelect }) => {
  const [integration, setIntegration] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showCalendarPanel, setShowCalendarPanel] = useState(false);
  const pickerRef = useRef(null);

  const handleIntegrationSelect = (app) => {
    setIntegration(app);
    setShowPicker(false);

    if (app.name === 'Google Calendar') {
      setShowCalendarPanel(true);
    } else {
      setShowCalendarPanel(false);
    }

    if (onAppSelect) {
      onAppSelect(app);
    }
  };

  // 🧠 Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="workflow-node-wrapper" style={{ position: 'relative' }}>
      <div className={`workflow-node ${type}`} style={{ borderLeftColor: color }}>
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
              setShowPicker(!showPicker);
            }}
          >
            <span className="menu-dot"></span>
            <span className="menu-dot"></span>
            <span className="menu-dot"></span>
          </button>
        </div>

        {integration && (
          <div className="node-content">
            <h4>{integration.name}</h4>
          </div>
        )}
      </div>

      {showPicker && (
        <div
          ref={pickerRef}
          className="integration-picker-wrapper"
          style={{
            position: 'absolute',
            top: '50px',
            right: '10px',
            zIndex: 999,
          }}
        >
          <IntegrationPicker onSelect={handleIntegrationSelect} />
        </div>
      )}

      {/* {showCalendarPanel && (
        <div style={{ marginTop: '1rem' }}>
          <GoogleCalendarPanel onConnect={() => alert('Google OAuth starts here')} />
        </div>
      )} */}
    </div>
  );
};

export default WorkflowNode;
