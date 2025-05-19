import React, { useEffect, useState } from "react";
import { zapier_automation_backend } from "../../../declarations/zapier-automation-backend/zapier-automation-backend.did";

const WorkflowDashboard = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkflows = async () => {
    const data = await zapier_automation_backend.list_workflows();
    setWorkflows(data);
    setLoading(false);
  };

  const deleteWorkflow = async (id) => {
    await zapier_automation_backend.delete_workflow(id);
    fetchWorkflows();
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Workflow Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((wf) => (
          <div key={wf.id} className="bg-gray-800 text-white rounded-2xl shadow-lg p-4">
            <h2 className="text-xl font-semibold">{wf.name}</h2>
            <p className="text-sm text-gray-300">ID: {wf.id}</p>
            <p>Status: {Object.keys(wf.status)[0]}</p>
            <div className="mt-4 space-x-2">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl"
                onClick={() => deleteWorkflow(wf.id)}
              >
                Delete
              </button>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl"
                onClick={() =>
                  zapier_automation_backend.update_workflow_status(
                    wf.id,
                    { Paused: null }
                  ).then(fetchWorkflows)
                }
              >
                Pause
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-xl"
                onClick={() =>
                  zapier_automation_backend.update_workflow_status(
                    wf.id,
                    { Active: null }
                  ).then(fetchWorkflows)
                }
              >
                Resume
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowDashboard;
