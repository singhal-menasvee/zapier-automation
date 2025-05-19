import React from 'react';
import WorkflowDashboard from './components/WorkflowDashboard';
import './index.css'; // This already includes styling like Tailwind or custom SCSS

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <WorkflowDashboard />
    </main>
  );
}

export default App;
