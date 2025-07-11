import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faPlayCircle, faPauseCircle, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';

const WorkflowDetails = ({ workflow, onEdit, onDelete, onToggleStatus, onClose }) => {
  if (!workflow) {
    return (
      <div className="alert alert-info text-center" role="alert">
        No workflow selected.
      </div>
    );
  }

  const statusBadgeClass = workflow.status === 'Active' ? 'bg-success' : 'bg-warning';
  const toggleButtonIcon = workflow.status === 'Active' ? faPauseCircle : faPlayCircle;
  const toggleButtonText = workflow.status === 'Active' ? 'Pause' : 'Activate';
  const toggleButtonClass = workflow.status === 'Active' ? 'btn-warning' : 'btn-success';

  return (
    <div className="card bg-dark text-white p-4 border border-secondary rounded">
      <div className="card-header d-flex justify-content-between align-items-center border-bottom border-secondary pb-3 mb-3">
        <h3 className="h4 card-title mb-0 text-white">{workflow.name}</h3>
        <button
          onClick={onClose}
          className="btn btn-sm text-muted"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <p className="card-text text-secondary mb-1">
            <strong>Status:</strong> <span className={`badge ${statusBadgeClass}`}>{workflow.status}</span>
          </p>
          <p className="card-text text-secondary mb-1">
            <strong>Last Run:</strong> {workflow.lastRun}
          </p>
          {workflow.description && (
            <p className="card-text text-secondary mb-1">
              <strong>Description:</strong> {workflow.description}
            </p>
          )}
          {/* Add more workflow details here as needed */}
        </div>

        <h5 className="h6 fw-bold mt-4 mb-3 text-white">Workflow Actions</h5>
        <div className="d-flex flex-wrap gap-2">
          <button onClick={() => onToggleStatus(workflow.id)} className={`btn btn-sm ${toggleButtonClass}`}>
            <FontAwesomeIcon icon={toggleButtonIcon} className="me-2" /> {toggleButtonText}
          </button>
          <button onClick={() => onEdit(workflow.id)} className="btn btn-sm btn-info">
            <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit Workflow
          </button>
          <button onClick={() => onDelete(workflow.id)} className="btn btn-sm btn-danger">
            <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Delete Workflow
          </button>
        </div>

        {/* Placeholder for a visual representation of the workflow (e.g., nodes and connections) */}
        <div className="mt-4 p-3 bg-secondary rounded text-center text-muted small">
          [Workflow Visualizer / Canvas Preview Goes Here]
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetails;
