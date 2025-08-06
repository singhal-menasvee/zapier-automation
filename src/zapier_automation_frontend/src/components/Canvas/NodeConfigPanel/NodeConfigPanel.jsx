// NodeConfigPanel.jsx
import React from 'react';
import GoogleCalendarPanel from '../GoogleCalendarPanel';
import './NodeConfigPanel.css';

const NodeConfigPanel = ({ app, onClose }) => {
  if (!app) return null;

  return (
    <div className="node-config-panel">
      <div className="node-config-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>⚙️ {app.name}</h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#aaa', 
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            ✕
          </button>
        </div>
        <p>Configure your {app.name} integration</p>
      </div>

      <div className="node-config-body">
        <div className="trigger-options">
          <label htmlFor="trigger-event">Trigger Event</label>
          <select id="trigger-event">
            <option>Choose an event</option>
            <option>New Event Created</option>
            <option>Event Updated</option>
            <option>Event Deleted</option>
            <option>Event Reminder</option>
          </select>
        </div>

        <div className="panel-section">
          <label htmlFor="account-connect">Account</label>
          {app.name === 'Google Calendar' && (
            <div className="google-panel">
              <GoogleCalendarPanel  
                onClose={onClose}
              />
            </div>
          )}
          {app.name !== 'Google Calendar' && (
            <button className="connect-button">Connect {app.name}</button>
          )}
        </div>

        <div className="panel-section">
          <label htmlFor="calendar-select">Calendar</label>
          <select id="calendar-select">
            <option>Select a calendar</option>
            <option>Primary Calendar</option>
            <option>Work Calendar</option>
            <option>Personal Calendar</option>
          </select>
        </div>

        <div className="panel-section">
          <label htmlFor="filter-options">Filter Options</label>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <input type="checkbox" style={{ marginRight: '0.5rem' }} />
              Only events I'm the organizer of
            </label>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <input type="checkbox" style={{ marginRight: '0.5rem' }} />
              Only events with attendees
            </label>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <input type="checkbox" style={{ marginRight: '0.5rem' }} />
              Only all-day events
            </label>
          </div>
        </div>

        <div className="panel-section">
          <label htmlFor="keyword-filter">Keyword Filter</label>
          <input 
            type="text" 
            id="keyword-filter" 
            placeholder="Enter keywords to filter events"
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#2e2e40',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}
          />
        </div>

        <div className="panel-section">
          <label htmlFor="time-range">Time Range</label>
          <select id="time-range">
            <option>Any time</option>
            <option>Next 15 minutes</option>
            <option>Next hour</option>
            <option>Next 24 hours</option>
            <option>Next week</option>
          </select>
        </div>

        <div className="continue-button">
          <button className="connect-button">Continue</button>
        </div>
      </div>
    </div>
  );
};

export default NodeConfigPanel;