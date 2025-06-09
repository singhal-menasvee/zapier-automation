import React from 'react';
import './LeftSidebar.css';

const LeftSidebar = () => {
  return (
    <aside className="left-sidebar">
      <div className="sidebar-item">
        <div className="sidebar-icon tools-icon"></div>
        <span className="tooltip">Tools</span>
      </div>
      <div className="sidebar-item">
        <div className="sidebar-icon workflows-icon"></div>
        <span className="tooltip">Workflows</span>
      </div>
      <div className="sidebar-item">
        <div className="sidebar-icon templates-icon"></div>
        <span className="tooltip">Templates</span>
      </div>
      <div className="sidebar-item">
        <div className="sidebar-icon logs-icon"></div>
        <span className="tooltip">Logs</span>
      </div>
      <div className="sidebar-item">
        <div className="sidebar-icon settings-icon"></div>
        <span className="tooltip">Settings</span>
      </div>
    </aside>
  );
};

export default LeftSidebar;