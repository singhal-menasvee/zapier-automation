import React from 'react';

const WorkflowDashboard = ({ onCreateNewWorkflow }) => {
  // Placeholder data for demonstration
  const recentWorkflows = [
    { id: 'wf1', name: 'Google Calendar to Slack', status: 'Active', lastRun: '2 hours ago' },
    { id: 'wf2', name: 'Email to Discord Message', status: 'Paused', lastRun: 'Yesterday' },
    { id: 'wf3', name: 'Mint NFT on Event', status: 'Active', lastRun: '3 days ago' },
  ];

  return (
    <div className="container-fluid py-4 bg-dark text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 fw-bold mb-0">My Workflows</h2>
        <button className="btn btn-primary" onClick={onCreateNewWorkflow}>
          + Create New Workflow
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title h6 text-info">Total Workflows</h5>
              <p className="card-text display-4 fw-bold">{recentWorkflows.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title h6 text-success">Active Workflows</h5>
              <p className="card-text display-4 fw-bold">{recentWorkflows.filter(wf => wf.status === 'Active').length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title h6 text-warning">Paused Workflows</h5>
              <p className="card-text display-4 fw-bold">{recentWorkflows.filter(wf => wf.status === 'Paused').length}</p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="h4 fw-bold mb-3">Recent Activity</h3>
      {recentWorkflows.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-dark table-hover table-striped">
            <thead>
              <tr>
                <th scope="col">Workflow Name</th>
                <th scope="col">Status</th>
                <th scope="col">Last Run</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentWorkflows.map(workflow => (
                <tr key={workflow.id}>
                  <td>{workflow.name}</td>
                  <td>
                    <span className={`badge ${workflow.status === 'Active' ? 'bg-success' : 'bg-warning'}`}>
                      {workflow.status}
                    </span>
                  </td>
                  <td>{workflow.lastRun}</td>
                  <td>
                    <button className="btn btn-sm btn-info me-2">View</button>
                    <button className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info" role="alert">
          You don't have any workflows yet. Click "Create New Workflow" to get started!
        </div>
      )}
    </div>
  );
};

export default WorkflowDashboard;
