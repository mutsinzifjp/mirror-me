import React, { useState, useEffect } from 'react';
import { feedbackQuestions } from '../data/traits';

const FeedbackPortal = () => {
  const [sessionData, setSessionData] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Extract session ID from URL
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const sessionId = pathParts[pathParts.length - 1];
    
    // In a real app, this would fetch session data from server
    // For now, we'll simulate it
    setTimeout(() => {
      setSessionData({
        sessionId,
        personName: "someone", // Would be fetched from server
        isAnonymous: true
      });
      setLoading(false);
    }, 1000);
  }, []);

  const sections = [
    {
      key: 'relational_perspective',
      title: 'How They Relate',
      description: 'Share your observations about how this person shows up in relationships and interactions.',
      questions: feedbackQuestions.relational_perspective
    },
    {
      key: 'impact_awareness', 
      title: 'Their Impact',
      description: 'Reflect on the influence and effect this person has on you and others.',
      questions: feedbackQuestions.impact_awareness
    }
  ];

  const currentSectionData = sections[currentSection];

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const getCompletedInSection = (sectionIndex) => {
    const sectionQuestions = sections[sectionIndex].questions;
    return sectionQuestions.filter(q => responses[q.id] && responses[q.id].trim()).length;
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = () => {
    // In a real app, this would send responses to server
    console.log('Submitting feedback:', responses);
    setIsSubmitted(true);
  };

  if (loading) {
    return (
      <div className="feedback-portal loading">
        <div className="loading-container">
          <h2>Loading feedback form...</h2>
          <p>Preparing your reflection space.</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="feedback-portal submitted">
        <div className="success-container">
          <h2>Thank you for your thoughtful reflection</h2>
          <p>
            Your insights have been shared anonymously and will contribute to 
            {sessionData?.isAnonymous ? " someone's" : ` ${sessionData?.personName}'s`} journey 
            of self-discovery.
          </p>
          <div className="impact-note">
            <h3>The Gift of Perspective</h3>
            <p>
              By taking time to reflect thoughtfully on another person, you've offered 
              one of the most valuable gifts - authentic feedback that can illuminate 
              blind spots and affirm hidden strengths.
            </p>
          </div>
          <button 
            className="primary-action"
            onClick={() => window.close()}
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-portal">
      <div className="portal-header">
        <h1>Reflection on Another</h1>
        <p className="portal-subtitle">
          {sessionData?.isAnonymous 
            ? "Someone has invited your perspective on who they are"
            : `${sessionData?.personName} has invited your perspective on who they are`
          }
        </p>
      </div>

      <div className="philosophical-context">
        <blockquote>
          "We are all mirrors to one another - reflecting back aspects of 
          identity that might otherwise remain hidden in the shadows of self-perception."
        </blockquote>
        <p className="context-explanation">
          Your honest, compassionate observations offer a unique window into how this person 
          affects and influences others. This isn't about judgment, but about authentic witness 
          to their impact and presence in the world.
        </p>
      </div>

      <div className="section-progress">
        {sections.map((section, index) => (
          <div 
            key={section.key}
            className={`progress-step ${currentSection === index ? 'active' : ''} ${getCompletedInSection(index) > 0 ? 'completed' : ''}`}
          >
            <div className="step-indicator">
              <span className="step-number">{index + 1}</span>
              <span className="completion-count">{getCompletedInSection(index)}</span>
            </div>
            <span className="step-label">{section.title}</span>
          </div>
        ))}
      </div>

      <div className="feedback-content">
        <div className="section-intro">
          <h2>{currentSectionData.title}</h2>
          <p className="section-description">{currentSectionData.description}</p>
        </div>

        <div className="questions-container">
          {currentSectionData.questions.map((question, index) => (
            <div key={question.id} className="question-card">
              <div className="question-header">
                <span className="question-number">{index + 1}</span>
                <div className="question-content">
                  <h3 className="question-text">{question.question}</h3>
                  <p className="question-context">{question.context}</p>
                </div>
              </div>
              
              <div className="response-area">
                <textarea
                  value={responses[question.id] || ''}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  placeholder={question.placeholder}
                  rows={6}
                  className="response-textarea"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="feedback-navigation">
        <div className="nav-buttons">
          {currentSection > 0 && (
            <button className="secondary-action" onClick={handleBack}>
              Previous Section
            </button>
          )}
          
          <div className="completion-summary">
            <span className="response-count">
              {Object.values(responses).filter(r => r && r.trim()).length} questions answered
            </span>
          </div>

          <button 
            className="primary-action" 
            onClick={handleNext}
          >
            {currentSection === sections.length - 1 ? 'Submit Feedback' : 'Next Section'}
          </button>
        </div>
        
        <div className="privacy-reminder">
          <p>
            <strong>Privacy:</strong> Your responses are completely anonymous. 
            The person will see your insights but not your identity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPortal;
