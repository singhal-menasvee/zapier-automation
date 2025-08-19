// src/components/triggers/web2triggerconfig.jsx
import React from "react";
import { ConnectSheetsButton } from "../OAuth2Callback";

export default function Web2TriggerConfig() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Google Sheets Integration</h3>
      <p className="text-sm text-gray-400">
        Connect your Google account to access Sheets.
      </p>
      <ConnectSheetsButton />
    </div>
  );
}
