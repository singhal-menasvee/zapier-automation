import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { zapier_automation_backend } from "declarations/zapier_automation_backend";

/**
 * Handles the redirect step of Google OAuth2.
 * Exchanges 'code' in the URL for tokens via backend, while verifying 'state' (CSRF protection).
 */

const ENABLE_DEBUG = true; // << Turn on debugging

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("Processing OAuth callback...");

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

      try {
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
  }, [navigate, location]);

  return (
    <div style={{
      padding: "2rem",
      color: "#333",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh"
    }}>
      <div style={{
        textAlign: "center",
        maxWidth: "500px",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fff"
      }}>
        <h2 style={{
          marginBottom: "1rem",
          color: "#1a73e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem"
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1a73e8">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V9h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          Connecting your Google Account...
        </h2>

        <div style={{
          margin: "1.5rem 0",
          height: "4px",
          backgroundColor: "#f1f1f1",
          borderRadius: "2px",
          overflow: "hidden"
        }}>
          <div style={{
            height: "100%",
            width: "70%",
            backgroundColor: "#1a73e8",
            animation: "progress 2s ease-in-out infinite",
            backgroundImage: "linear-gradient(-45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)"
          }}></div>
        </div>

        <p style={{ marginBottom: "1.5rem" }}>{status}</p>

        <div style={{
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          fontSize: "0.9rem"
        }}>
          {location.search.includes("code=")
            ? `Authorization code received (${location.search.match(/code=([^&]+)/)?.[1].slice(0, 10)}...)`
            : "Waiting for authorization code..."}
        </div>
      </div>
    </div>
  );
};

export default OAuth2Callback;
