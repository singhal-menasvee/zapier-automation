import React from "react";
import { zapier_automation_backend } from "declarations/zapier_automation_backend";

export default function ConnectSheetsButton() {
  const handleConnectSheets = async () => {
    try {
      const res = await zapier_automation_backend.get_google_auth_url();
      
      // Log the URL before redirecting
      console.log("🔗 Redirecting to:", res.url);

      // Redirect to Google OAuth
      window.location.href = res.url;
    } catch (e) {
      console.error("Failed to start Google OAuth", e);
      alert("Could not connect to Google Sheets. Check console.");
    }
  };

  return (
    <button className="connect-button" onClick={handleConnectSheets}>
      Connect Google Sheets
    </button>
  );
}
