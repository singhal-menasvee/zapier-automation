import React, { useState, useEffect } from 'react';
import TopNavigation from './TopNavigation/TopNavigation';
import Sidebars from './Sidebars/Sidebars';
import WelcomeSection from './WelcomeSection/WelcomeSection';
import WorkflowsSection from './WorkflowsSection/WorkflowsSection';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ authClient }) => {
  const navigate = useNavigate();
  const [principal, setPrincipal] = useState(null);

  const isAuthenticated = !!principal;

  const handleWorkflowCreation = () => {
    if (isAuthenticated) {
      navigate('/Canvas');
    } else {
      alert('Please login first!');
    }
  };

  useEffect(() => {
    if (authClient) {
      const identity = authClient.getIdentity();
      setPrincipal(identity?.getPrincipal().toString());
    }
  }, [authClient]);

  return (
    <div className="dashboard-container">
      <TopNavigation principal={principal} />
      <div className="dashboard-main">
        <Sidebars />
        <div className="dashboard-content">
          <WelcomeSection onCreateWorkflow={handleWorkflowCreation} />
          <WorkflowsSection />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;