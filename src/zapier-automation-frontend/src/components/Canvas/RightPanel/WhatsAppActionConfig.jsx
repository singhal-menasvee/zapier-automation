import React, { useState, useEffect } from 'react';

const WhatsAppActionConfig = ({ nodeId, initialConfig, onConfigChange }) => {
  const [actionType, setActionType] = useState(initialConfig?.actionType || 'sendMessage');
  const [phoneNumber, setPhoneNumber] = useState(initialConfig?.phoneNumber || '');
  const [messageText, setMessageText] = useState(initialConfig?.messageText || '');
  const [isConnectingWhatsApp, setIsConnectingWhatsApp] = useState(false);

  // IMPORTANT: WhatsApp Business API setup is complex and typically involves
  // Facebook Developer account, a Business Manager, and a verified phone number.
  // The "connection" here would usually involve setting up webhooks and
  // securely storing API credentials (e.g., a permanent access token).
  // For a direct OAuth-like flow from the frontend, it's not typical for WhatsApp.
  // This button is a placeholder for initiating that backend setup/connection.
  const WHATSAPP_API_URL = 'YOUR_WHATSAPP_BUSINESS_API_ENDPOINT'; // Example: https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages
  const WHATSAPP_APP_ID = 'YOUR_FACEBOOK_APP_ID'; // Used for Facebook Login if you integrate that way

  useEffect(() => {
    // Call onConfigChange whenever local state changes
    if (onConfigChange) {
      onConfigChange({
        actionType,
        phoneNumber,
        messageText,
      });
    }
  }, [actionType, phoneNumber, messageText, onConfigChange]);

  const handleConnectWhatsApp = () => {
    setIsConnectingWhatsApp(true);
    // In a real scenario, this would trigger a backend process
    // to authenticate with WhatsApp Business API (e.g., via Facebook Login for Business,
    // or by directing user to set up webhooks/provide API keys).
    console.log("Initiating WhatsApp Business API connection process...");
    // For now, simulate a connection attempt
    setTimeout(() => {
      setIsConnectingWhatsApp(false);
      alert("WhatsApp connection initiated. Please complete setup in your backend/Facebook Business Manager.");
    }, 2000);
  };

  return (
    <div className="card bg-secondary text-white p-3 mb-3 border border-dark rounded">
      <div className="card-body">
        <h4 className="card-title h5 fw-semibold mb-3">WhatsApp Action Settings</h4>

        <div className="mb-3">
          <label htmlFor="whatsAppActionType" className="form-label text-muted small mb-1">
            Action Type:
          </label>
          <select
            id="whatsAppActionType"
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            className="form-select form-select-sm bg-dark text-white border-secondary"
          >
            <option value="sendMessage">Send Message</option>
            {/* Add more WhatsApp action types as needed (e.g., send media) */}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="whatsAppPhoneNumber" className="form-label text-muted small mb-1">
            Recipient Phone Number (with country code, e.g., +1234567890):
          </label>
          <input
            type="tel" // Use type="tel" for phone numbers
            id="whatsAppPhoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g., +1234567890"
            className="form-control form-control-sm bg-dark text-white border-secondary"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="whatsAppMessageText" className="form-label text-muted small mb-1">
            Message Text:
          </label>
          <textarea
            id="whatsAppMessageText"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Enter message to send..."
            rows="3"
            className="form-control form-control-sm bg-dark text-white border-secondary"
          ></textarea>
        </div>

        <button
          onClick={handleConnectWhatsApp}
          disabled={isConnectingWhatsApp}
          className="btn btn-primary w-100 mt-3"
        >
          {isConnectingWhatsApp ? 'Connecting...' : 'Connect WhatsApp Business API'}
        </button>
      </div>
    </div>
  );
};

export default WhatsAppActionConfig;
