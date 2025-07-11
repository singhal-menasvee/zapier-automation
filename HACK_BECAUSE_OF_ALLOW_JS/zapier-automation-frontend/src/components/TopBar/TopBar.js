import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faQuestionCircle, faUserCircle } from '@fortawesome/free-solid-svg-icons';
const TopBar = ({ principal, onLogout }) => {
    return (<nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm p-3"> {/* Converted to Bootstrap Navbar */}
      {/* Left section: Logo/App Name */}
      <div className="d-flex align-items-center">
        <button className="navbar-toggler me-3 d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <FontAwesomeIcon icon={faBars} className="text-white"/>
        </button>
        <a className="navbar-brand h1 mb-0 text-info" href="#">DecentralFlow</a> {/* text-info for blue-ish color */}
      </div>

      {/* Right section: User Actions */}
      <div className="ms-auto d-flex align-items-center"> {/* ms-auto pushes to right */}
        {/* Help/Support Icon */}
        <button className="btn btn-link text-secondary me-3"> {/* text-secondary for gray */}
          <FontAwesomeIcon icon={faQuestionCircle} className="h5 mb-0"/>
        </button>

        {/* Notifications Icon */}
        <button className="btn btn-link text-secondary me-3">
          <FontAwesomeIcon icon={faBell} className="h5 mb-0"/>
        </button>

        {/* User Profile/Logout Dropdown */}
        <div className="dropdown">
          <button className="btn btn-link text-secondary dropdown-toggle d-flex align-items-center" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            <FontAwesomeIcon icon={faUserCircle} className="h4 mb-0 me-2"/>
            <span className="d-none d-md-inline text-sm">{principal ? `Hello, ${principal.substring(0, 8)}...` : 'Guest'}</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end bg-dark border-secondary" aria-labelledby="dropdownMenuButton1">
            <li>
              <button onClick={onLogout} className="dropdown-item text-danger">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>);
};
export default TopBar;
