import React, { useState, useEffect } from 'react';
import { zapier_automation_backend } from "../../../declarations/zapier-automation-backend";

const WorkflowLogs = ({ workflowId, className }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Note: You'll need to add get_workflow_logs to your backend first
        const logs = await zapier_automation_backend.get_workflow_logs(workflowId);
        setLogs(logs);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      }
    };
    fetchLogs();
  }, [workflowId]);

  return (
    <div className={`mt-2 ${className}`}>
      <h4 className="text-sm font-semibold mb-1">Execution Logs:</h4>
      <div className="text-xs max-h-20 overflow-y-auto">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={index} className="py-1 border-b border-gray-700">
              {new Date(Number(log.timestamp)).toLocaleString()}: {log.message}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No logs available</p>
        )}
      </div>
    </div>
  );
};

export default WorkflowLogs;