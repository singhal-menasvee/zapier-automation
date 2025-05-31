import React, { useState, useEffect } from 'react';
import { zapier_automation_backend } from '../../../declarations/zapier-automation-backend';
import { Web3ActionConfig } from './actions/Web3ActionConfig';
// Action specific config components would be imported here as needed
// import { EmailActionConfig } from './actions/EmailActionConfig';

const CreateWorkflowForm = ({ onSuccess, onCancel, initialTemplate }) => {
  const [name, setName] = useState('');
  const [triggerType, setTriggerType] = useState('TimeBased');
  const [trigger, setTrigger] = useState({ TimeBased: { cron: '* * * * *' } }); // Default trigger state

  // For now, supporting one action. Future: an array of actions.
  const [actionType, setActionType] = useState('MintNft');
  const [action, setAction] = useState({}); // Current action being configured

  // This 'actions' state would hold an array of configured action objects for multi-action support
  // const [actions, setActions] = useState([]);
  const [conditions, setConditions] = useState([]);


  const loadTemplate = (template) => {
    setName(template.name || '');

    if (template.trigger && Object.keys(template.trigger).length > 0) {
      const currentTriggerType = Object.keys(template.trigger)[0];
      setTriggerType(currentTriggerType);
      setTrigger(template.trigger);
    } else {
      setTriggerType('TimeBased');
      setTrigger({ TimeBased: { cron: '* * * * *' } });
    }

    // For single action setup as currently implemented:
    if (template.actions && template.actions.length > 0) {
      const firstActionObject = template.actions[0];
      const firstActionKey = Object.keys(firstActionObject)[0];
      setActionType(firstActionKey);
      setAction(firstActionObject[firstActionKey] || {});
    } else {
      // Reset to default if template has no actions or is cleared
      setActionType('MintNft'); // Default action type
      setAction({});
    }
    // setActions(template.actions || []); // For multi-action support
    setConditions(template.conditions || []);
  };

  useEffect(() => {
    if (initialTemplate) {
      loadTemplate(initialTemplate);
    } else {
      // Reset form to default when no template is provided (e.g. "Create Custom Workflow")
      loadTemplate({ name: '', trigger: { TimeBased: { cron: '* * * * *'}}, actions: [], conditions: [] });
    }
  }, [initialTemplate]);

  const handleTriggerTypeChange = (newType) => {
    setTriggerType(newType);
    if (newType === 'TimeBased') {
      setTrigger({ TimeBased: { cron: '* * * * *' } });
    } else if (newType === 'Webhook') {
      // Placeholder for Webhook default structure
      setTrigger({ Webhook: { url: '', method: 'POST', dataPath: '' } });
    } else {
      setTrigger({});
    }
  };

  const handleCronChange = (cronValue) => {
    setTrigger({ TimeBased: { ...trigger.TimeBased, cron: cronValue } });
  };

  const handleWebhookChange = (key, value) => {
    setTrigger(prevTrigger => ({
      Webhook: { ...prevTrigger.Webhook, [key]: value }
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newWorkflow = {
      name,
      trigger,
      actions: [{ [actionType]: action }], // Packaging the single action
      conditions,
    };
    try {
      await zapier_automation_backend.create_workflow(newWorkflow);
      onSuccess(); // Callback to inform parent (e.g., close form, refresh list)
    } catch (error) {
      console.error("Failed to create workflow:", error);
      // Optionally, set an error state here to display to the user
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Workflow Name */}
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
            className="themed-input w-full"
            required
          />
        </div>

        {/* Trigger Configuration Section */}
        <div className="bg-secondary text-app-color p-4 rounded-lg border-themed">
          <h3 className="text-lg font-semibold mb-3">Trigger</h3>
          <div className="mb-4">
            <label htmlFor="triggerType" className="block text-sm font-medium text-app-color mb-1">
              Trigger Type:
            </label>
            <select
              id="triggerType"
              value={triggerType}
              onChange={(e) => handleTriggerTypeChange(e.target.value)}
              className="themed-input w-full"
            >
              <option value="TimeBased">Time Based (Cron)</option>
              <option value="Webhook">Webhook</option>
              {/* <option value="OnChainEvent">On-Chain Event</option> TODO */}
            </select>
          </div>

          {triggerType === 'TimeBased' && (
            <div>
              <label htmlFor="cronExpression" className="block text-sm font-medium text-app-color mb-1">
                CRON Expression:
              </label>
              <input
                type="text"
                id="cronExpression"
                value={trigger.TimeBased?.cron || ''}
                onChange={(e) => handleCronChange(e.target.value)}
                className="themed-input w-full"
                placeholder="* * * * *"
              />
            </div>
          )}

          {triggerType === 'Webhook' && (
            <div className="space-y-3">
              <p className="text-sm opacity-75 mb-2">Configure your webhook trigger.</p>
              <div>
                <label htmlFor="webhookUrl" className="block text-sm font-medium text-app-color mb-1">Webhook URL:</label>
                <input type="text" id="webhookUrl" value={trigger.Webhook?.url || ''} onChange={(e) => handleWebhookChange('url', e.target.value)} placeholder="https://example.com/webhook" className="themed-input w-full" />
              </div>
              <div>
                <label htmlFor="webhookDataPath" className="block text-sm font-medium text-app-color mb-1">Data Path (Optional, e.g., `result.data`):</label>
                <input type="text" id="webhookDataPath" value={trigger.Webhook?.dataPath || ''} onChange={(e) => handleWebhookChange('dataPath', e.target.value)} placeholder="result.data" className="themed-input w-full" />
              </div>
              {/* Placeholder for other webhook configs like method, filters, etc. */}
            </div>
          )}
        </div>

        {/* Actions Configuration Section */}
        <div className="bg-secondary text-app-color p-4 rounded-lg border-themed">
          <h3 className="text-lg font-semibold mb-3">Action</h3> {/* Changed from Action(s) as only one is supported for now */}
          <div>
            <label htmlFor="actionType" className="block text-sm font-medium text-app-color mb-1">
              Action Type:
            </label>
            <select
              id="actionType"
              value={actionType}
              onChange={(e) => {
                setActionType(e.target.value);
                setAction({}); // Reset action config when type changes
              }}
              className="themed-input w-full"
            >
              <option value="MintNft">Mint NFT</option>
              <option value="SendEmail">Send Email</option>
              {/* <option value="NotifyUser">Notify User</option> TODO */}
            </select>
          </div>

          {/* Conditional Action Configuration Components */}
          {actionType === 'MintNft' && (
            <div className="mt-4 p-4 border-themed rounded-md bg-card"> {/* Inner card for specific config */}
              <Web3ActionConfig action={action} onChange={setAction} />
            </div>
          )}
          {actionType === 'SendEmail' && (
            <div className="mt-4 p-4 border-themed rounded-md bg-card space-y-3">
               <h4 className="text-md font-semibold mb-2">Configure Email</h4>
              <div>
                <label htmlFor="emailTo" className="block text-sm font-medium text-app-color mb-1">To:</label>
                <input type="email" id="emailTo" value={action.to || ''} onChange={e => setAction({...action, to: e.target.value})} className="themed-input w-full" placeholder="recipient@example.com" />
              </div>
              <div>
                <label htmlFor="emailSubject" className="block text-sm font-medium text-app-color mb-1">Subject:</label>
                <input type="text" id="emailSubject" value={action.subject || ''} onChange={e => setAction({...action, subject: e.target.value})} className="themed-input w-full" placeholder="Hello from your Workflow!" />
              </div>
              <div>
                <label htmlFor="emailBody" className="block text-sm font-medium text-app-color mb-1">Body:</label>
                <textarea id="emailBody" value={action.body || ''} onChange={e => setAction({...action, body: e.target.value})} className="themed-input w-full" rows="3" placeholder="Enter email content here..."></textarea>
              </div>
            </div>
          )}
          {/* Add other action configurations here */}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
            {typeof onCancel === 'function' && (
                 <button
                    type="button"
                    onClick={onCancel}
                    className="themed-button bg-secondary text-app-color hover:opacity-80 px-4 py-2 rounded"
                  >
                Cancel
              </button>
            )}
            <button
              type="submit"
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
