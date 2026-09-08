import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="animated-bg-container" aria-hidden="true">
      {/* Dynamic Ambient Gradient Orbs */}
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />
      <div className="ambient-orb ambient-orb-4" />

      {/* Subtle Geometric Ambient Grid Pattern */}
      <div className="ambient-grid-mesh" />

      {/* Floating Stardust Particles */}
      <div className="ambient-particles">
        <span className="particle particle-1" />
        <span className="particle particle-2" />
        <span className="particle particle-3" />
        <span className="particle particle-4" />
        <span className="particle particle-5" />
        <span className="particle particle-6" />
      </div>
    </div>
  );
};
