import React, { useState, useEffect } from 'react';
import TopNavigation from './TopNavigation/TopNavigation';
import Sidebars from './Sidebars/Sidebars';
import WelcomeSection from './WelcomeSection/WelcomeSection';
import WorkflowsSection from './WorkflowsSection/WorkflowsSection';
import './Dashboard.css';

const Dashboard = ({ authClient }) => {
  const [principal, setPrincipal] = useState(null);

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
          <WelcomeSection />
          <WorkflowsSection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
