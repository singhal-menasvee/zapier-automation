import React, { useEffect, useState } from "react";
import { zapier_automation_backend } from "../../../declarations/zapier-automation-backend";
import CreateWorkflowForm from "./CreateWorkflowForm";
import WorkflowDetails from "./WorkflowDetails";
import WorkflowLogs from "./WorkflowLogs";
import ErrorBoundary from "./ErrorBoundary";
import TemplateSection from "./TemplateSection";
import ThemeSwitcher from "./ThemeSwitcher";

const WorkflowDashboard = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [templateToEdit, setTemplateToEdit] = useState(null);

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

  const handleSelectTemplate = (template) => {
    setTemplateToEdit(template);
    setShowCreateForm(true);
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
    const loadAndPotentiallyCreateTestWorkflow = async () => {
      setLoading(true);
      setError(null);

      try {
        const currentWorkflows = await zapier_automation_backend.list_workflows();
        setWorkflows(currentWorkflows);

        if (process.env.NODE_ENV === "development" && currentWorkflows.length === 0) {
          console.log("No existing workflows found in dev mode, creating a test workflow.");
          try {
            await zapier_automation_backend.create_workflow({
              name: "Test workflow (auto-generated)",
              trigger: { TimeBased: { cron: "* * * * *" } },
              actions: [{ NotifyUser: { user_id: "abc123", message: "Ping matched!" } }],
              conditions: [],
            });
            await fetchWorkflows();
          } catch (err) {
            console.error("Failed to create test workflow:", err);
          }
        }
      } catch (err) {
        console.error("Failed to fetch workflows during initial load:", err);
        setError("Failed to fetch workflows");
      } finally {
        setLoading(false);
      }
    };

    loadAndPotentiallyCreateTestWorkflow();
  }, []);

  if (loading) return <p className="text-center text-accent">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-primary p-6 font-sans">
    
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-app-color mb-4 md:mb-0">Workflow Dashboard</h1>
        <ThemeSwitcher />
      </div>

      <div className="mb-8 p-4 bg-card rounded-lg shadow">
        <h2 className="text-xl font-semibold text-app-color mb-3">New Workflow</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setShowCreateForm(false);
              setTemplateToEdit(null);
            }}
            className="themed-button"
          >
            Create from Template
          </button>
          <button
            onClick={() => {
              setTemplateToEdit(null);
              setShowCreateForm(true);
            }}
            className="themed-button"
          >
            Create Custom Workflow
          </button>
        </div>
      </div>

      <div id="template-section" className="mb-10">
        <TemplateSection onSelectTemplate={handleSelectTemplate} />
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <CreateWorkflowForm
            onSuccess={() => {
              setShowCreateForm(false);
              setTemplateToEdit(null);
              fetchWorkflows();
            }}
            onCancel={() => {
              setShowCreateForm(false);
              setTemplateToEdit(null);
            }}
            initialTemplate={templateToEdit}
          />
        </div>
      )}

      {selectedWorkflow && (
        <WorkflowDetails
          workflow={selectedWorkflow}
          onClose={() => setSelectedWorkflow(null)}
        />
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className="bg-card text-app-color hover:shadow-xl transition-shadow rounded-2xl p-6 border border-themed flex flex-col justify-between"
            onClick={() => setSelectedWorkflow(wf)}
          >
            <div>
              <h2 className="text-xl font-semibold text-app-color mb-1">{wf.name}</h2>
              <p className="text-xs text-app-color opacity-75 mt-1 mb-2 break-all">ID: {wf.id}</p>
              <p className="text-sm mb-4">
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

            <div className="my-4">
              <ErrorBoundary>
                <WorkflowLogs workflowId={wf.id} />
              </ErrorBoundary>
            </div>

            <div className="mt-auto pt-4 border-t border-themed">
              <div className="flex gap-2 justify-end">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowDashboard;
