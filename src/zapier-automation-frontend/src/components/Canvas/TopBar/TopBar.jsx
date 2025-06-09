import React from 'react';
import './TopBar.css';

const TopBar = () => {
  return (
    <header className="top-bar">
      <div className="workflow-info">
        <h1 className="workflow-title">Untitled Workflow</h1>
        <span className="auto-save">Auto-saved 2 run logs</span>
      </div>
      <div className="success-rate">100%</div>
      <div className="action-buttons">
        <button className="preview-btn">
          <span className="btn-icon"></span>
          <span>Preview</span>
        </button>
        <button className="save-btn">
          <span className="btn-icon"></span>
          <span>Save</span>
        </button>
        <button className="share-btn">
          <span className="btn-icon"></span>
          <span>Share</span>
        </button>
      </div>
      <div className="user-profile">
        <div className="profile-pic"></div>
      </div>
    </header>
  );
};

export default TopBar;