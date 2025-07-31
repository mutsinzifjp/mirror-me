import React from 'react';

// Philosophical Visual Components - No emojis, pure geometric meaning

export const MirrorSymbol = ({ size = 60, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={`mirror-symbol ${className}`}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Mirror reflection concept */}
    <circle 
      cx="50" 
      cy="50" 
      r="35" 
      stroke="var(--sage-blue)" 
      strokeWidth="3"
      fill="none"
    />
    <circle 
      cx="50" 
      cy="50" 
      r="25" 
      stroke="var(--reflection-lavender)" 
      strokeWidth="2"
      fill="rgba(155, 89, 182, 0.1)"
    />
    <line 
      x1="15" 
      y1="85" 
      x2="85" 
      y2="15" 
      stroke="var(--insight-gold)" 
      strokeWidth="2"
      strokeDasharray="5,5"
    />
    <text 
      x="50" 
      y="55" 
      textAnchor="middle" 
      fontSize="12" 
      fill="var(--deep-charcoal)"
      fontFamily="var(--font-display)"
    >
      I ↔ Thou
    </text>
  </svg>
);

export const JohariGrid = ({ size = 100, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={`johari-grid ${className}`}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Johari Window quadrants */}
    <rect width="100" height="100" fill="var(--gentle-gray)" stroke="var(--subtle-border)" strokeWidth="1"/>
    
    {/* Quadrant divisions */}
    <line x1="50" y1="0" x2="50" y2="100" stroke="var(--sage-blue)" strokeWidth="2"/>
    <line x1="0" y1="50" x2="100" y2="50" stroke="var(--sage-blue)" strokeWidth="2"/>
    
    {/* Quadrant fills with meaning */}
    <rect x="0" y="0" width="50" height="50" fill="var(--recognition-teal)" fillOpacity="0.2"/>
    <rect x="50" y="0" width="50" height="50" fill="var(--insight-gold)" fillOpacity="0.2"/>
    <rect x="0" y="50" width="50" height="50" fill="var(--reflection-lavender)" fillOpacity="0.2"/>
    <rect x="50" y="50" width="50" height="50" fill="var(--warm-gray)" fillOpacity="0.2"/>
    
    {/* Center point - the meeting of perspectives */}
    <circle cx="50" cy="50" r="3" fill="var(--deep-charcoal)"/>
  </svg>
);

export const IdentityConstellation = ({ size = 80, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={`identity-constellation ${className}`}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Representing the complexity of identity as interconnected points */}
    <circle cx="50" cy="20" r="4" fill="var(--recognition-teal)"/>
    <circle cx="25" cy="40" r="3" fill="var(--insight-gold)"/>
    <circle cx="75" cy="35" r="3" fill="var(--reflection-lavender)"/>
    <circle cx="30" cy="70" r="4" fill="var(--sage-blue)"/>
    <circle cx="70" cy="75" r="3" fill="var(--warm-gray)"/>
    <circle cx="50" cy="50" r="5" fill="var(--deep-charcoal)"/>
    
    {/* Connecting lines showing interrelation */}
    <line x1="50" y1="20" x2="50" y2="50" stroke="var(--subtle-border)" strokeWidth="1"/>
    <line x1="25" y1="40" x2="50" y2="50" stroke="var(--subtle-border)" strokeWidth="1"/>
    <line x1="75" y1="35" x2="50" y2="50" stroke="var(--subtle-border)" strokeWidth="1"/>
    <line x1="30" y1="70" x2="50" y2="50" stroke="var(--subtle-border)" strokeWidth="1"/>
    <line x1="70" y1="75" x2="50" y2="50" stroke="var(--subtle-border)" strokeWidth="1"/>
    
    {/* Outer circle representing wholeness */}
    <circle cx="50" cy="50" r="40" stroke="var(--sage-blue)" strokeWidth="1" strokeDasharray="3,3" fillOpacity="0"/>
  </svg>
);

export const ReflectionWaves = ({ size = 120, className = "" }) => (
  <svg 
    width={size} 
    height={size/2} 
    viewBox="0 0 120 60" 
    className={`reflection-waves ${className}`}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Representing the dynamic nature of self-reflection */}
    <path 
      d="M0,30 Q30,10 60,30 T120,30" 
      stroke="var(--sage-blue)" 
      strokeWidth="2" 
      fill="none"
    />
    <path 
      d="M0,35 Q30,15 60,35 T120,35" 
      stroke="var(--recognition-teal)" 
      strokeWidth="1.5" 
      fill="none"
      opacity="0.7"
    />
    <path 
      d="M0,25 Q30,5 60,25 T120,25" 
      stroke="var(--reflection-lavender)" 
      strokeWidth="1" 
      fill="none"
      opacity="0.5"
    />
  </svg>
);

export const PhilosophicalCompass = ({ size = 90, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={`philosophical-compass ${className}`}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Representing inner compass and direction */}
    <circle cx="50" cy="50" r="45" stroke="var(--sage-blue)" strokeWidth="2"/>
    <circle cx="50" cy="50" r="35" stroke="var(--subtle-border)" strokeWidth="1"/>
    <circle cx="50" cy="50" r="25" stroke="var(--subtle-border)" strokeWidth="1"/>
    
    {/* Cardinal directions representing core orientations */}
    <line x1="50" y1="5" x2="50" y2="25" stroke="var(--deep-charcoal)" strokeWidth="3"/>
    <line x1="95" y1="50" x2="75" y2="50" stroke="var(--warm-gray)" strokeWidth="2"/>
    <line x1="50" y1="95" x2="50" y2="75" stroke="var(--warm-gray)" strokeWidth="2"/>
    <line x1="5" y1="50" x2="25" y2="50" stroke="var(--warm-gray)" strokeWidth="2"/>
    
    {/* Center point - the authentic self */}
    <circle cx="50" cy="50" r="6" fill="var(--insight-gold)"/>
    <circle cx="50" cy="50" r="3" fill="var(--deep-charcoal)"/>
    
    {/* Direction indicator */}
    <polygon 
      points="50,15 55,25 45,25" 
      fill="var(--deep-charcoal)"
    />
  </svg>
);

export const UnconsciosPattern = ({ size = 70, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={`unconscious-pattern ${className}`}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Representing hidden patterns and unconscious aspects */}
    <circle cx="50" cy="50" r="40" stroke="var(--sage-blue)" strokeWidth="2" strokeDasharray="8,4"/>
    
    {/* Visible portion */}
    <path 
      d="M50,10 A40,40 0 0,1 90,50 L50,50 Z" 
      fill="var(--recognition-teal)" 
      fillOpacity="0.3"
    />
    
    {/* Hidden portion */}
    <path 
      d="M50,50 A40,40 0 0,1 10,50 A40,40 0 0,1 50,10 Z" 
      fill="var(--reflection-lavender)" 
      fillOpacity="0.1"
      stroke="var(--reflection-lavender)" 
      strokeWidth="1"
      strokeDasharray="3,3"
    />
    
    {/* Question mark for unknown */}
    <text 
      x="30" 
      y="35" 
      textAnchor="middle" 
      fontSize="20" 
      fill="var(--reflection-lavender)"
      fontFamily="var(--font-display)"
      opacity="0.6"
    >
      ?
    </text>
    
    {/* Center awareness point */}
    <circle cx="50" cy="50" r="4" fill="var(--deep-charcoal)"/>
  </svg>
);

export default {
  MirrorSymbol,
  JohariGrid,
  IdentityConstellation,
  ReflectionWaves,
  PhilosophicalCompass,
  UnconsciosPattern
};
