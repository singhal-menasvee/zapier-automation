import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <div className="logo-icon"></div>
            <span className="logo-text">DecentralFlow</span>
          </div>
          <div className="social-icons">
            <div className="social-icon"></div>
            <div className="social-icon"></div>
            <div className="social-icon"></div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 AutoFlow. Decentralized automation for everyone.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;