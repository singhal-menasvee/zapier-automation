import React from 'react';
import './LeftSidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScrewdriverWrench, // For Tools
faChartLine, // For Workflows (replacing faFlowchart)
faPuzzlePiece, // For Templates
faServer, // For Logs
faGear // For Settings
 } from '@fortawesome/free-solid-svg-icons';
// LeftSidebar now accepts onNavigate and activeItem props for interactivity
const LeftSidebar = ({ onNavigate, activeItem }) => {
    const handleItemClick = (itemName) => {
        if (onNavigate) {
            onNavigate(itemName);
        }
    };
    return (<aside className="left-sidebar">
      <div className={`sidebar-item ${activeItem === 'tools' ? 'active' : ''}`} onClick={() => handleItemClick('tools')}>
        <div className="sidebar-icon tools-icon">
          <FontAwesomeIcon icon={faScrewdriverWrench}/>
        </div>
        <span className="tooltip">Tools</span>
      </div>
      <div className={`sidebar-item ${activeItem === 'workflows' ? 'active' : ''}`} onClick={() => handleItemClick('workflows')}>
        <div className="sidebar-icon workflows-icon">
          <FontAwesomeIcon icon={faChartLine}/> {/* Using faChartLine for Workflows */}
        </div>
        <span className="tooltip">Workflows</span>
      </div>
      <div className={`sidebar-item ${activeItem === 'templates' ? 'active' : ''}`} onClick={() => handleItemClick('templates')}>
        <div className="sidebar-icon templates-icon">
          <FontAwesomeIcon icon={faPuzzlePiece}/>
        </div>
        <span className="tooltip">Templates</span>
      </div>
      <div className={`sidebar-item ${activeItem === 'logs' ? 'active' : ''}`} onClick={() => handleItemClick('logs')}>
        <div className="sidebar-icon logs-icon">
          <FontAwesomeIcon icon={faServer}/>
        </div>
        <span className="tooltip">Logs</span>
      </div>
      <div className={`sidebar-item ${activeItem === 'settings' ? 'active' : ''}`} onClick={() => handleItemClick('settings')}>
        <div className="sidebar-icon settings-icon">
          <FontAwesomeIcon icon={faGear}/>
        </div>
        <span className="tooltip">Settings</span>
      </div>
    </aside>);
};
export default LeftSidebar;
