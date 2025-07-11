import React, { useState, useEffect } from 'react';

const GoogleCalendarTriggerConfig = ({ nodeId, initialConfig, onConfigChange }) => {
  const [triggerType, setTriggerType] = useState(initialConfig?.triggerType || 'newEvent');
  const [calendarId, setCalendarId] = useState(initialConfig?.calendarId || 'primary');
  const [keywords, setKeywords] = useState(initialConfig?.keywords || '');
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  // IMPORTANT: Replace 'YOUR_GOOGLE_CLOUD_CLIENT_ID' with your actual Client ID from Google Cloud Console.
  // For production, this should be loaded securely (e.g., from a canister or environment variable).
  const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLOUD_CLIENT_ID';

  // IMPORTANT: This REDIRECT_URI MUST EXACTLY MATCH what you configured in Google Cloud Console.
  // It should be your frontend canister's URL.
  // DFX automatically injects CANISTER_ID_ZAPIER_AUTOMATION_FRONTEND during build if configured in dfx.json.
  // Example for local DFX: http://127.0.0.1:4943/?canisterId=YOUR_FRONTEND_CANISTER_ID
  const GOOGLE_REDIRECT_URI = `http://127.0.0.1:4943/?canisterId=${process.env.CANISTER_ID_ZAPIER_AUTOMATION_FRONTEND}`;

  useEffect(() => {
    // Call onConfigChange whenever local state changes
    if (onConfigChange) {
      onConfigChange({
        triggerType,
        calendarId,
        keywords,
      });
    }
  }, [triggerType, calendarId, keywords, onConfigChange]);

  const handleConnectGoogle = () => {
    setIsConnectingGoogle(true);
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `scope=https://www.googleapis.com/auth/calendar.events.readonly&` + // Request read-only access to calendar events
      `access_type=offline&` + // Request a refresh token for long-term access
      `include_granted_scopes=true&` +
      `response_type=code&` +
      `state=${nodeId}&` + // Pass the nodeId as state for context in callback
      `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&` +
      `client_id=${GOOGLE_CLIENT_ID}`;

    window.location.href = authUrl; // Redirect user to Google's consent screen
  };

  return (
    <div className="card bg-secondary text-white p-3 mb-3 border border-dark rounded"> {/* Bootstrap card for styling */}
      <div className="card-body">
        <h4 className="card-title h5 fw-semibold mb-3">Google Calendar Trigger Settings</h4>

        <div className="mb-3">
          <label htmlFor="triggerType" className="form-label text-muted small mb-1">
            Trigger When:
          </label>
          <select
            id="triggerType"
            value={triggerType}
            onChange={(e) => setTriggerType(e.target.value)}
            className="form-select form-select-sm bg-dark text-white border-secondary" // Bootstrap form-select
          >
            <option value="newEvent">New Event Created</option>
            <option value="eventStarts">Event Starts Soon</option>
            <option value="eventEnds">Event Ends</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="calendarId" className="form-label text-muted small mb-1">
            Calendar ID (e.g., 'primary'):
          </label>
          <input
            type="text"
            id="calendarId"
            value={calendarId}
            onChange={(e) => setCalendarId(e.target.value)}
            placeholder="primary"
            className="form-control form-control-sm bg-dark text-white border-secondary" // Bootstrap form-control
          />
        </div>

        <div className="mb-3">
          <label htmlFor="keywords" className="form-label text-muted small mb-1">
            Keywords (optional, in event title):
          </label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., 'meeting', 'deadline'"
            className="form-control form-control-sm bg-dark text-white border-secondary" // Bootstrap form-control
          />
        </div>

        <button
          onClick={handleConnectGoogle}
          disabled={isConnectingGoogle}
          className="btn btn-primary w-100 mt-3" // Bootstrap button
        >
          {isConnectingGoogle ? 'Connecting...' : 'Connect Google Account'}
        </button>
      </div>
    </div>
  );
};

export default GoogleCalendarTriggerConfig;
