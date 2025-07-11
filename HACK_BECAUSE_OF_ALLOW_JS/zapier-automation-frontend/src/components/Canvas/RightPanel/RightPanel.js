import React, { useState, useEffect } from 'react';
import IntegrationCard from '../IntegrationCard/IntegrationCard'; // Assuming this path is correct
import GoogleCalendarTriggerConfig from './GoogleCalendarTriggerConfig'; // Import the new config component
import GmailTriggerConfig from './GmailTriggerConfig'; // Import GmailTriggerConfig
import SlackActionConfig from './SlackActionConfig'; // Import SlackActionConfig
import DiscordActionConfig from './DiscordActionConfig'; // Import DiscordActionConfig
import WhatsAppActionConfig from './WhatsAppActionConfig'; // Import WhatsAppActionConfig
import TransferEthActionConfig from './TransferEthActionConfig'; // Import TransferEthActionConfig
import MintNftActionConfig from './MintNftActionConfig'; // NEW: Import MintNftActionConfig
import './RightPanel.css'; // Keep custom CSS for specific panel layout
const RightPanel = ({ selectedNode, onNodeConfigChange }) => {
    const [currentNodeConfig, setCurrentNodeConfig] = useState({});
    useEffect(() => {
        if (selectedNode) {
            setCurrentNodeConfig(selectedNode.config || {});
        }
        else {
            setCurrentNodeConfig({});
        }
    }, [selectedNode]);
    const handleSpecificConfigChange = (configData) => {
        setCurrentNodeConfig(configData);
        if (onNodeConfigChange && selectedNode) {
            onNodeConfigChange(selectedNode.id, configData);
        }
    };
    const renderConfigurationPanel = () => {
        if (!selectedNode) {
            return <p className="text-muted">Select a node on the canvas to configure its settings.</p>;
        }
        if (!selectedNode.selectedIntegration) {
            return <p className="text-muted">Select an app for this {selectedNode.type} to configure its settings.</p>;
        }
        switch (selectedNode.selectedIntegration.name) {
            case 'Google Calendar':
                return (<GoogleCalendarTriggerConfig nodeId={selectedNode.id} initialConfig={currentNodeConfig} onConfigChange={handleSpecificConfigChange}/>);
            case 'Gmail':
                return (<GmailTriggerConfig nodeId={selectedNode.id} initialConfig={currentNodeConfig} onConfigChange={handleSpecificConfigChange}/>);
            case 'Slack':
                return (<SlackActionConfig nodeId={selectedNode.id} initialConfig={currentNodeConfig} onConfigChange={handleSpecificConfigChange}/>);
            case 'Discord':
                return (<DiscordActionConfig nodeId={selectedNode.id} initialConfig={currentNodeConfig} onConfigChange={handleSpecificConfigChange}/>);
            case 'WhatsApp':
                return (<WhatsAppActionConfig nodeId={selectedNode.id} initialConfig={currentNodeConfig} onConfigChange={handleSpecificConfigChange}/>);
            case 'Transfer ETH': // Case for Transfer ETH
                return (<TransferEthActionConfig nodeId={selectedNode.id} initialConfig={currentNodeConfig} onConfigChange={handleSpecificConfigChange}/>);
            case 'Mint NFT': // NEW: Case for Mint NFT
                return (<MintNftActionConfig nodeId={selectedNode.id} initialConfig={currentNodeConfig} onConfigChange={handleSpecificConfigChange}/>);
            default:
                return (<p className="text-muted">
            Configuration for {selectedNode.selectedIntegration.name} is not yet
            implemented.
          </p>);
        }
    };
    return (<aside className="right-panel bg-dark text-white p-3 border-start border-secondary"> {/* Bootstrap classes */}
      <div className="panel-header mb-4">
        <h2 className="h4 fw-bold text-white mb-2">Node Configuration</h2>
        {selectedNode ? (<>
            <p className="text-muted mb-1">
              Selected: {selectedNode.type === 'trigger' ? 'Trigger' : 'Action'} Node
            </p>
            {selectedNode.selectedIntegration && (<p className="text-muted mb-0">
                App: <strong>{selectedNode.selectedIntegration.name}</strong>
              </p>)}
          </>) : (<p className="text-muted">Select a node to configure its settings.</p>)}
      </div>

      <div className="config-panel-container mb-4">
        {renderConfigurationPanel()}
      </div>

      {!selectedNode || !selectedNode.selectedIntegration ? (<>
          <div className="integrations-section mt-4">
            <h3 className="h5 fw-semibold text-white mb-3">Available Integrations</h3>
            <div className="integrations-grid row row-cols-2 g-3"> {/* Bootstrap grid */}
              <div className="col">
                <IntegrationCard name="Google Calendar" color="#34A853" icon="calendar" // Matches getIntegrationIcon in IntegrationCard.jsx
         onClick={() => {
                if (selectedNode && onNodeConfigChange) {
                    onNodeConfigChange(selectedNode.id, {
                        ...selectedNode.config,
                        selectedIntegration: { name: 'Google Calendar', icon: 'calendar' }
                    });
                }
            }}/>
              </div>
              <div className="col">
                <IntegrationCard name="Gmail" color="#EF4444" icon="envelope" // Matches getIntegrationIcon in IntegrationCard.jsx
         onClick={() => {
                if (selectedNode && onNodeConfigChange) {
                    onNodeConfigChange(selectedNode.id, {
                        ...selectedNode.config,
                        selectedIntegration: { name: 'Gmail', icon: 'envelope' }
                    });
                }
            }}/>
              </div>
              <div className="col">
                <IntegrationCard name="Slack" color="#2563EB" icon="slack" // Matches getIntegrationIcon in IntegrationCard.jsx
         onClick={() => {
                if (selectedNode && onNodeConfigChange) {
                    onNodeConfigChange(selectedNode.id, {
                        ...selectedNode.config,
                        selectedIntegration: { name: 'Slack', icon: 'slack' }
                    });
                }
            }}/>
              </div>
              <div className="col">
                <IntegrationCard name="Discord" color="#9333EA" icon="discord" // Matches getIntegrationIcon in IntegrationCard.jsx
         onClick={() => {
                if (selectedNode && onNodeConfigChange) {
                    onNodeConfigChange(selectedNode.id, {
                        ...selectedNode.config,
                        selectedIntegration: { name: 'Discord', icon: 'discord' }
                    });
                }
            }}/>
              </div>
              <div className="col">
                <IntegrationCard name="WhatsApp" color="#16A34A" icon="whatsapp" // Matches getIntegrationIcon in IntegrationCard.jsx
         onClick={() => {
                if (selectedNode && onNodeConfigChange) {
                    onNodeConfigChange(selectedNode.id, {
                        ...selectedNode.config,
                        selectedIntegration: { name: 'WhatsApp', icon: 'whatsapp' }
                    });
                }
            }}/>
              </div>
            </div>
          </div>

          <div className="smart-contracts-section mt-4">
            <h3 className="h5 fw-semibold text-white mb-3">Smart Contracts</h3>
            <div className="contract-actions d-flex flex-column gap-3"> {/* Bootstrap flex column with gap */}
              <div className="card bg-secondary border-0 cursor-pointer hover-shadow-lg" onClick={() => {
                if (selectedNode && onNodeConfigChange) {
                    onNodeConfigChange(selectedNode.id, {
                        ...selectedNode.config,
                        selectedIntegration: { name: 'Transfer ETH', type: 'SmartContract', icon: 'ethereum' } // Added icon for ETH
                    });
                }
            }}>
                <div className="card-body d-flex align-items-center p-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ backgroundColor: '#F97316', width: '2.5rem', height: '2.5rem' }}>
                    <span className="text-white fw-bold">Ξ</span> {/* Placeholder for ETH icon */}
                  </div>
                  <div>
                    <h4 className="card-title h6 mb-0 text-white">Transfer ETH</h4>
                    <p className="card-text text-muted small mb-0">Ethereum Network</p>
                  </div>
                </div>
              </div>
              <div className="card bg-secondary border-0 cursor-pointer hover-shadow-lg" onClick={() => {
                if (selectedNode && onNodeConfigChange) {
                    onNodeConfigChange(selectedNode.id, {
                        ...selectedNode.config,
                        selectedIntegration: { name: 'Mint NFT', type: 'SmartContract', icon: 'nft' } // Added icon for NFT
                    });
                }
            }}>
                <div className="card-body d-flex align-items-center p-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ backgroundColor: '#EAB308', width: '2.5rem', height: '2.5rem' }}>
                    <span className="text-white fw-bold">🖼️</span> {/* Placeholder for NFT icon */}
                  </div>
                  <div>
                    <h4 className="card-title h6 mb-0 text-white">Mint NFT</h4>
                    <p className="card-text text-muted small mb-0">ERC-721</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>) : null}
    </aside>);
};
export default RightPanel;
