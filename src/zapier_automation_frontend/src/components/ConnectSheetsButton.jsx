import React from "react";
import { zapier_automation_backend } from "declarations/zapier_automation_backend";

export default function ConnectSheetsButton() {
  const handleConnectSheets = async () => {
    try {
      const authUrl = await zapier_automation_backend.get_google_auth_url();
      
      // Log the URL before redirecting
      console.log("🔗 Redirecting to:", authUrl);

      // Redirect to Google OAuth
      window.location.href = authUrl;
    } 
    catch (err) {
    console.error("❌ Error getting Google Auth URL:", err);
    }
  };

  return (
    <button className="connect-button" onClick={handleConnectSheets}>
      Connect Google Sheets
    </button>
  );
}
