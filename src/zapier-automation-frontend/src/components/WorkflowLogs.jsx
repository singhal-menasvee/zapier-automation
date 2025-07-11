import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const WorkflowLogs = () => {
  // Placeholder data for demonstration
  const logs = [
    { id: 'log1', workflowName: 'Google Calendar to Slack', status: 'Success', timestamp: '2025-07-08 10:30:00', message: 'Event created and Slack notification sent.' },
    { id: 'log2', workflowName: 'Transfer ETH on Event', status: 'Failed', timestamp: '2025-07-08 09:45:00', message: 'ETH transfer failed: Insufficient funds.' },
    { id: 'log3', workflowName: 'Email to Discord Message', status: 'Success', timestamp: '2025-07-07 18:00:00', message: 'Email processed and Discord message sent.' },
    { id: 'log4', workflowName: 'New Google Calendar Event to Slack', status: 'Warning', timestamp: '2025-07-07 15:10:00', message: 'Slack API responded with warning: Rate limit approaching.' },
    { id: 'log5', workflowName: 'Mint NFT on Event', status: 'Error', timestamp: '2025-07-07 11:20:00', message: 'NFT minting failed: Contract interaction error.' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Success':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />;
      case 'Failed':
        return <FontAwesomeIcon icon={faTimesCircle} className="text-danger me-2" />;
      case 'Warning':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning me-2" />;
      case 'Error':
        return <FontAwesomeIcon icon={faTimesCircle} className="text-danger me-2" />;
      default:
        return <FontAwesomeIcon icon={faInfoCircle} className="text-info me-2" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Success':
        return 'bg-success';
      case 'Failed':
      case 'Error':
        return 'bg-danger';
      case 'Warning':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid py-4 bg-dark text-white">
      <h2 className="h3 fw-bold mb-4">Workflow Execution Logs</h2>
      <p className="text-secondary mb-4">
        Review the history of your workflow executions.
      </p>

      {logs.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-dark table-hover table-striped">
            <thead>
              <tr>
                <th scope="col">Status</th>
                <th scope="col">Workflow Name</th>
                <th scope="col">Timestamp</th>
                <th scope="col">Message</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(log.status)}`}>
                      {getStatusIcon(log.status)} {log.status}
                    </span>
                  </td>
                  <td>{log.workflowName}</td>
                  <td>{log.timestamp}</td>
                  <td>{log.message}</td>
                  <td>
                    <button className="btn btn-sm btn-info">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info mt-4" role="alert">
          No workflow execution logs found.
        </div>
      )}
    </div>
  );
};

export default WorkflowLogs;
