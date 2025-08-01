import React from 'react';
import { theoreticalFrameworks } from '../data/traits';
import { JohariGrid } from './PhilosophicalVisuals';

const JohariWindow = ({ selfResponses, feedbackResponses, onViewInsights }) => {
  // Analyze responses to create meaningful insights instead of simple trait matching
  const analyzeResponses = () => {
    // Create philosophical insights rather than simple matches
    return {
      openSelf: "Authentic qualities recognized by both you and others",
      blindSpot: "Impacts and influences you may not fully see",
      hiddenSelf: "Private depths and unexpressed potentials", 
      unknownSelf: "Undiscovered aspects awaiting emergence"
    };
  };

  const insights = analyzeResponses();

  return (
    <div className="johari-window">
      <div className="johari-header">
        <JohariGrid />
        <h2>The Johari Window</h2>
        <p>A philosophical lens for understanding the landscape of self-knowledge and interpersonal awareness</p>
      </div>
      
      <div className="johari-grid">
        <div className="quadrant open-self">
          <h3>Open Self</h3>
          <p>{insights.openSelf}</p>
          <div className="insights">
            {selfResponses.slice(0, 2).map((response, index) => (
              <div key={index} className="insight-item">
                <p className="question-context">{response.question}</p>
                <p className="reflection-excerpt">{response.response.slice(0, 80)}...</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="quadrant blind-spot">
          <h3>Blind Spot</h3>
          <p>{insights.blindSpot}</p>
          <div className="insights">
            {feedbackResponses.slice(0, 2).map((response, index) => (
              <div key={index} className="insight-item">
                <p className="question-context">{response.question}</p>
                <p className="reflection-excerpt">{response.response.slice(0, 80)}...</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="quadrant hidden-self">
          <h3>Hidden Self</h3>
          <p>{insights.hiddenSelf}</p>
          <div className="insights">
            {selfResponses.slice(2, 4).map((response, index) => (
              <div key={index} className="insight-item">
                <p className="question-context">{response.question}</p>
                <p className="reflection-excerpt">{response.response.slice(0, 80)}...</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="quadrant unknown-self">
          <h3>Unknown Self</h3>
          <p>{insights.unknownSelf}</p>
          <div className="philosophical-context">
            <p>This realm represents the undiscovered potential that emerges through continuous self-exploration and meaningful encounters with others.</p>
          </div>
        </div>
      </div>
      
      <div className="theoretical-context">
        <h4>Theoretical Foundation</h4>
        <p>{theoreticalFrameworks.johari.description}</p>
        <blockquote>"{theoreticalFrameworks.johari.insight}"</blockquote>
      </div>
      
      <button className="insights-button" onClick={onViewInsights}>
        Explore Deeper Insights
      </button>
    </div>
  );
};

export default JohariWindow;
