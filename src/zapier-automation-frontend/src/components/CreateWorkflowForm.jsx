import React, { useState } from 'react';
import { zapier_automation_backend } from '../../../declarations/zapier-automation-backend';
import { Web3ActionConfig } from './actions/Web3ActionConfig';


const CreateWorkflowForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [triggerType, setTriggerType] = useState('TimeBased');
  const [actionType, setActionType] = useState('MintNft');
const [action, setAction] = useState({ type: 'MintNft' });


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newWorkflow = {
      name,
      trigger: { [triggerType]: {} }, // Dynamic trigger assignment
      actions: [],
      conditions: []
    };
    await zapier_automation_backend.create_workflow(newWorkflow);
    onSuccess(); // Refresh dashboard
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg">
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Workflow name"
        className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
      />
      <div className="mb-4">
  <label className="block text-white mb-1">Action Type:</label>
  <select
    value={actionType}
    onChange={(e) => {
      const type = e.target.value;
      setActionType(type);
      setAction({ type }); // Reset action config when type changes
    }}
    className="w-full p-2 bg-gray-700 text-white rounded"
  >
    <option value="MintNft">Mint NFT</option>
    <option value="SendEmail">Send Email</option>
    {/* Add more as you go */}
  </select>
  {actionType === 'MintNft' && (
  <Web3ActionConfig action={action} onChange={setAction} />
)}

  
  

</div>

      {/* Trigger selector will be added here */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Workflow
      </button>
    </form>
  );
};

export default CreateWorkflowForm;