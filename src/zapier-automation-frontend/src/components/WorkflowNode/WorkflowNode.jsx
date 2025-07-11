import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NodeDropdown from './NodeDropdown'; // NodeDropdown is in the same directory
import IntegrationPicker from '../Canvas/IntegrationCard/IntegrationPicker'; // CORRECTED PATH for IntegrationPicker
import './WorkflowNode.css'; // WorkflowNode's own CSS

// WorkflowNode now accepts nodeId, onClick, isSelected, and selectedIntegration props
const WorkflowNode = ({
  nodeId, // Unique ID for this node
  type,
  color,
  icon,
  onSelectIntegrationForNode, // Callback for when an integration is selected
  onClick, // Callback for when the node itself is clicked
  isSelected, // To visually indicate if this node is selected
  selectedIntegration, // The selected integration object for this node
  position, // Receive position prop
  onDragStart, // Receive drag start handler
  onDelete // Receive delete handler
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Style object for positioning the node
  const nodeStyle = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    cursor: 'grab', // Indicate draggable
  };

  const handleMouseDown = (e) => {
    // Only start drag if not clicking dropdown or delete button
    if (e.target.closest('.node-dropdown-toggle') || e.target.closest('.node-delete-button')) {
      return;
    }
    onDragStart(nodeId, position, { x: e.clientX, y: e.clientY });
  };

  const handleNodeClick = (e) => {
    // Prevent click from propagating if a drag just occurred or dropdown was toggled
    if (e.detail === 0) return; // This can happen after a drag ends
    onClick(nodeId);
  };

  const handleDropdownToggle = (e) => {
    e.stopPropagation(); // Prevent node click when toggling dropdown
    setShowDropdown(!showDropdown);
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete this ${type} node?`)) {
      onDelete(nodeId);
    }
  };

  // This function is called when an app is selected in the IntegrationPicker
  const handleIntegrationSelect = (app) => {
    // Call the prop function to update the parent's state (MainPanel)
    onSelectIntegrationForNode(nodeId, app);
    setShowPicker(false); // Hide the picker after selection
  };

  const handleRename = () => {
    const newName = prompt('Enter new name for the node:');
    if (newName) {
      console.log(`Node ${nodeId} renamed to: ${newName}`);
    }
    setShowDropdown(false);
  };

  const openIntegrationModal = () => {
    setShowPicker(true); // Show the IntegrationPicker
    setShowDropdown(false); // Hide the NodeDropdown
  };

  // Determine the title and subtitle to display on the node
  const displayTitle = type === 'trigger' ? 'Trigger' : 'Action';
  const displaySubtitle = selectedIntegration
    ? selectedIntegration.name // If an integration is selected, display its name
    : (type === 'trigger' ? 'When this happens' : 'Do this'); // Otherwise, display default

  return (
    <>
      <div
        className={`workflow-node card bg-dark text-white border-secondary rounded shadow-sm ${isSelected ? 'border-primary border-2' : ''}`}
        style={nodeStyle}
        onClick={handleNodeClick}
        onMouseDown={handleMouseDown}
      >
        <div className="card-body p-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center">
              <div className="node-icon-wrapper me-3 rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: color }}>
                {selectedIntegration && selectedIntegration.icon ? (
                  <FontAwesomeIcon icon={selectedIntegration.icon} className="text-white" />
                ) : (
                  <FontAwesomeIcon icon={icon} className="text-white" />
                )}
              </div>
              <div>
                <h5 className="card-title h6 mb-0 text-white">{displayTitle}</h5>
                <p className="card-subtitle text-muted small mb-0">{displaySubtitle}</p>
              </div>
            </div>
            <NodeDropdown
              show={showDropdown}
              onToggle={handleDropdownToggle}
              onDelete={handleDeleteClick}
              onRename={handleRename} // Pass rename handler
              onSelectIntegration={openIntegrationModal} // Pass open integration modal handler
            />
          </div>

          {!selectedIntegration && (
            <div className="mt-3">
              {/* IntegrationPicker is now rendered as a modal, not inline */}
              {/* The actual IntegrationPicker component is rendered conditionally at the App level or MainPanel level */}
              <button className="btn btn-sm btn-outline-light w-100" onClick={openIntegrationModal}>
                Select Integration
              </button>
            </div>
          )}

          {selectedIntegration && (
            <div className="mt-3 p-2 bg-secondary rounded d-flex align-items-center">
              <div className="me-2 text-primary">
                {selectedIntegration.icon && <FontAwesomeIcon icon={selectedIntegration.icon} />}
              </div>
              <span className="small text-white">{selectedIntegration.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Render IntegrationPicker conditionally as a modal */}
      {showPicker && (
        <IntegrationPicker onSelect={handleIntegrationSelect} onClose={() => setShowPicker(false)} />
      )}
    </>
  );
};

export default WorkflowNode;
