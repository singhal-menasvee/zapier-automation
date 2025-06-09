import React from 'react';
import './WorkflowNode.css';

const WorkflowNode = ({ type, title, subtitle, color }) => {
  return (
    <div className={`workflow-node ${type}`} style={{ borderLeftColor: color }}>
      <div className="node-header">
        <div className="node-icon" style={{ backgroundColor: `${color}20` }}>
          <div className="icon-shape" style={{ backgroundColor: color }}></div>
        </div>
        <div className="node-title">
          <h3>{type === 'trigger' ? 'Trigger' : 'Action'}</h3>
          <p>{type === 'trigger' ? 'When this happens' : 'Do this'}</p>
        </div>
        <button className="node-menu">
          <span className="menu-dot"></span>
          <span className="menu-dot"></span>
          <span className="menu-dot"></span>
        </button>
      </div>
      <div className="node-content">
        <h4>{title}</h4>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

export default WorkflowNode;