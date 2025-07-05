import React, { useState } from 'react';
import TopBar from './TopBar/TopBar';
import LeftSidebar from './Sidebar/LeftSidebar';
import MainPanel from './MainPanel/MainPanel';
import WorkflowNode from './WorkflowNode/WorkflowNode';
import NodeConfigPanel from './NodeConfigPanel/NodeConfigPanel'; // ✅ Make sure path is correct
import './Canvas.css';

const Canvas = () => {
  const [selectedApp, setSelectedApp] = useState(null);

  const handleAppSelect = (app) => {
    setSelectedApp(app);
  };

  const handleClosePanel = () => {
    setSelectedApp(null);
  };

  return (
    <div className="canvas-container">
      <TopBar />
      <div className="canvas-main">
        <LeftSidebar />
        <MainPanel onAppSelect={handleAppSelect} />
        <NodeConfigPanel app={selectedApp} onClose={handleClosePanel} />
      </div>
    </div>
  );
};

export default Canvas;
