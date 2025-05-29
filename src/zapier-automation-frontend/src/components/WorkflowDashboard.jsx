import React, { useEffect, useState } from "react";
import { zapier_automation_backend } from "../../../declarations/zapier-automation-backend";
import CreateWorkflowForm from "./CreateWorkflowForm";
import WorkflowDetails from "./WorkflowDetails";
import WorkflowLogs from "./WorkflowLogs";
import ErrorBoundary from "./ErrorBoundary";
import TemplateSection from "./TemplateSection"; // ✅ Make sure this path is correct

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

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      {/* Header */}
      ✅ Tailwind is working!
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-red-800 mb-4 md:mb-0">Workflow Dashboard</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-2xl transition-all"
        >
          + Create Workflow
        </button>
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

      {/* Error Banner */}
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
            className="bg-white hover:shadow-xl transition-shadow rounded-2xl p-6 cursor-pointer border border-gray-200"
            onClick={() => setSelectedWorkflow(wf)}
          >
            <div className="bg-white shadow-md rounded-lg p-6 mb-4">
              <h2 className="text-xl font-semibold text-red-100">{wf.name}</h2>
              <p className="text-xs text-gray-500 mt-1 break-all">ID: {wf.id}</p>
              <p className="text-sm mt-1">
                Status:{" "}
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
