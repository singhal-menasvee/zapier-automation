import React from 'react';
import '../Dashboard.css';

const WorkflowsSection = () => {
  return (
    <section className="previous-workflows-section">
      <h2 className="section-title">Previous workflows</h2>
      <div className="workflows-carousel">
        <img src="/assets/chevron.svg" alt="Previous" className="carousel-arrow arrow-left" />
        <div className="previous-workflows-cards">
          <div className="workflow-card"></div>
          <div className="workflow-card"></div>
          <div className="workflow-card"></div>
          <div className="workflow-card"></div>
        </div>
        <img src="/assets/chevron.svg" alt="Next" className="carousel-arrow arrow-right" />
      </div>
    </section>
  );
};

export default WorkflowsSection;