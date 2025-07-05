import React, { useState, useRef, useEffect } from 'react';
import WorkflowNode from '../WorkflowNode/WorkflowNode';
import './MainPanel.css';
import { faBolt, faRocket, faSearchPlus, faSearchMinus, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MainPanel = ({ onAppSelect }) => {
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.3));
  const handleResetZoom = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (e.button === 0 && e.target === canvasRef.current) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      canvasRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.3, Math.min(3, prev * delta)));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        canvas.removeEventListener('wheel', handleWheel);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, lastPanPoint]);

  return (
    <main className="main-panel">
      {/* Zoom Controls */}
      <div className="zoom-controls">
        <button 
          className="zoom-btn" 
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <FontAwesomeIcon icon={faSearchPlus} />
        </button>
        <button 
          className="zoom-btn" 
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <FontAwesomeIcon icon={faSearchMinus} />
        </button>
        <button 
          className="zoom-btn" 
          onClick={handleResetZoom}
          title="Reset Zoom"
        >
          <FontAwesomeIcon icon={faHome} />
        </button>
        <div className="zoom-level">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Canvas with Dot Grid */}
      <div 
        className="workflow-canvas"
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        style={{
          transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
          transformOrigin: 'center center',
          cursor: isPanning ? 'grabbing' : 'grab'
        }}
      >
        {/* Dot Grid Background */}
        <div className="dot-grid" />
        
        {/* Workflow Content */}
        <div className="workflow-content">
          <WorkflowNode 
            type="trigger" 
            title="New Email Received" 
            subtitle="Gmail Integration" 
            color="#10B981"
            icon={faBolt}
            onAppSelect={onAppSelect}
          />
          <div className="connection-line"></div>
          <div className="connection-line1"></div>
          <WorkflowNode 
            type="action" 
            title="Send to Slack" 
            subtitle="Channel: #notifications" 
            color="#38BDF8"
            icon={faRocket}
            onAppSelect={onAppSelect}
          />
        </div>
      </div>
    </main>
  );
};

export default MainPanel;