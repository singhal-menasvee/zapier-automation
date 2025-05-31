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
  const [templateToEdit, setTemplateToEdit] = useState(null); // Added state for template

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

  // Removed handleCreateWorkflow as it's now handled by CreateWorkflowForm's onSuccess path indirectly

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
      setLoading(true); // Set loading true at the beginning of the operation
      setError(null); // Clear previous errors

      try {
        const currentWorkflows = await zapier_automation_backend.list_workflows();
        setWorkflows(currentWorkflows);

        if (process.env.NODE_ENV === "development" && currentWorkflows.length === 0) {
          console.log("No existing workflows found in dev mode, creating a test workflow.");
          try {
            await zapier_automation_backend.create_workflow({
              name: "Test workflow (auto-generated)", // Updated name
              trigger: { TimeBased: { cron: "* * * * *" } },
              actions: [{ NotifyUser: { user_id: "abc123", message: "Ping matched!" } }],
              conditions: [],
            });
            // Call fetchWorkflows again to update the list with the new test workflow
            // This will also handle setLoading(false) internally if it succeeds or fails
            await fetchWorkflows();
            // Note: fetchWorkflows sets loading to true then false.
            // We might get a flicker or multiple loading states.
            // To avoid this, we could manually set workflows again and then setLoading(false) here.
            // For now, keeping it simple by calling fetchWorkflows.
          } catch (err) {
            console.error("Failed to create test workflow:", err);
            // Non-fatal for dev, so don't set global error. setLoading will be handled by finally.
          }
        }
      } catch (err) {
        console.error("Failed to fetch workflows during initial load:", err);
        setError("Failed to fetch workflows");
      } finally {
        // Ensure loading is set to false if fetchWorkflows wasn't called after test creation,
        // or if the initial list_workflows failed.
        setLoading(false);
      }
    };

    loadAndPotentiallyCreateTestWorkflow();
  }, []); // Runs once on mount

  if (loading) return <p className="text-center text-accent">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>; // Kept specific error color

  return (
    // Changed bg-gray-100 to bg-primary. Text color will be inherited from body.
    <div className="min-h-screen bg-primary p-6 font-sans">
      {/* Header */}
      ✅ Tailwind is working!
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-app-color mb-4 md:mb-0">Workflow Dashboard</h1>
        {/* Old "+ Create Workflow" button removed. ThemeSwitcher remains. */}
        <ThemeSwitcher />
      </div>

      {/* New Workflow Creation Options Section */}
      <div className="mb-8 p-4 bg-card rounded-lg shadow">
        <h2 className="text-xl font-semibold text-app-color mb-3">New Workflow</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setShowCreateForm(false); // Hide form
              setTemplateToEdit(null);  // Ensure no template is pre-selected for the form
                                      // User will click a template from TemplateSection which calls handleSelectTemplate
            }}
            className="themed-button"
          >
            Create from Template
          </button>
          <button
            onClick={() => {
              setTemplateToEdit(null); // Ensure it's a custom workflow
              setShowCreateForm(true);
            }}
            className="themed-button"
          >
            Create Custom Workflow
          </button>
        </div>
      </div>

      {/* Template Section - give it an ID if scrollIntoView is ever implemented */}
      <div id="template-section" className="mb-10">
        {/* Changed prop to onSelectTemplate and passed the new handler */}
        <TemplateSection onSelectTemplate={handleSelectTemplate} />
      </div>

      {/* Create Workflow Form */}
      {showCreateForm && (
        <div className="mb-6">
          <CreateWorkflowForm
            onSuccess={() => {
              setShowCreateForm(false);
              setTemplateToEdit(null); // Clear template after use
              fetchWorkflows(); // Keep fetching workflows on success
            }}
            onCancel={() => {
              setShowCreateForm(false);
              setTemplateToEdit(null); // Clear template on cancel
            }}
            initialTemplate={templateToEdit} // Pass the selected template
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
            className="bg-card text-app-color hover:shadow-xl transition-shadow rounded-2xl p-6 border border-themed flex flex-col justify-between" // Restructured card classes
            onClick={() => setSelectedWorkflow(wf)}
          >
            <div> {/* Top content wrapper */}
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

            <div className="my-4"> {/* Logs section with vertical margin */}
              <ErrorBoundary>
                <WorkflowLogs workflowId={wf.id} />
              </ErrorBoundary>
            </div>

            {/* Action Buttons - Pushed to bottom, buttons aligned to the right */}
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
        ))}
      </div>
    </div>
  );
};

export default WorkflowDashboard;
