const WorkflowDetails = ({ workflow, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-card text-app-color p-6 rounded-lg max-w-2xl w-full"> {/* Changed bg-gray-800 to bg-card and added text-app-color */}
        <h2 className="text-2xl font-bold mb-4">{workflow.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Trigger</h3>
            {/* Changed bg-gray-700 to bg-secondary, ensured text-app-color (though pre might override) */}
            <pre className="bg-secondary text-app-color p-2 rounded text-sm">
              {JSON.stringify(workflow.trigger, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="font-semibold">Actions</h3>
            {/* Changed bg-gray-700 to bg-secondary, ensured text-app-color */}
            <pre className="bg-secondary text-app-color p-2 rounded text-sm">
              {JSON.stringify(workflow.actions, null, 2)}
            </pre>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};
export default WorkflowDetails;