import React, { useState } from 'react';

const CreateWorkflowForm = ({ onClose, onSubmit }) => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (workflowName.trim()) {
      onSubmit({ name: workflowName, description: workflowDescription });
      setWorkflowName('');
      setWorkflowDescription('');
    } else {
      // Consider using a Bootstrap alert or modal for validation feedback
      alert('Workflow Name cannot be empty!');
    }
  };

  return (
    <div className="card bg-dark text-white p-4 border border-secondary rounded"> {/* Bootstrap card for styling */}
      <div className="card-header d-flex justify-content-between align-items-center border-bottom border-secondary pb-3 mb-3">
        <h3 className="h5 card-title mb-0 text-white">Create New Workflow</h3>
        <button
          onClick={onClose}
          className="btn btn-sm text-muted"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="workflowName" className="form-label text-secondary small mb-1">
              Workflow Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control bg-secondary text-white border-secondary"
              id="workflowName"
              placeholder="e.g., 'Automate Google Calendar Events'"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="workflowDescription" className="form-label text-secondary small mb-1">
              Description (Optional)
            </label>
            <textarea
              className="form-control bg-secondary text-white border-secondary"
              id="workflowDescription"
              rows="3"
              placeholder="A brief description of what this workflow does..."
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Create Workflow
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkflowForm;
