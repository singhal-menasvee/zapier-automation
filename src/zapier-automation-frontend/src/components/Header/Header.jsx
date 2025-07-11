import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faQuestionCircle, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Header = ({ principal, onLogout }) => {
  return (
    // Using Bootstrap's navbar component for the header
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm p-3">
      {/* Left section: Logo/App Name */}
      <div className="d-flex align-items-center">
        {/* Hamburger menu for mobile, toggles a collapsible sidebar/nav if implemented */}
        <button className="navbar-toggler me-3 d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <FontAwesomeIcon icon={faBars} className="text-white" />
        </button>
        {/* Brand name/logo */}
        <a className="navbar-brand h1 mb-0 text-info" href="#">DecentralFlow</a> {/* Using text-info for a blue-ish highlight */}
      </div>

      {/* Right section: User Actions and Profile */}
      <div className="ms-auto d-flex align-items-center"> {/* ms-auto pushes content to the right */}
        {/* Help/Support Icon Button */}
        <button className="btn btn-link text-secondary me-3"> {/* text-secondary for a subtle gray icon */}
          <FontAwesomeIcon icon={faQuestionCircle} className="h5 mb-0" /> {/* h5 for icon size */}
        </button>

        {/* Notifications Icon Button */}
        <button className="btn btn-link text-secondary me-3">
          <FontAwesomeIcon icon={faBell} className="h5 mb-0" />
        </button>

        {/* User Profile/Logout Dropdown */}
        <div className="dropdown">
          <button className="btn btn-link text-secondary dropdown-toggle d-flex align-items-center" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            <FontAwesomeIcon icon={faUserCircle} className="h4 mb-0 me-2" /> {/* h4 for user icon size, me-2 for margin-right */}
            {/* Display truncated principal if available, otherwise 'Guest' */}
            <span className="d-none d-md-inline text-sm">{principal ? `Hello, ${principal.substring(0, 8)}...` : 'Guest'}</span>
          </button>
          {/* Dropdown menu for logout */}
          <ul className="dropdown-menu dropdown-menu-end bg-dark border-secondary" aria-labelledby="dropdownMenuButton1">
            <li>
              <button
                onClick={onLogout}
                className="dropdown-item text-danger" // text-danger for red logout text
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
