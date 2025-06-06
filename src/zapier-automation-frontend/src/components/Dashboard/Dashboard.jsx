import React from 'react';
import TopNavigation from './TopNavigation/TopNavigation';
import Sidebars from './Sidebars/Sidebars';
import WelcomeSection from './WelcomeSection/WelcomeSection';
import WorkflowsSection from './WorkflowsSection/WorkflowsSection';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <TopNavigation />
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