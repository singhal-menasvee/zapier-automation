import React from 'react';

const GoogleCalendarPanel = ({ onConnect, onClose }) => {
  return (
    // Replaced Tailwind classes with Bootstrap 5 classes
    <div className="card p-4 shadow-sm bg-dark text-white border border-secondary rounded"> {/* card, p-4, shadow-sm, bg-dark, text-white, border, border-secondary, rounded */}
      <div className="d-flex justify-content-between align-items-center mb-4"> {/* d-flex justify-content-between align-items-center mb-4 */}
        <h2 className="h5 card-title mb-0 text-white">Connect Google Calendar</h2> {/* h5 card-title mb-0 text-white */}
        <button
          onClick={onClose}
          className="btn btn-sm text-muted" // btn btn-sm text-muted
          aria-label="Close" // Added for accessibility
        >
          &times; {/* ✕ -> &times; for better cross icon */}
        </button>
      </div>
      <p className="card-text text-secondary mb-4"> {/* card-text text-secondary mb-4 */}
        Authorize access to your Google Calendar to use it as a trigger.
      </p>
      <button
        onClick={onConnect}
        className="btn btn-primary w-100" // btn btn-primary w-100
      >
        Connect Google Calendar
      </button>
    </div>
  );
};

export default GoogleCalendarPanel;
