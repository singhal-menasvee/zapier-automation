// src/zapier-automation-frontend/src/components/TemplateSection.jsx
import React from 'react';
import { templates } from './templates'; // Assuming path is correct based on file structure

const TemplateSection = ({ onSelectTemplate }) => {
  return (
    <div> {/* Simple container for template cards section */}
      <h2 className="text-2xl font-semibold mb-6 text-app-color">Start from a Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <div
            key={index}
            className="bg-card text-app-color p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out"
            onClick={() => onSelectTemplate(template)}
          >
            <h3 className="text-xl font-bold mb-2">{template.name}</h3>
            <p className="opacity-80 text-sm">{template.description}</p> {/* Made description text slightly smaller and more muted */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSection;
