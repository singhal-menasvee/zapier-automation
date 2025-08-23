// src/components/ConnectSheetsButton.jsx
import React from "react";
import { zapier_automation_backend } from "declarations/zapier_automation_backend";

export default function ConnectSheetsButton() {
  const handleConnectSheets = async () => {
    try {
      // Call backend to get OAuth URL
      const res = await zapier_automation_backend.get_google_auth_url();

      // Log the raw response for debugging
      console.log("🔎 Raw response from backend:", res);

      // Handle both string and object return formats
      const authUrl = typeof res === "string" ? res : res?.auth_url;

      if (!authUrl) {
        console.error("❌ No authUrl returned from backend!");
        return;
      }

      // Log the URL before redirecting
      console.log("🔗 Redirecting to:", authUrl);

      // Redirect browser to Google OAuth page
      window.location.href = authUrl;
    } catch (err) {
      console.error("⚠️ Error in handleConnectSheets:", err);
    }
  };

  return (
    <button
      onClick={handleConnectSheets}
      style={{
        padding: "10px 20px",
        background: "#4285F4",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      Connect Google Sheets
    </button>
  );
}
