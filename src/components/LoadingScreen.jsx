import React from 'react';
import { MirrorSymbol, ReflectionWaves } from './PhilosophicalVisuals';

const LoadingScreen = ({ message = "Loading your philosophical journey..." }) => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-brand">
          <MirrorSymbol size={64} className="loading-symbol" />
          <h2 className="loading-title">Mirror Me</h2>
        </div>
        <div className="loading-spinner"></div>
        <p className="loading-message">{message}</p>
        <ReflectionWaves size={100} className="loading-waves" />
      </div>
    </div>
  );
};

export default LoadingScreen;
