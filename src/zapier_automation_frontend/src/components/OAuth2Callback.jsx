// src/components/OAuth2Callback.jsx 
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { zapier_automation_backend } from "declarations/zapier_automation_backend";

/**
 * Handles the redirect step of Google OAuth2.
 * Exchanges 'code' in the URL for tokens via backend, while verifying 'state' (CSRF protection).
 */

const ENABLE_DEBUG = true; // << Turn on debugging

// Google OAuth details (must match backend web2.rs constants)
const GOOGLE_CLIENT_ID =
  "548274771061-rpqt1l6i19hucmpar07nis5obr5shm0j.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:3000/OAuth2Callback";

export default function OAuth2Callback() {
  const [status, setStatus] = useState("Waiting for authentication...");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract "code" from redirect URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const state = searchParams.get("state");

    // Retrieve state from sessionStorage, fallback to localStorage
    let storedState = sessionStorage.getItem("google_oauth_state");
    if (!storedState) {
      storedState = localStorage.getItem("google_oauth_state");
    }

    // === Debug logging ===
    if (ENABLE_DEBUG) {
      console.log("=== [OAuth2Callback] ===");
      console.log("[Callback] URL query state:      ", state);
      console.log("[Callback] SessionStorage state: ", sessionStorage.getItem("google_oauth_state"));
      console.log("[Callback] LocalStorage state:   ", localStorage.getItem("google_oauth_state"));
      console.log("[Callback] Resolved storedState: ", storedState);
      console.log("[Callback] URL query code:       ", code);
      console.log("[Callback] URL query error:      ", error);
      console.log("[Callback] Full location.search: ", location.search);
    }

    const exchangeCode = async () => {
      try {
        // OAuth2 error from Google
        if (error) {
          setStatus(`OAuth error: ${error}`);
          if (ENABLE_DEBUG) console.error("[Callback] OAuth error:", error);
          setTimeout(() => navigate("/Canvas?error=oauth_error"), 1200);
          return;
        }

        // No code returned
        if (!code) {
          setStatus("Missing authorization code.");
          setTimeout(() => navigate("/Canvas?error=missing_code"), 1200);
          return;
        }

        // CSRF/State check
        if (!state || !storedState || state !== storedState) {
          setStatus("Invalid state parameter.");
          if (ENABLE_DEBUG) console.error("[Callback] OAuth state mismatch:", { state, storedState });
          setTimeout(() => navigate("/Canvas?error=invalid_state"), 1400);
          return;
        }

        // Clear the state value from storage after verification
        sessionStorage.removeItem("google_oauth_state");
        localStorage.removeItem("google_oauth_state"); // Clean both just in case

        setStatus("Exchanging code for tokens...");
        if (ENABLE_DEBUG) {
          console.log("[Callback] Exchanging code for tokens with state:", state, "code:", code);
        }

        const tokenResponse = await zapier_automation_backend.exchange_google_code_v2(code, state);

        if ("ok" in tokenResponse) {
          const token = tokenResponse.ok;
          localStorage.setItem("google_connected", "true");
          localStorage.setItem("google_access_token", token.access_token);

          setStatus("Google connected successfully. Redirecting...");
          if (ENABLE_DEBUG) {
            console.log("[Callback] OAuth exchange successful; access_token:", token.access_token);
          }
          setTimeout(() => {
            navigate("/Canvas?google_connected=true");
          }, 1700);
        } else {
          if (ENABLE_DEBUG) console.error("[Callback] Backend returned error:", tokenResponse.err);
          setStatus("Failed to exchange code: " + tokenResponse.err);
          setTimeout(() => {
            navigate(`/Canvas?error=${encodeURIComponent(tokenResponse.err)}`);
          }, 1500);
        }
      } catch (err) {
        if (ENABLE_DEBUG) console.error("[Callback] OAuth Error:", err);
        setStatus("Failed to exchange code.");
        setTimeout(() => {
          navigate(`/Canvas?error=${encodeURIComponent(err.message || "exchange_failed")}`);
        }, 1400);
      }
    };

    exchangeCode();
  }, [location, navigate]);

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
 