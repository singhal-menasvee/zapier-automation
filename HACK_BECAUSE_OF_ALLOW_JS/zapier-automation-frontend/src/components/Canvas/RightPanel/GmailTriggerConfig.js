import React, { useState, useEffect } from 'react';
const GmailTriggerConfig = ({ nodeId, initialConfig, onConfigChange }) => {
    const [triggerType, setTriggerType] = useState(initialConfig?.triggerType || 'newEmail');
    const [senderEmail, setSenderEmail] = useState(initialConfig?.senderEmail || '');
    const [subjectKeywords, setSubjectKeywords] = useState(initialConfig?.subjectKeywords || '');
    const [isConnectingGmail, setIsConnectingGmail] = useState(false);
    // IMPORTANT: Replace 'YOUR_GOOGLE_CLOUD_CLIENT_ID' with your actual Client ID from Google Cloud Console.
    // This client ID should be configured for Gmail API access.
    const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLOUD_CLIENT_ID';
    // IMPORTANT: This REDIRECT_URI MUST EXACTLY MATCH what you configured in Google Cloud Console.
    const GOOGLE_REDIRECT_URI = `http://127.0.0.1:4943/?canisterId=${process.env.CANISTER_ID_ZAPIER_AUTOMATION_FRONTEND}`;
    useEffect(() => {
        // Call onConfigChange whenever local state changes
        if (onConfigChange) {
            onConfigChange({
                triggerType,
                senderEmail,
                subjectKeywords,
            });
        }
    }, [triggerType, senderEmail, subjectKeywords, onConfigChange]);
    const handleConnectGmail = () => {
        setIsConnectingGmail(true);
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `scope=https://www.googleapis.com/auth/gmail.readonly&` + // Request read-only access to Gmail
            `access_type=offline&` +
            `include_granted_scopes=true&` +
            `response_type=code&` +
            `state=${nodeId}&` +
            `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&` +
            `client_id=${GOOGLE_CLIENT_ID}`;
        window.location.href = authUrl; // Redirect user to Google's consent screen
    };
    return (<div className="card bg-secondary text-white p-3 mb-3 border border-dark rounded"> {/* Bootstrap card for styling */}
      <div className="card-body">
        <h4 className="card-title h5 fw-semibold mb-3">Gmail Trigger Settings</h4>

        <div className="mb-3">
          <label htmlFor="gmailTriggerType" className="form-label text-muted small mb-1">
            Trigger When:
          </label>
          <select id="gmailTriggerType" value={triggerType} onChange={(e) => setTriggerType(e.target.value)} className="form-select form-select-sm bg-dark text-white border-secondary" // Bootstrap form-select
    >
            <option value="newEmail">New Email Received</option>
            <option value="emailFromSpecificSender">Email From Specific Sender</option>
            <option value="emailWithSubject">Email With Specific Subject</option>
          </select>
        </div>

        {triggerType === 'emailFromSpecificSender' && (<div className="mb-3">
            <label htmlFor="senderEmail" className="form-label text-muted small mb-1">
              Sender Email:
            </label>
            <input type="email" id="senderEmail" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} placeholder="sender@example.com" className="form-control form-control-sm bg-dark text-white border-secondary"/>
          </div>)}

        {triggerType === 'emailWithSubject' && (<div className="mb-3">
            <label htmlFor="subjectKeywords" className="form-label text-muted small mb-1">
              Subject Keywords:
            </label>
            <input type="text" id="subjectKeywords" value={subjectKeywords} onChange={(e) => setSubjectKeywords(e.target.value)} placeholder="e.g., 'invoice', 'report'" className="form-control form-control-sm bg-dark text-white border-secondary"/>
          </div>)}

        <button onClick={handleConnectGmail} disabled={isConnectingGmail} className="btn btn-primary w-100 mt-3" // Bootstrap button
    >
          {isConnectingGmail ? 'Connecting...' : 'Connect Gmail Account'}
        </button>
      </div>
    </div>);
};
export default GmailTriggerConfig;
