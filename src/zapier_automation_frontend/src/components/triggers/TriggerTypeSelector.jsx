// src/components/triggers/TriggerTypeSelector.jsx
import { ConnectSheetsButton } from "../OAuth2Callback";

import React from "react";
import Web2TriggerConfig from "./web2triggerconfig";

const TriggerTypeSelector = ({ type, onChange }) => {
  const renderTriggerInputs = () => {
    switch (type) {
      case "TimeBased":
        return (
          <input
            type="text"
            placeholder="* * * * * (cron)"
            className="themed-input"
          />
        );
      case "HttpRequest":
        return (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="URL"
              className="themed-input w-full"
            />
            <select className="themed-input">
              <option>GET</option>
              <option>POST</option>
            </select>
          </div>
        );
      case "GoogleSheets": // 🔥 new Google Sheets integration
         return <ConnectSheetsButton />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <select
        value={type}
        onChange={(e) => onChange(e.target.value)}
        className="themed-input"
      >
        <option value="TimeBased">Schedule</option>
        <option value="HttpRequest">HTTP Request</option>
        <option value="GoogleSheets">Google Sheets</option> {/* 🔥 added */}
      </select>
      {renderTriggerInputs()}
    </div>
  );
};

export default TriggerTypeSelector;
