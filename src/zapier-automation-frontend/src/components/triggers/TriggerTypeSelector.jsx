const TriggerTypeSelector = ({ type, onChange }) => {
  const renderTriggerInputs = () => {
    switch(type) {
      case 'TimeBased':
        return (
          <input 
            type="text" 
            placeholder="* * * * * (cron)" 
            className="themed-input" // Changed
          />
        );
      case 'HttpRequest':
        return (
          <div className="space-y-2">
            <input type="text" placeholder="URL" className="themed-input w-full" /> {/* Changed */}
            <select className="themed-input"> {/* Changed */}
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
        className="themed-input" // Changed
      >
        <option value="TimeBased">Schedule</option>
        <option value="HttpRequest">HTTP Request</option>
      </select>
      {renderTriggerInputs()}
    </div>
  );
};