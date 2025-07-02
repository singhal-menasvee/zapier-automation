import React from 'react';

const GoogleCalendarPanel = ({ onConnect, onClose }) => {
  return (
    <div className="p-4 bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Connect Google Calendar</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ✕
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Authorize access to your Google Calendar to use it as a trigger.
      </p>
      <button
        onClick={onConnect}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Connect Google Calendar
      </button>
    </div>
  );
};

export default GoogleCalendarPanel;