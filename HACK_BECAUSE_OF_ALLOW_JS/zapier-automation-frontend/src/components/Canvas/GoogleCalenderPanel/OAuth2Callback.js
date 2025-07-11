import React, { useEffect, useState } from "react";
const OAuth2Callback = () => {
    const [message, setMessage] = useState("Connecting your Google Account...");
    const [error, setError] = useState(null);
    useEffect(() => {
        const handleOAuthCallback = async () => {
            // Extract the authorization code and state from the URL query parameters
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");
            const state = urlParams.get("state"); // The state parameter should contain the nodeId
            if (code) {
                setMessage("Exchanging authorization code for tokens...");
                try {
                    // Make a POST request to your backend canister's API endpoint
                    // This endpoint will handle the server-side exchange of the code for access/refresh tokens
                    const response = await fetch('/api/exchange-token', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code, state }), // Pass the code and state (nodeId) to the backend
                    });
                    if (!response.ok) {
                        // If the response is not OK (e.g., 4xx or 5xx status)
                        const errorData = await response.json();
                        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log("Access token (received by backend):", data.access_token);
                    console.log("Refresh token (received by backend):", data.refresh_token);
                    console.log("Node ID (from state):", state);
                    // TODO: Implement logic to store these tokens securely in your backend canister
                    // The backend canister should associate these tokens with the user's principal
                    // and the specific workflow node (using the 'state' parameter which is the nodeId).
                    setMessage("Google Account connected successfully! Redirecting...");
                    // After successful token exchange, redirect the user back to the main app
                    // or a specific part of the workflow builder.
                    // You might want to pass a success message or flag via URL params here.
                    setTimeout(() => {
                        // Redirect to the main application dashboard or the workflow builder
                        // Remove query parameters from the URL to clean it up
                        const cleanUrl = window.location.origin + window.location.pathname.replace('/oauth2-callback', '');
                        window.location.replace(cleanUrl);
                    }, 2000); // Redirect after 2 seconds
                }
                catch (err) {
                    console.error("Error during token exchange:", err);
                    setError(`Failed to connect Google Account: ${err.message}. Please try again.`);
                    setMessage("Connection failed.");
                }
            }
            else {
                setError("No authorization code found in the URL. Google connection failed or was cancelled.");
                setMessage("Connection cancelled or failed.");
            }
        };
        handleOAuthCallback();
    }, []); // Empty dependency array ensures this runs only once on mount
    return (<div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white p-4">
      <div className="card bg-secondary p-4 shadow-lg text-center mx-auto" style={{ maxWidth: '400px' }}> {/* Bootstrap card for styling */}
        <div className="card-body">
          <h2 className="card-title h4 fw-semibold mb-3">{message}</h2>
          {error && (<p className="card-text text-danger small mt-2">{error}</p>)}
          {!error && message.includes("Redirecting") && (<p className="card-text text-muted small mt-2">You will be redirected shortly.</p>)}
        </div>
      </div>
    </div>);
};
export default OAuth2Callback;
