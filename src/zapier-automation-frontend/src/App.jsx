import React from 'react';
import WorkflowDashboard from './components/WorkflowDashboard';
import './index.css'; // This already includes styling like Tailwind or custom SCSS

function App() {
  return (
    <main className="min-h-screen bg-app-background"> {/* Replaced gradient with themed background */}
      <WorkflowDashboard />
    </main>
  );
}

export default App;
