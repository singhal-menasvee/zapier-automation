import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <span className="logo-text">DecentralFlow</span>
        </div>
        <div className="nav-buttons">
          <button className="login-btn">Login</button>
          <button className="get-started-btn">Get Started</button>
        </div>
      </div>
    </header>
  );
};

export default Header;