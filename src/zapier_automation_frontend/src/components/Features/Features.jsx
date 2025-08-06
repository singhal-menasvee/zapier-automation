import React from 'react';
import FeatureCard from './FeatureCard';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: 'blue',
      title: 'Web3-Native Triggers',
      description: 'React to on-chain events like token transfers, NFT mints, DAO proposals, and more — alongside traditional API/webhook triggers.'
    },
    {
      icon: 'purple',
      title: 'Decentralized by Design',
      description: 'Your workflows run on the Internet Computer — not someone else\'s cloud.'
    },
    {
      icon: 'green',
      title: 'Smart Workflow Builder',
      description: 'Visually build automations using modular blocks like triggers, conditions, and actions — including Web3-specific logic.'
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;