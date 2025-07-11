import React, { useState, useEffect } from 'react';

const SlackActionConfig = ({ nodeId, initialConfig, onConfigChange }) => {
  const [actionType, setActionType] = useState(initialConfig?.actionType || 'sendMessage');
  const [channelId, setChannelId] = useState(initialConfig?.channelId || '');
  const [messageText, setMessageText] = useState(initialConfig?.messageText || '');
  const [isConnectingSlack, setIsConnectingSlack] = useState(false);

  // IMPORTANT: You would typically get your Slack App's Client ID and Redirect URI
  // from your Slack API dashboard. These should be loaded securely.
  const SLACK_CLIENT_ID = 'YOUR_SLACK_APP_CLIENT_ID';
  const SLACK_REDIRECT_URI = `http://127.0.0.1:4943/?canisterId=${process.env.CANISTER_ID_ZAPIER_AUTOMATION_FRONTEND}`;

  useEffect(() => {
    // Call onConfigChange whenever local state changes
    if (onConfigChange) {
      onConfigChange({
        actionType,
        channelId,
        messageText,
      });
    }
  }, [actionType, channelId, messageText, onConfigChange]);

  const handleConnectSlack = () => {
    setIsConnectingSlack(true);
    // Slack OAuth URL construction
    const authUrl =
      `https://slack.com/oauth/v2/authorize?` +
      `client_id=${SLACK_CLIENT_ID}&` +
      `scope=chat:write,channels:read&` + // Request necessary scopes (e.g., to write messages, read channels)
      `user_scope=&` + // User scopes if needed (e.g., chat:write.customize)
      `redirect_uri=${encodeURIComponent(SLACK_REDIRECT_URI)}&` +
      `state=${nodeId}`; // Pass the nodeId as state for context in callback

    window.location.href = authUrl; // Redirect user to Slack's consent screen
  };

  return (
    <div className="card bg-secondary text-white p-3 mb-3 border border-dark rounded">
      <div className="card-body">
        <h4 className="card-title h5 fw-semibold mb-3">Slack Action Settings</h4>

        <div className="mb-3">
          <label htmlFor="slackActionType" className="form-label text-muted small mb-1">
            Action Type:
          </label>
          <select
            id="slackActionType"
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            className="form-select form-select-sm bg-dark text-white border-secondary"
          >
            <option value="sendMessage">Send Message to Channel</option>
            <option value="postEphemeral">Post Ephemeral Message</option>
            {/* Add more Slack action types as needed */}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="slackChannelId" className="form-label text-muted small mb-1">
            Channel ID (e.g., C1234567890 or #general):
          </label>
          <input
            type="text"
            id="slackChannelId"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            placeholder="e.g., #general or C1234567890"
            className="form-control form-control-sm bg-dark text-white border-secondary"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="slackMessageText" className="form-label text-muted small mb-1">
            Message Text:
          </label>
          <textarea
            id="slackMessageText"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Enter message to send..."
            rows="3"
            className="form-control form-control-sm bg-dark text-white border-secondary"
          ></textarea>
        </div>

        <button
          onClick={handleConnectSlack}
          disabled={isConnectingSlack}
          className="btn btn-primary w-100 mt-3"
        >
          {isConnectingSlack ? 'Connecting...' : 'Connect Slack Account'}
        </button>
      </div>
    </div>
  );
};

export default SlackActionConfig;
