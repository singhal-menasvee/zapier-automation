import React, { useState } from 'react';
import { zapier_automation_backend } from '../../../declarations/zapier-automation-backend';

const CreateWorkflowForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [triggerType, setTriggerType] = useState('TimeBased');

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
      {/* Trigger selector will be added here */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Workflow
      </button>
    </form>
  );
};

export default CreateWorkflowForm;