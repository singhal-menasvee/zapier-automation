import React from 'react';
import WorkflowNode from '../WorkflowNode/WorkflowNode';
import './MainPanel.css';
import { faBolt, faRocket } from '@fortawesome/free-solid-svg-icons';

const MainPanel = () => {
  return (
    <main className="main-panel">
      <div className="workflow-canvas">
        <WorkflowNode 
          type="trigger" 
          title="New Email Received" 
          subtitle="Gmail Integration" 
          color="#10B981"
          icon={faBolt}
        />
        <div className="connection-line"></div>
        <div className="connection-line1"></div>
        <WorkflowNode 
          type="action" 
          title="Send to Slack" 
          subtitle="Channel: #notifications" 
          color="#38BDF8"
          icon={faRocket}
        />
        
      </div>
    </main>
  );
};

export default MainPanel;
