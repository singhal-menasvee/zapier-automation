import React, { useState, useRef } from 'react';
// Corrected path: Go up two levels (from MainPanel) to src/components/, then into WorkflowNode/
import WorkflowNode from '../../WorkflowNode/WorkflowNode';
// Corrected path: Go up one level (from MainPanel) to Canvas, then into RightPanel
import RightPanel from '../RightPanel/RightPanel';
import './MainPanel.css';
import { faBolt, faRocket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon for buttons
const MainPanel = () => {
    // State to manage all nodes in the workflow
    // Each node will have an id, type, color, icon, and potentially a selectedIntegration and config
    const [nodes, setNodes] = useState([
        {
            id: 'trigger-1', // Unique ID for the trigger node
            type: 'trigger',
            title: 'Trigger', // Default title
            subtitle: 'When this happens', // Default subtitle
            color: '#10B981',
            icon: faBolt,
            selectedIntegration: null, // This will hold the selected app object (e.g., Google Calendar)
            config: {}, // New: This will hold the specific configuration data (e.g., triggerType, calendarId)
            position: { x: 100, y: 100 } // Initial position for existing nodes
        },
        {
            id: 'action-1', // Unique ID for the action node
            type: 'action',
            title: 'Action', // Default title
            subtitle: 'Do this', // Default subtitle
            color: '#38BDF8',
            icon: faRocket,
            selectedIntegration: null, // This will hold the selected app object
            config: {}, // New: This will hold the specific configuration data
            position: { x: 300, y: 100 } // Initial position for existing nodes
        },
    ]);
    // State to manage which node is currently selected for configuration
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    // State to manage drag operations
    const [draggingNodeId, setDraggingNodeId] = useState(null);
    const dragOffset = useRef({ x: 0, y: 0 }); // Stores the offset from mouse to node top-left
    const initialNodePos = useRef({ x: 0, y: 0 }); // Stores the node's position when drag started
    // Handler for when a WorkflowNode is clicked
    const handleNodeClick = (nodeId) => {
        setSelectedNodeId(nodeId);
    };
    // Handler for when an integration is selected within a WorkflowNode's picker
    const handleIntegrationSelectedForNode = (nodeId, selectedApp) => {
        setNodes((prevNodes) => prevNodes.map((node) => node.id === nodeId
            ? {
                ...node,
                selectedIntegration: selectedApp,
                config: {}, // Reset config when a new integration is selected
            }
            : node));
        // After selecting an integration, automatically select this node for configuration
        setSelectedNodeId(nodeId);
    };
    // Handler for when the configuration of a specific node changes in the sidebar
    const handleNodeConfigChange = (nodeId, newConfig) => {
        setNodes((prevNodes) => prevNodes.map((node) => node.id === nodeId ? { ...node, config: newConfig } : node));
        console.log(`Node ${nodeId} config updated:`, newConfig);
        // You might want to trigger a save to backend canister here later
    };
    const addNode = (type) => {
        const newNodeId = `${type}-${nodes.length + 1}`;
        const newNode = {
            id: newNodeId,
            type: type,
            title: type === 'trigger' ? 'New Trigger' : 'New Action',
            subtitle: type === 'trigger' ? 'Select a trigger' : 'Select an action',
            color: type === 'trigger' ? '#10B981' : '#38BDF8',
            icon: type === 'trigger' ? faBolt : faRocket,
            selectedIntegration: null,
            config: {},
            // Simple positioning for new nodes, can be improved later
            position: { x: 100 + (nodes.length * 50), y: 250 + (nodes.length * 20) }
        };
        setNodes((prevNodes) => [...prevNodes, newNode]);
        setSelectedNodeId(newNodeId); // Select the newly added node
    };
    // Function to delete a node
    const deleteNode = (nodeIdToDelete) => {
        setNodes((prevNodes) => prevNodes.filter(node => node.id !== nodeIdToDelete));
        if (selectedNodeId === nodeIdToDelete) {
            setSelectedNodeId(null); // Deselect if the deleted node was selected
        }
    };
    // handleDragStart from WorkflowNode
    const handleDragStart = (nodeId, nodeCurrentPos, mouseStartPos) => {
        setDraggingNodeId(nodeId);
        initialNodePos.current = nodeCurrentPos;
        // Calculate offset from mouse position to node's top-left corner
        dragOffset.current = {
            x: mouseStartPos.x - nodeCurrentPos.x,
            y: mouseStartPos.y - nodeCurrentPos.y,
        };
        // Add global event listeners for mouse move and up
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };
    // handleMouseMove to update node position during drag
    const handleMouseMove = (e) => {
        if (draggingNodeId) {
            // Calculate new node position based on mouse movement and initial offset
            const newX = e.clientX - dragOffset.current.x;
            const newY = e.clientY - dragOffset.current.y;
            setNodes((prevNodes) => prevNodes.map((node) => node.id === draggingNodeId
                ? { ...node, position: { x: newX, y: newY } }
                : node));
        }
    };
    // handleMouseUp to end drag operation
    const handleMouseUp = () => {
        setDraggingNodeId(null);
        // Remove global event listeners
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
    // Find the currently selected node's data
    const currentlySelectedNode = nodes.find((node) => node.id === selectedNodeId);
    return (<main className="main-panel d-flex h-100"> {/* Bootstrap flex for layout */}
      <div className="workflow-canvas flex-grow-1 p-3 bg-secondary-subtle rounded position-relative">
        {/* Add Node Buttons */}
        <div className="position-absolute top-0 start-0 m-3 z-index-1050"> {/* Position buttons at top-left */}
          <button className="btn btn-sm btn-success me-2" onClick={() => addNode('trigger')} title="Add Trigger Node">
            <FontAwesomeIcon icon={faBolt} className="me-1"/> Add Trigger
          </button>
          <button className="btn btn-sm btn-info" onClick={() => addNode('action')} title="Add Action Node">
            <FontAwesomeIcon icon={faRocket} className="me-1"/> Add Action
          </button>
        </div>

        {nodes.map((node) => (<WorkflowNode key={node.id} // Important for React list rendering
         nodeId={node.id} // Pass the node's ID
         type={node.type} title={node.title} // Now using dynamic title
         subtitle={node.subtitle} // Now using dynamic subtitle
         color={node.color} icon={node.icon} onSelectIntegrationForNode={handleIntegrationSelectedForNode} // Pass the handler down
         onClick={handleNodeClick} // Pass handler for node click
         isSelected={node.id === selectedNodeId} // Pass selection status for styling
         selectedIntegration={node.selectedIntegration} // Pass the selected integration down
         position={node.position} // Pass position to WorkflowNode
         onDragStart={handleDragStart} // Pass the drag start handler
         onDelete={deleteNode} // Pass the deleteNode function
        />))}
        {/* Connection lines would need custom CSS or SVG */}
        <div className="connection-line"></div>
        <div className="connection-line1"></div>
      </div>

      {/* Node Configuration Sidebar */}
      <RightPanel selectedNode={currentlySelectedNode} // Pass the entire selected node object
     onNodeConfigChange={handleNodeConfigChange} // Pass the new handler down
    />
    </main>);
};
export default MainPanel;
