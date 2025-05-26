import React, { useEffect, useState } from "react";
import { zapier_automation_backend } from "../../../declarations/zapier-automation-backend";
import CreateWorkflowForm from "./CreateWorkflowForm";
import WorkflowDetails from "./WorkflowDetails";
import WorkflowLogs from "./WorkflowLogs";
import ErrorBoundary from "./ErrorBoundary";

const WorkflowDashboard = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  const fetchWorkflows = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await zapier_automation_backend.list_workflows();
      setWorkflows(data);
    } catch (err) {
      console.error("Failed to fetch workflows:", err);
      setError("Failed to fetch workflows");
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkflow = async (id) => {
    try {
      await zapier_automation_backend.delete_workflow(id);
      await fetchWorkflows();
    } catch (err) {
      console.error("Failed to delete workflow:", err);
      setError("Failed to delete workflow");
    }
  };

  const updateWorkflowStatus = async (id, status) => {
    try {
      await zapier_automation_backend.update_workflow_status(id, status);
      await fetchWorkflows();
    } catch (err) {
      console.error("Failed to update workflow status:", err);
      setError("Failed to update workflow status");
    }
  };

  const getStatusText = (status) => {
    return Object.keys(status)[0];
  };

  useEffect(() => {
  if (process.env.NODE_ENV === "development") {
    const createTestWorkflow = async () => {
      try {
        await zapier_automation_backend.create_workflow({
          name: "Test workflow",
          trigger: { TimeBased: { cron: "* * * * *" } },
          actions: [
            { NotifyUser: { user_id: "abc123", message: "Ping matched!" } }
          ],
          conditions: [] // Changed to empty array to match Option<Vec<Condition>>
        });
      } catch (err) {
        console.error("Failed to create test workflow:", err);
      }
    };
    createTestWorkflow();
  }
  fetchWorkflows();
}, []);
  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-white">Workflow Dashboard</h1>
      <button
        onClick={() => setShowCreateForm(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
        Create New Workflow
      </button>
    </div>

    {showCreateForm && (
      <CreateWorkflowForm
        onSuccess={() => {
          setShowCreateForm(false);
          fetchWorkflows();
        }}
        onCancel={() => setShowCreateForm(false)}
      />
    )}

    {selectedWorkflow && (
      <WorkflowDetails
        workflow={selectedWorkflow}
        onClose={() => setSelectedWorkflow(null)}
      />
    )}

    {error && (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{error}</p>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {workflows.map((wf) => (
        <div key={wf.id} className="bg-gray-800 text-white rounded-2xl shadow-lg p-4">
          <div 
            className="cursor-pointer mb-2" 
            onClick={() => setSelectedWorkflow(wf)}
          >
            <h2 className="text-xl font-semibold">{wf.name}</h2>
            <p className="text-sm text-gray-300">ID: {wf.id}</p>
            <p className="text-sm">
              Status: <span className={
                wf.status.Active ? "text-green-400" : 
                wf.status.Paused ? "text-yellow-400" : 
                "text-red-400"
              }>
                {getStatusText(wf.status)}
              </span>
            </p>
          </div>
          
          <ErrorBoundary>
            <WorkflowLogs workflowId={wf.id} className="mt-2" />
          </ErrorBoundary>

          <div className="mt-4 space-x-2">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl"
              onClick={(e) => {
                e.stopPropagation();
                deleteWorkflow(wf.id);
              }}
            >
              Delete
            </button>
            {wf.status.Active ? (
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  updateWorkflowStatus(wf.id, { Paused: null });
                }}
              >
                Pause
              </button>
            ) : (
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  updateWorkflowStatus(wf.id, { Active: null });
                }}
              >
                Resume
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);
};


export default WorkflowDashboard;