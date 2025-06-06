import React from 'react';
import '../Dashboard.css';

const Sidebars = () => {
  return (
    <aside className="sidebar">
     
      <p className="tools-apps-title">Tools & Apps</p>
      <img src="/assets/google-calendar.svg" alt="Google Calendar" className="sidebar-app-icon" />
      <img src="/assets/metamask.svg" alt="MetaMask" className="sidebar-app-icon" />
    </aside>
  );
};

export default Sidebars;
