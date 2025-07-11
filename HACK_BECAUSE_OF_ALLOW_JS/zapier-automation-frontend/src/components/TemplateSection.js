import React from 'react';
import { predefinedWorkflowTemplates, WorkflowTemplate } from '../templates'; // Adjust path if templates.ts is in a different location
const TemplateSection = () => {
    return (<div className="container-fluid py-4 bg-dark text-white">
      <h2 className="h3 fw-bold mb-4">Workflow Templates</h2>
      <p className="text-secondary mb-4">
        Browse and select from our predefined workflow templates to get started quickly.
      </p>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {predefinedWorkflowTemplates.map((template) => (<div className="col" key={template.id}>
            <div className="card h-100 bg-secondary border-0 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-white mb-2">{template.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted small">{template.category}</h6>
                <p className="card-text text-light flex-grow-1">{template.description}</p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {template.tags && template.tags.map((tag, index) => (<span key={index} className="badge bg-info text-dark rounded-pill">
                      {tag}
                    </span>))}
                </div>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    {template.isPublished ? 'Published' : 'Draft'}
                  </small>
                  <button className="btn btn-primary btn-sm">
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          </div>))}
      </div>

      {predefinedWorkflowTemplates.length === 0 && (<div className="alert alert-info mt-4" role="alert">
          No templates available yet. Check back soon!
        </div>)}
    </div>);
};
export default TemplateSection;
