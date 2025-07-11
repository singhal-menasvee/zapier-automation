import React, { useState, useEffect } from 'react';
const DiscordActionConfig = ({ nodeId, initialConfig, onConfigChange }) => {
    const [actionType, setActionType] = useState(initialConfig?.actionType || 'sendMessage');
    const [channelId, setChannelId] = useState(initialConfig?.channelId || '');
    const [messageText, setMessageText] = useState(initialConfig?.messageText || '');
    const [isConnectingDiscord, setIsConnectingDiscord] = useState(false);
    // IMPORTANT: You would typically get your Discord Bot's Client ID and Redirect URI
    // from your Discord Developer Portal. These should be loaded securely.
    const DISCORD_CLIENT_ID = 'YOUR_DISCORD_APP_CLIENT_ID';
    const DISCORD_REDIRECT_URI = `http://127.0.0.1:4943/?canisterId=${process.env.CANISTER_ID_ZAPIER_AUTOMATION_FRONTEND}`;
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
    const handleConnectDiscord = () => {
        setIsConnectingDiscord(true);
        // Discord OAuth2 URL construction for bot authorization
        // Scopes needed depend on what your bot will do (e.g., 'bot' for general bot actions,
        // 'webhook.incoming' for webhooks, 'guilds.members.read' for member info)
        const authUrl = `https://discord.com/oauth2/authorize?` +
            `client_id=${DISCORD_CLIENT_ID}&` +
            `scope=bot&` + // Example scope: 'bot' for basic bot functionality
            `permissions=8&` + // Example: Administrator permissions (use with caution, define specific permissions)
            `redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&` +
            `response_type=code&` +
            `state=${nodeId}`; // Pass the nodeId as state for context in callback
        window.location.href = authUrl; // Redirect user to Discord's authorization screen
    };
    return (<div className="card bg-secondary text-white p-3 mb-3 border border-dark rounded">
      <div className="card-body">
        <h4 className="card-title h5 fw-semibold mb-3">Discord Action Settings</h4>

        <div className="mb-3">
          <label htmlFor="discordActionType" className="form-label text-muted small mb-1">
            Action Type:
          </label>
          <select id="discordActionType" value={actionType} onChange={(e) => setActionType(e.target.value)} className="form-select form-select-sm bg-dark text-white border-secondary">
            <option value="sendMessage">Send Message to Channel</option>
            <option value="createThread">Create Thread</option>
            {/* Add more Discord action types as needed */}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="discordChannelId" className="form-label text-muted small mb-1">
            Channel ID (e.g., 123456789012345678):
          </label>
          <input type="text" id="discordChannelId" value={channelId} onChange={(e) => setChannelId(e.target.value)} placeholder="e.g., 123456789012345678" className="form-control form-control-sm bg-dark text-white border-secondary"/>
        </div>

        <div className="mb-3">
          <label htmlFor="discordMessageText" className="form-label text-muted small mb-1">
            Message Text:
          </label>
          <textarea id="discordMessageText" value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Enter message to send..." rows="3" className="form-control form-control-sm bg-dark text-white border-secondary"></textarea>
        </div>

        <button onClick={handleConnectDiscord} disabled={isConnectingDiscord} className="btn btn-primary w-100 mt-3">
          {isConnectingDiscord ? 'Connecting...' : 'Connect Discord Account'}
        </button>
      </div>
    </div>);
};
export default DiscordActionConfig;
