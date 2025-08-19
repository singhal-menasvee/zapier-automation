// src/components/OAuth2Callback.jsx 
import React, { useEffect, useState } from "react";

// Google OAuth details (must match backend web2.rs constants)
const GOOGLE_CLIENT_ID =
  "548274771061-rpqt1l6i19hucmpar07nis5obr5shm0j.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:3000/OAuth2Callback";

export default function OAuth2Callback() {
  const [status, setStatus] = useState("Waiting for authentication...");

  // Extract "code" from redirect URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      setStatus("No authorization code found in redirect.");
      return;
    }

    setStatus("Exchanging code for tokens...");

    // Call backend canister method
    (async () => {
      try {
        const response = await fetch(
          "http://localhost:4943/api/v2/canister/uxrrr-q7777-77774-qaaaq-cai/call",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              method: "google_oauth_callback",
              args: [code],
            }),
          }
        );

        if (!response.ok) throw new Error("Backend request failed");

        setStatus("✅ Successfully connected to Google Sheets!");
      } catch (err) {
        setStatus("❌ Failed to exchange code: " + err.message);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-xl font-bold mb-4">Google OAuth2 Callback</h1>
      <p>{status}</p>
    </div>
  );
}

// This button is imported in TriggerTypeSelector.jsx
export function ConnectSheetsButton() {
  const handleClick = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code&scope=${encodeURIComponent(
      "https://www.googleapis.com/auth/calendar.readonly"
    )}&access_type=offline&prompt=consent`;

    console.log("🔗 Redirecting to:", authUrl); // 👈 Added debug log

    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md"
    >
      Connect Google Sheets
    </button>
  );
}
