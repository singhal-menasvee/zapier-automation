import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

const NodeDropdown = ({ onRename, onDelete, onSelectIntegration }) => {
  return (
    // Bootstrap dropdown menu structure
    // The 'show' class is typically managed by Bootstrap's JS for data-bs-toggle="dropdown"
    // but since we're manually showing/hiding it via `showDropdown` state in WorkflowNode,
    // we just need the basic structure.
    <ul className="dropdown-menu dropdown-menu-dark show position-absolute" style={{ top: '100%', left: '0' }}>
      <li>
        <button
          className="dropdown-item d-flex align-items-center"
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling up to node click
            onRename();
          }}
        >
          <FontAwesomeIcon icon={faEdit} className="me-2" /> Rename
        </button>
      </li>
      <li>
        <button
          className="dropdown-item d-flex align-items-center"
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling up to node click
            onSelectIntegration();
          }}
        >
          <FontAwesomeIcon icon={faPlusSquare} className="me-2" /> Select Integration
        </button>
      </li>
      <li><hr className="dropdown-divider bg-secondary" /></li> {/* Divider */}
      <li>
        <button
          className="dropdown-item d-flex align-items-center text-danger"
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling up to node click
            onDelete();
          }}
        >
          <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Delete
        </button>
      </li>
    </ul>
  );
};

export default NodeDropdown;
