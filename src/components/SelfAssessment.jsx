import React, { useState } from 'react';
import { reflectionQuestions, theoreticalFrameworks } from '../data/traits';
import { PhilosophicalCompass, IdentityConstellation, UnconsciosPattern } from './PhilosophicalVisuals';

const SelfAssessment = ({ onComplete, selectedResponses = [] }) => {
  const [currentSection, setCurrentSection] = useState('relational_contexts');
  const [responses, setResponses] = useState({});

  const sections = [
    {
      key: 'relational_contexts',
      title: 'How You Relate',
      subtitle: 'Your patterns of connection and interaction',
      description: 'These questions explore how your authentic self emerges through various forms of human connection.',
      framework: 'buber',
      visual: IdentityConstellation
    },
    {
      key: 'philosophical_orientations',
      title: 'Your Inner Compass',
      subtitle: 'Core values and life philosophy',
      description: 'These questions explore your relationship with meaning, suffering, and what matters most to you.',
      framework: 'existential',
      visual: PhilosophicalCompass
    },
    {
      key: 'unconscious_patterns',
      title: 'Hidden Patterns',
      subtitle: 'What emerges without conscious intention',
      description: 'These questions invite you to explore patterns that others might notice more easily than you do.',
      framework: 'lacan',
      visual: UnconsciosPattern
    }
  ];

  const currentSectionData = sections.find(s => s.key === currentSection);
  const currentQuestions = reflectionQuestions[currentSection]?.questions || [];
  const SectionVisual = currentSectionData.visual;

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const getCompletedQuestionsInSection = (sectionKey) => {
    const sectionQuestions = reflectionQuestions[sectionKey]?.questions || [];
    return sectionQuestions.filter(q => responses[q.id] && responses[q.id].trim()).length;
  };

  const handleNext = () => {
    const sectionIndex = sections.findIndex(s => s.key === currentSection);
    if (sectionIndex < sections.length - 1) {
      setCurrentSection(sections[sectionIndex + 1].key);
    } else {
      // Convert responses to format expected by other components
      const formattedResponses = Object.entries(responses).map(([questionId, response]) => {
        const allQuestions = Object.values(reflectionQuestions).flatMap(section => section.questions);
        const question = allQuestions.find(q => q.id === questionId);
        return {
          questionId,
          question: question?.question || '',
          response,
          category: currentSection
        };
      });
      onComplete(formattedResponses);
    }
  };

  const handleBack = () => {
    const sectionIndex = sections.findIndex(s => s.key === currentSection);
    if (sectionIndex > 0) {
      setCurrentSection(sections[sectionIndex - 1].key);
    }
  };

  const isLastSection = sections.findIndex(s => s.key === currentSection) === sections.length - 1;
  const hasMinimumResponses = Object.values(responses).filter(r => r && r.trim()).length >= 3;

  return (
    <div className="self-assessment">
      <div className="assessment-header">
        <div className="section-progress">
          {sections.map((section, index) => (
            <div 
              key={section.key}
              className={`progress-step ${currentSection === section.key ? 'active' : ''} ${getCompletedQuestionsInSection(section.key) > 0 ? 'completed' : ''}`}
              onClick={() => setCurrentSection(section.key)}
            >
              <div className="step-indicator">
                <span className="step-number">{index + 1}</span>
                <span className="selection-count">{getCompletedQuestionsInSection(section.key)}</span>
              </div>
              <span className="step-label">{section.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="assessment-content">
        <div className="section-intro">
          <div className="section-visual">
            <SectionVisual size={100} />
          </div>
          <div className="section-text">
            <h2>{currentSectionData.title}</h2>
            <p className="section-subtitle">{currentSectionData.subtitle}</p>
            <p className="section-description">{currentSectionData.description}</p>
          </div>
        </div>

        <div className="questions-container">
          {currentQuestions.map((question, index) => (
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
                  placeholder="Take your time to reflect deeply on this question..."
                  rows={6}
                  className="response-textarea"
                />
              </div>
              
              <div className="reflection-note">
                <strong>Reflection prompt:</strong> {question.reflection}
              </div>
            </div>
          ))}
        </div>

        <div className="theoretical-context">
          <h3>Theoretical Context</h3>
          <p>{theoreticalFrameworks[currentSectionData.framework]?.description || 'Exploring the complexity of human identity across contexts.'}</p>
        </div>
      </div>

      <div className="assessment-navigation">
        <div className="nav-buttons">
          {currentSection !== 'relational_contexts' && (
            <button className="secondary-action" onClick={handleBack}>
              Previous Section
            </button>
          )}
          
          <div className="completion-summary">
            <span className="response-count">
              {Object.values(responses).filter(r => r && r.trim()).length} questions answered
            </span>
            <span className="section-count">
              {getCompletedQuestionsInSection(currentSection)} in this section
            </span>
          </div>

          <button 
            className="primary-action" 
            onClick={handleNext}
            disabled={!isLastSection && getCompletedQuestionsInSection(currentSection) === 0}
          >
            {isLastSection ? (hasMinimumResponses ? 'Complete Reflection' : 'Complete with current responses') : 'Next Section'}
          </button>
        </div>
        
        {isLastSection && !hasMinimumResponses && (
          <p className="completion-note">
            Consider answering at least 3 questions across all sections for richer insights, 
            though you can proceed with your current responses.
          </p>
        )}
      </div>
    </div>
  );
};

export default SelfAssessment;
