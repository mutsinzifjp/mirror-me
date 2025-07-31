import React from 'react';
import { MirrorSymbol } from './PhilosophicalVisuals';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <MirrorSymbol size={32} className="footer-symbol" />
          <div className="footer-text">
            <p className="footer-title">Mirror Me</p>
            <p className="footer-subtitle">Philosophical Self-Discovery</p>
          </div>
        </div>
        
        <div className="footer-info">
          <p className="footer-credits">
            Created by Fils Jean Pierre Mutsinzi
          </p>
          <p className="footer-date">
            &copy; {new Date().getFullYear()} - Journey of Self-Reflection
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
