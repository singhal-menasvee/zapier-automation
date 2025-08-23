// src/components/OAuth2Callback.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { zapier_automation_backend } from "declarations/zapier_automation_backend";

/**
 * Handles the redirect step of Google OAuth2.
 * Exchanges 'code' in the URL for tokens via backend, while verifying 'state' (CSRF protection).
 */

const ENABLE_DEBUG = true; // Toggle debugging

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

    if (ENABLE_DEBUG) {
      console.log("=== [OAuth2Callback] ===");
      console.log("URL code:", code);
      console.log("URL state:", state);
      console.log("Stored state:", storedState);
      console.log("Error:", error);
    }

    const exchangeCode = async () => {
      try {
        if (error) {
          setStatus(`OAuth error: ${error}`);
          setTimeout(() => navigate("/Canvas?error=oauth_error"), 1200);
          return;
        }

        if (!code) {
          setStatus("Missing authorization code.");
          setTimeout(() => navigate("/Canvas?error=missing_code"), 1200);
          return;
        }

        if (!state || !storedState || state !== storedState) {
          setStatus("Invalid state parameter.");
          setTimeout(() => navigate("/Canvas?error=invalid_state"), 1400);
          return;
        }

        // Clear stored state after use
        sessionStorage.removeItem("google_oauth_state");
        localStorage.removeItem("google_oauth_state");

        setStatus("Exchanging code for tokens...");

        // Call backend to exchange code
        const tokenResponse = await zapier_automation_backend.exchange_google_code_v2(code, state);

        if ("ok" in tokenResponse) {
          const token = tokenResponse.ok;
          localStorage.setItem("google_connected", "true");
          localStorage.setItem("google_access_token", token.access_token);

          setStatus("✅ Google connected successfully. Redirecting...");
          setTimeout(() => {
            navigate("/Canvas?google_connected=true");
          }, 1700);
        } else {
          setStatus("❌ Failed to exchange code: " + tokenResponse.err);
          setTimeout(() => {
            navigate(`/Canvas?error=${encodeURIComponent(tokenResponse.err)}`);
          }, 1500);
        }
      } catch (err) {
        setStatus("⚠️ Exchange failed.");
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

// === Button Component ===
export function ConnectSheetsButton() {
  const handleClick = async () => {
    try {
      const response = await zapier_automation_backend.get_google_auth_url();

      if (response && response.auth_url) {
        console.log("🔗 Redirecting to:", response.auth_url);

        // Save state (if backend included it inside auth_url query)
        const url = new URL(response.auth_url);
        const stateParam = url.searchParams.get("state");
        if (stateParam) {
          sessionStorage.setItem("google_oauth_state", stateParam);
          localStorage.setItem("google_oauth_state", stateParam);
        }

        // Redirect to Google
        window.location.href = response.auth_url;
      } else {
        console.error("Backend did not return an auth_url:", response);
      }
    } catch (err) {
      console.error("⚠️ Error fetching auth URL:", err);
    }
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
