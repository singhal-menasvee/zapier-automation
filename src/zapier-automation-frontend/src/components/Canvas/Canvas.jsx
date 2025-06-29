import React from 'react';
import TopBar from './TopBar/TopBar';
import LeftSidebar from './Sidebar/LeftSidebar';
import MainPanel from './MainPanel/MainPanel';
import RightPanel from './RightPanel/RightPanel';
import WorkflowNode from './WorkflowNode/WorkflowNode';
import './Canvas.css';

const Canvas = () => {
  return (
    <div className="canvas-container">
      <TopBar />
      <div className="canvas-main">
        <LeftSidebar />
        <MainPanel />
        <RightPanel />
      </div>
    </div>
  );
};

export default Canvas;