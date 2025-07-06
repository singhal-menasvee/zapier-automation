import React from 'react';

const CLIENT_ID = '548274771061-rpqt1l6i19hucmpar07nis5obr5shm0j.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:3000/OAuth2Callback';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const GoogleCalendarPanel = ({ onClose }) => {
  const handleGoogleOAuth = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  };

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
        onClick={handleGoogleOAuth}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Connect Google Calendar
      </button>
    </div>
  );
};

export default GoogleCalendarPanel;
