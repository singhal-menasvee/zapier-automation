const TriggerTypeSelector = ({ type, onChange }) => {
  const renderTriggerInputs = () => {
    switch(type) {
      case 'TimeBased':
        return (
          <input 
            type="text" 
            placeholder="* * * * * (cron)" 
            className="bg-gray-700 text-white p-2 rounded"
          />
        );
      case 'HttpRequest':
        return (
          <div className="space-y-2">
            <input type="text" placeholder="URL" className="bg-gray-700 text-white p-2 rounded w-full" />
            <select className="bg-gray-700 text-white p-2 rounded">
              <option>GET</option>
              <option>POST</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <select 
        value={type} 
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-700 text-white p-2 rounded"
      >
        <option value="TimeBased">Schedule</option>
        <option value="HttpRequest">HTTP Request</option>
      </select>
      {renderTriggerInputs()}
    </div>
  );
};