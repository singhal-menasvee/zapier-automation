import React from 'react';
import WorkflowNode from '../WorkflowNode/WorkflowNode';
import './MainPanel.css';

const MainPanel = () => {
  return (
    <main className="main-panel">
      <div className="workflow-canvas">
        <WorkflowNode 
          type="trigger" 
          title="New Email Received" 
          subtitle="Gmail Integration" 
          color="#10B981"
        />
        <div className="connection-line"></div>
        <WorkflowNode 
          type="action" 
          title="Send to Slack" 
          subtitle="Channel: #notifications" 
          color="#38BDF8"
        />
        <button className="add-step-btn">
          <span className="btn-icon"></span>
          <span>Add Step</span>
        </button>
      </div>
    </main>
  );
};

export default MainPanel;