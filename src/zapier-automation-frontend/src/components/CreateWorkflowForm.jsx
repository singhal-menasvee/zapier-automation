import React, { useState } from 'react';
import { zapier_automation_backend } from '../../../declarations/zapier-automation-backend';
import { Web3ActionConfig } from './actions/Web3ActionConfig';
import { templates } from './templates';

const CreateWorkflowForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [triggerType, setTriggerType] = useState('TimeBased');
  const [actionType, setActionType] = useState('MintNft');
  const [action, setAction] = useState({ type: 'MintNft' });

  // New state to hold full trigger/actions/conditions
  const [trigger, setTrigger] = useState({ TimeBased: {} });
  const [actions, setActions] = useState([]);
  const [conditions, setConditions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newWorkflow = {
      name,
      trigger,
      actions: [...actions, { [actionType]: action }],
      conditions
    };
    await zapier_automation_backend.create_workflow(newWorkflow);
    onSuccess();
  };

  const loadTemplate = (template) => {
    setName(template.name);
    setTrigger(template.trigger);
    setActions(template.actions);
    setConditions(template.conditions);
    // Optional: auto-set first action type if only one action
    if (template.actions?.length === 1) {
      const [firstAction] = template.actions;
      const actionKey = Object.keys(firstAction)[0];
      setActionType(actionKey);
      setAction(firstAction[actionKey]);
    }
  };

  return (
    <div>
      {/* Template selection UI */}
      <h2 className="text-white text-lg mb-2">Start from a Template</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {templates.map((tpl, idx) => (
          <div
            key={idx}
            className="bg-gray-700 text-white p-3 rounded cursor-pointer hover:bg-gray-600"
            onClick={() => loadTemplate(tpl)}
          >
            <h3 className="font-bold">{tpl.name}</h3>
            <p className="text-sm">{tpl.description}</p>
          </div>
        ))}
      </div>

      {/* Workflow form */}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg">
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Workflow name"
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        />

        {/* Action selector */}
        <div className="mb-4">
          <label className="block text-white mb-1">Action Type:</label>
          <select
            value={actionType}
            onChange={(e) => {
              const type = e.target.value;
              setActionType(type);
              setAction({}); // Clear config when type changes
            }}
            className="w-full p-2 bg-gray-700 text-white rounded"
          >
            <option value="MintNft">Mint NFT</option>
            <option value="SendEmail">Send Email</option>
          </select>

          {actionType === 'MintNft' && (
            <Web3ActionConfig action={action} onChange={setAction} />
          )}
          {/* Add conditional configs for SendEmail etc. */}
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Workflow
        </button>
      </form>
    </div>
  );
};

export default CreateWorkflowForm;
