import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { zapier_automation_backend } from 'declarations/zapier_automation_backend';
import TopBar from './TopBar/TopBar';
import LeftSidebar from './Sidebar/LeftSidebar';
import MainPanel from './MainPanel/MainPanel';
import NodeConfigPanel from './NodeConfigPanel/NodeConfigPanel';
import './Canvas.css';

const Canvas = () => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [connectionCheckComplete, setConnectionCheckComplete] = useState(false);
  const location = useLocation();

  // Add retry logic for backend connection checks
  const checkBackendConnection = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        // Always pass a string as required by your .did interface
        return await zapier_automation_backend.has_google_token("");
      } catch (err) {
        console.log(`Backend check attempt ${i + 1} failed:`, err);
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const googleConnected = urlParams.get('google_connected') === 'true';
        const error = urlParams.get('error');

        if (error) {
          const errorMessage = error.replace(/_/g, ' ');
          console.error('OAuth error:', errorMessage);
          alert(`OAuth Error: ${errorMessage}`);
        }

        // Check both URL params and backend state
        let isConnected = googleConnected;

        // Only check backend if we didn't get a positive from URL params
        if (!isConnected) {
          try {
            isConnected = await checkBackendConnection();
          } catch (backendError) {
            console.error('Error checking backend connection after retries:', backendError);
          }
        }

        setIsGoogleConnected(isConnected);

        // Update trigger connection status if needed
        if (isConnected && selectedTrigger?.type === 'google_calendar') {
          setSelectedTrigger(prev => ({
            ...prev,
            connected: true
          }));
        }

        // Clean up URL parameters
        if (urlParams.has('google_connected') || urlParams.has('error')) {
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }
      } catch (err) {
        console.error('Error in connection check:', err);
      } finally {
        setConnectionCheckComplete(true);
      }
    };

    checkConnection();
  }, [location.search, selectedTrigger]);

  const handleAppSelect = (app) => setSelectedApp(app);

  const handleClosePanel = () => setSelectedApp(null);

  const handleTriggerSelect = async (triggerData) => {
    setSelectedTrigger(triggerData);
    if (triggerData?.type === 'google_calendar') {
      try {
        const isConnected = await checkBackendConnection();
        setIsGoogleConnected(isConnected);
        if (isConnected) {
          setSelectedTrigger(prev => ({
            ...prev,
            connected: true
          }));
        }
      } catch (err) {
        console.error('Error verifying Google connection:', err);
        setIsGoogleConnected(false);
      }
    }
  };

  const handleTriggerDisconnect = () => {
    if (selectedTrigger?.type === 'google_calendar') {
      setSelectedTrigger(null);
      setIsGoogleConnected(false);
      localStorage.removeItem('google_connected');
      localStorage.removeItem('google_access_token');
      localStorage.removeItem('google_refresh_token');
    }
  };

  if (!connectionCheckComplete) {
    return (
      <div className="canvas-loading">
        <div className="loading-spinner"></div>
        <p>Checking connections...</p>
      </div>
    );
  }

  return (
    <div className="canvas-container">
      <TopBar />
      <div className="canvas-main">
        <LeftSidebar />
        <MainPanel 
          onAppSelect={handleAppSelect}
          onTriggerSelect={handleTriggerSelect}
          selectedTrigger={selectedTrigger}
          isGoogleConnected={isGoogleConnected}
        />
        <NodeConfigPanel 
          app={selectedApp} 
          onClose={handleClosePanel}
          selectedTrigger={selectedTrigger}
          isGoogleConnected={isGoogleConnected}
          onTriggerDisconnect={handleTriggerDisconnect}
        />
      </div>
    </div>
  );
};

export default Canvas;
