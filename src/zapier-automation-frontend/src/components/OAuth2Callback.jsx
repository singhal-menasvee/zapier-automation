import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zapier_automation_backend } from "declarations/zapier-automation-backend";

const OAuth2Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    const exchangeCode = async () => {
      if (!code) {
        console.error("No authorization code found in URL");
        return;
      }

      try {
        const tokenResponse = await zapier_automation_backend.exchange_google_code(code);
        console.log("Received token response:", tokenResponse);

        // Store access token in local storage or state
        localStorage.setItem("google_access_token", tokenResponse.access_token);

        // Redirect to dashboard or canvas
        navigate("/Canvas");
      } catch (err) {
        console.error("Error exchanging code:", err);
      }
    };

    exchangeCode();
  }, [navigate]);

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h2>🔄 Connecting your Google Account…</h2>
      <p>Please wait while we finish connecting.</p>
    </div>
  );
};

export default OAuth2Callback;
