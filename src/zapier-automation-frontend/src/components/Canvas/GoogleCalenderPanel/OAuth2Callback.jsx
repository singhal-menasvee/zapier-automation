import React, { useEffect, useState } from 'react';

const OAuth2Callback = () => {
  const [message, setMessage] = useState('Processing Google authentication...');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        setMessage(`Google authentication failed: ${error}`);
        console.error("Google OAuth Error:", error);
        // Optionally redirect to login page after a delay
        setTimeout(() => {
          window.location.href = '/'; // Redirect to home/login
        }, 3000);
        return;
      }

      if (code) {
        setMessage('Authorization code received. Exchanging code for tokens...');
        console.log("Google Authorization Code:", code);

        // --- IMPORTANT: Backend Call Required Here ---
        // This is where you would send the 'code' to your backend canister
        // (zapier-automation-backend) to exchange it for access and refresh tokens
        // with Google's OAuth API.
        // The backend call would look something like this (pseudo-code):
        /*
        try {
          const response = await yourBackendCanister.exchangeGoogleAuthCode(code);
          if (response.success) {
            setMessage('Successfully logged in with Google! Redirecting...');
            console.log("Backend exchange successful:", response);
            // Redirect to your main application dashboard or workflow page
            window.location.href = '/'; // Or a specific authenticated route
          } else {
            setMessage(`Failed to exchange code: ${response.error}`);
            console.error("Backend exchange failed:", response.error);
          }
        } catch (backendError) {
          setMessage(`Error communicating with backend: ${backendError.message}`);
          console.error("Backend communication error:", backendError);
        }
        */

        // For now, without the backend logic, we'll just log and redirect
        console.warn("Backend logic for Google OAuth token exchange is not yet implemented.");
        setMessage('Authorization code processed. Backend exchange not implemented. Redirecting...');
        setTimeout(() => {
          window.location.href = '/'; // Redirect to home/login
        }, 3000);

      } else {
        setMessage('No authorization code found in URL. Redirecting...');
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    };

    handleGoogleCallback();
  }, []);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-white p-4">
      <h2 className="text-center">{message}</h2>
      <p className="text-muted mt-3">Please wait...</p>
    </div>
  );
};

export default OAuth2Callback;
