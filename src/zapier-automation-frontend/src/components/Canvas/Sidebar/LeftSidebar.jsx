import React from 'react';
import './LeftSidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faScrewdriverWrench,
  faChartLine,
  faPuzzlePiece,
  faServer,
  faGear
} from '@fortawesome/free-solid-svg-icons';

const LeftSidebar = () => {
  return (
    <aside className="left-sidebar">
      <div className="sidebar-item">
        <div className="sidebar-icon tools-icon">
          <FontAwesomeIcon icon={faScrewdriverWrench} />
        </div>
        <span className="tooltip">Tools</span>
      </div>
      <div className="sidebar-item">
        <div className="sidebar-icon workflows-icon">
          <FontAwesomeIcon icon={faChartLine} />
        </div>
        <span className="tooltip">Workflows</span>
      </div>
      <div className="sidebar-item">
        <div className="sidebar-icon templates-icon">
          <FontAwesomeIcon icon={faPuzzlePiece} />
        </div>
        <span className="tooltip">Templates</span>
      </div>
      <div className="sidebar-item">
        <div className="sidebar-icon logs-icon">
          <FontAwesomeIcon icon={faServer} />
        </div>
        <span className="tooltip">Logs</span>
      </div>
      <div className="sidebar-item">
        <div className="sidebar-icon settings-icon">
          <FontAwesomeIcon icon={faGear} />
        </div>
        <span className="tooltip">Settings</span>
      </div>
    </aside>
  );
};

export default LeftSidebar;
