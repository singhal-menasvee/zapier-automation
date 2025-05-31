import React, { useState } from 'react';
import { zapier_automation_backend } from '../../../declarations/zapier-automation-backend';
import { Web3ActionConfig } from './actions/Web3ActionConfig';
import { templates } from './templates';

const CreateWorkflowForm = ({ onSuccess, onCancel }) => { // Added onCancel for completeness, though not used in this snippet
  const [name, setName] = useState('');
  const [triggerType, setTriggerType] = useState('TimeBased'); // Retained for potential future use
  const [actionType, setActionType] = useState('MintNft');
  const [action, setAction] = useState({ type: 'MintNft' });

  const [trigger, setTrigger] = useState({ TimeBased: {} });
  const [actions, setActions] = useState([]);
  const [conditions, setConditions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newWorkflow = {
      name,
      trigger,
      // Ensure actions array is correctly populated based on current UI structure
      // For this example, assuming only one action is configured via actionType and action states
      actions: [{ [actionType]: action }],
      conditions
    };
    try {
      await zapier_automation_backend.create_workflow(newWorkflow);
      onSuccess();
    } catch (error) {
      console.error("Failed to create workflow:", error);
      // Optionally, set an error state here to display to the user
    }
  };

  const loadTemplate = (template) => {
    setName(template.name);
    setTrigger(template.trigger);
    setActions(template.actions); // This should correctly set the actions array
    setConditions(template.conditions);

    // Reset individual actionType and action if actions array is populated
    if (template.actions?.length > 0) {
        // If you want to set the UI to the first action of the template:
        const firstActionObject = template.actions[0];
        const firstActionKey = Object.keys(firstActionObject)[0];
        setActionType(firstActionKey);
        setAction(firstActionObject[firstActionKey]);
    } else {
        // If template has no actions, reset to default or clear
        setActionType('MintNft'); // Or some other default
        setAction({});
    }
  };

  return (
    // Outer container for the form area, using bg-card for a contained look
    <div className="bg-card p-6 rounded-lg shadow-lg">
      {/* Template selection UI */}
      {/* text-white to text-app-color */}
      <h2 className="text-app-color text-xl font-semibold mb-4">Start from a Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {templates.map((tpl, idx) => (
          <div
            key={idx}
            // bg-gray-700 to bg-secondary (or bg-primary if card is on primary), text-white to text-app-color. Removed hover:bg-gray-600
            className="bg-secondary text-app-color p-4 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => loadTemplate(tpl)}
          >
            <h3 className="font-bold text-lg">{tpl.name}</h3>
            {/* text color inherited */}
            <p className="text-sm opacity-80">{tpl.description}</p>
          </div>
        ))}
      </div>

      {/* Workflow form */}
      {/* bg-gray-800 to bg-secondary (could also be bg-primary or transparent if the outer div is bg-card) */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="workflowName" className="block text-sm font-medium text-app-color mb-1">
            Workflow Name
          </label>
          <input
            type="text"
            id="workflowName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome Workflow"
            // bg-gray-700 text-white to themed-input. Kept w-full, mb-4 (moved to div), rounded (from themed-input)
            className="themed-input w-full"
          />
        </div>

        {/* Action selector */}
        <div>
          <label htmlFor="actionType" className="block text-sm font-medium text-app-color mb-1">
            Action Type:
          </label>
          <select
            id="actionType"
            value={actionType}
            onChange={(e) => {
              const type = e.target.value;
              setActionType(type);
              setAction({});
            }}
            // bg-gray-700 text-white to themed-input
            className="themed-input w-full"
          >
            <option value="MintNft">Mint NFT</option>
            <option value="SendEmail">Send Email</option>
            {/* TODO: Add other action types here */}
          </select>

          {/* Conditional Action Configuration Components */}
          {actionType === 'MintNft' && (
            <div className="mt-4 p-4 border-themed rounded-md"> {/* Added border and padding for visual separation */}
              <Web3ActionConfig action={action} onChange={setAction} />
            </div>
          )}
          {/* Example for SendEmail (assuming a similar config component) */}
          {/* {actionType === 'SendEmail' && (
            <div className="mt-4 p-4 border-themed rounded-md">
              <EmailActionConfig action={action} onChange={setAction} />
            </div>
          )} */}
        </div>

        <div className="flex justify-end space-x-3">
            {/* Added a Cancel button as an example */}
            {typeof onCancel === 'function' && (
                 <button
                    type="button"
                    onClick={onCancel}
                    // Using themed-button with potentially different styling for secondary actions
                    className="themed-button bg-secondary text-app-color hover:opacity-80 px-4 py-2 rounded"
                  >
                Cancel
              </button>
            )}
            <button
              type="submit"
              // bg-blue-500 text-white to themed-button. Kept px-4 py-2 rounded.
              className="themed-button px-4 py-2 rounded"
            >
            Create Workflow
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateWorkflowForm;
