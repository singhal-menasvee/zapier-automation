import React, { useState, useEffect } from 'react';
import { zapier_automation_backend } from "declarations/zapier_automation_backend";

const GoogleCalendarPanel = ({ onClose, onConnect, selectedTrigger }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCalendar, setSelectedCalendar] = useState('');
  const [eventType, setEventType] = useState('new_event');

  // Check connection status on mount
  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        const hasToken = await zapier_automation_backend.has_google_token("");
        setIsConnected(hasToken);

        if (hasToken) {
          await fetchCalendars();
        }
      } catch (err) {
        console.error('Error checking connection:', err);
        setError('Failed to check connection status');
      }
    };
    checkConnectionStatus();
  }, []);

  const fetchCalendars = async () => {
    setLoading(true);
    setError('');
    try {
      const calendarList = await zapier_automation_backend.get_google_calendars();
      setCalendars(calendarList);
    } catch (err) {
      console.error('Error fetching calendars:', err);
      setError('Failed to fetch calendars. Please try reconnecting.');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleOAuth = async () => {
    try {
      setLoading(true);
      setError('');

      // Generate a secure state token
      const state = crypto.randomUUID();
      localStorage.setItem('google_oauth_state', state);

      // For debugging (remove in production)
      console.log('Generated OAuth state:', state);
      console.log('Saved OAuth state in localStorage:', localStorage.getItem('google_oauth_state'));

      // Get auth URL from backend
      const authUrl = await zapier_automation_backend.get_google_auth_url(state);

      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (err) {
      console.error('OAuth initiation failed:', err);
      setError('Failed to start authentication. Please try again.');
      setLoading(false);
    }
  };

  const handleConnect = () => {
    if (selectedCalendar && eventType) {
      const triggerData = {
        type: 'google_calendar',
        calendar_id: selectedCalendar,
        event_type: eventType,
        calendar_name: calendars.find(cal => cal.id === selectedCalendar)?.summary || 'Selected Calendar',
        connected: true
      };
      onConnect(triggerData);
      onClose();
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      await zapier_automation_backend.revoke_google_token();
      setIsConnected(false);
      setCalendars([]);
      setSelectedCalendar('');
    } catch (err) {
      console.error('Disconnect failed:', err);
      setError('Failed to disconnect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Google Calendar</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-lg font-bold"
        >
          ✕
        </button>
      </div>

      {!isConnected ? (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Connect your Google Calendar to use it as a trigger for your workflows.
          </p>
          <button
            onClick={handleGoogleOAuth}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Connect Google Calendar
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Connected</span>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Disconnect
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Loading calendars...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={fetchCalendars}
                className="text-xs text-red-700 hover:text-red-900 mt-1"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Calendar
                </label>
                <select
                  value={selectedCalendar}
                  onChange={(e) => setSelectedCalendar(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Choose a calendar...</option>
                  {calendars.map((calendar) => (
                    <option key={calendar.id} value={calendar.id}>
                      {calendar.summary}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger Event
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="new_event">New Event Created</option>
                  <option value="updated_event">Event Updated</option>
                  <option value="deleted_event">Event Deleted</option>
                  <option value="event_starting">Event Starting Soon</option>
                </select>
              </div>

              <button
                onClick={handleConnect}
                disabled={!selectedCalendar}
                className={`w-full px-4 py-2 rounded-md transition-colors ${
                  selectedCalendar
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Use This Trigger
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarPanel;
