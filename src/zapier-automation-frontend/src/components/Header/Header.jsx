import React from 'react';
import './Header.css';

const Header = ({ isAuthenticated, principal, onLogin, onLogout }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <img src="/assets/logo.png" alt="logo" className="logo-img" />
          <span className="logo-text">DecentralFlow</span>
        </div>
        <div className="nav-buttons">
          {isAuthenticated ? (
            <>
              <span className="principal-text">
                {principal.slice(0, 6)}...{principal.slice(-6)}
              </span>
              <button className="login-btn" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={onLogin}>Login</button>
              <button className="get-started-btn">Get Started</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
