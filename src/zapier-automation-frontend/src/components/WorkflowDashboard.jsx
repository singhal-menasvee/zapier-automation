import React, { useEffect, useState } from "react";
import { zapier_automation_backend } from "../../../declarations/zapier-automation-backend";
import CreateWorkflowForm from "./CreateWorkflowForm";
import WorkflowDetails from "./WorkflowDetails";
import WorkflowLogs from "./WorkflowLogs";
import ErrorBoundary from "./ErrorBoundary";
import TemplateSection from "./TemplateSection"; // ✅ Make sure this path is correct
import ThemeSwitcher from './ThemeSwitcher'; // Import ThemeSwitcher

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

  const handleCreateWorkflow = async (workflowData) => {
    try {
      await zapier_automation_backend.create_workflow(workflowData);
      fetchWorkflows();
    } catch (err) {
      console.error("Failed to create workflow:", err);
      setError("Failed to create workflow");
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

  const getStatusText = (status) => Object.keys(status)[0];

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const createTestWorkflow = async () => {
        try {
          await zapier_automation_backend.create_workflow({
            name: "Test workflow",
            trigger: { TimeBased: { cron: "* * * * *" } },
            actions: [{ NotifyUser: { user_id: "abc123", message: "Ping matched!" } }],
            conditions: [],
          });
        } catch (err) {
          console.error("Failed to create test workflow:", err);
        }
      };
      createTestWorkflow();
    }
    fetchWorkflows();
  }, []);

  if (loading) return <p className="text-center text-accent">Loading...</p>; // Changed text-blue-500 to text-accent
  if (error) return <p className="text-center text-red-500">{error}</p>; // Kept specific error color

  return (
    // Changed bg-gray-100 to bg-primary. Text color will be inherited from body.
    <div className="min-h-screen bg-primary p-6 font-sans">
      {/* Header */}
      ✅ Tailwind is working!
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        {/* Changed text-red-800 to text-app-color */}
        <h1 className="text-4xl font-bold text-app-color mb-4 md:mb-0">Workflow Dashboard</h1>
        <div className="flex items-center space-x-4">
          {/* Replaced specific button classes with themed-button and kept utility classes for sizing/shape */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="themed-button font-semibold px-5 py-2 rounded-2xl transition-all"
          >
            + Create Workflow
          </button>
          <ThemeSwitcher />
        </div>
      </div>

      {/* Template Section */}
      <div className="mb-10">
        <TemplateSection onCreateWorkflow={handleCreateWorkflow} />
      </div>

      {/* Create Workflow Form */}
      {showCreateForm && (
        <div className="mb-6">
          <CreateWorkflowForm
            onSuccess={() => {
              setShowCreateForm(false);
              fetchWorkflows();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Workflow Details Modal */}
      {selectedWorkflow && (
        <WorkflowDetails
          workflow={selectedWorkflow}
          onClose={() => setSelectedWorkflow(null)}
        />
      )}

      {/* Error Banner - Kept specific error colors */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            // Changed bg-white to bg-card, border-gray-200 to border-themed (added 'border' class for width/style)
            className="bg-card hover:shadow-xl transition-shadow rounded-2xl p-6 cursor-pointer border border-themed"
            onClick={() => setSelectedWorkflow(wf)}
          >
            {/* Changed bg-white to bg-card (or could be removed if parent bg-card is sufficient) */}
            <div className="bg-card shadow-md rounded-lg p-6 mb-4">
              {/* Changed text-red-100 to text-app-color */}
              <h2 className="text-xl font-semibold text-app-color">{wf.name}</h2>
              {/* Changed text-gray-500 to text-app-color with opacity for secondary look */}
              <p className="text-xs text-app-color opacity-75 mt-1 break-all">ID: {wf.id}</p>
              <p className="text-sm mt-1">
                Status:{" "}
                {/* Kept status-specific colors */}
                <span
                  className={
                    wf.status.Active
                      ? "text-green-600 font-medium"
                      : wf.status.Paused
                      ? "text-yellow-500 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {getStatusText(wf.status)}
                </span>
              </p>
            </div>

            <div className="mt-4">
              <ErrorBoundary>
                <WorkflowLogs workflowId={wf.id} />
              </ErrorBoundary>
            </div>

            {/* Action Buttons - Kept specific colors for semantic meaning (delete, pause, resume) */}
            <div className="mt-4 flex gap-2">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 text-sm rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteWorkflow(wf.id);
                }}
              >
                Delete
              </button>
              {wf.status.Active ? (
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 text-sm rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateWorkflowStatus(wf.id, { Paused: null });
                  }}
                >
                  Pause
                </button>
              ) : (
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 text-sm rounded-lg"
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
