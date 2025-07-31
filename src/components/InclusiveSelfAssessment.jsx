import React, { useState } from 'react';
import InclusiveResponseInput from './InclusiveResponseInput';
import EmotionalIntelligenceEngine from '../services/EmotionalIntelligenceEngine';
import { reflectionQuestions, theoreticalFrameworks } from '../data/traits';
import { PhilosophicalCompass, IdentityConstellation, UnconsciosPattern } from './PhilosophicalVisuals';

/**
 * Inclusive Self Assessment - A dignity-centered approach to self-reflection
 * Designed to support users regardless of language fluency, emotional state, or expression style
 */
const InclusiveSelfAssessment = ({ onComplete, selectedResponses = [] }) => {
  const [currentSection, setCurrentSection] = useState('relational_contexts');
  const [responses, setResponses] = useState({});
  const [emotionalAnalyses, setEmotionalAnalyses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSectionOverview, setShowSectionOverview] = useState(true);
  const [inclusivityMode, setInclusivityMode] = useState('full'); // full, simplified, minimal

  const emotionEngine = new EmotionalIntelligenceEngine();

  const sections = [
    {
      key: 'relational_contexts',
      title: 'How You Connect',
      subtitle: 'Your ways of being with others',
      description: 'These questions explore how you show up in relationships and community.',
      framework: 'buber',
      visual: IdentityConstellation,
      accessibleDescription: 'Questions about friendship, family, work relationships, and how you feel most yourself with others.'
    },
    {
      key: 'philosophical_orientations', 
      title: 'What Matters to You',
      subtitle: 'Your values and life compass',
      description: 'These questions explore what gives your life meaning and purpose.',
      framework: 'existential',
      visual: PhilosophicalCompass,
      accessibleDescription: 'Questions about what you care about, what motivates you, and how you make important decisions.'
    },
    {
      key: 'unconscious_patterns',
      title: 'Hidden Strengths',
      subtitle: 'What others see in you',
      description: 'These questions invite you to explore patterns that others might notice more than you do.',
      framework: 'lacan', 
      visual: UnconsciosPattern,
      accessibleDescription: 'Questions about feedback you receive, recurring themes in your life, and patterns in how you affect others.'
    }
  ];

  const inclusivityModes = {
    full: {
      name: 'Full Experience',
      description: 'All input options and emotional intelligence features',
      supportLanguages: true,
      showEmotionWheel: true,
      showGuidedInput: true,
      questionContext: 'full'
    },
    simplified: {
      name: 'Simplified',
      description: 'Clear language, essential features only',
      supportLanguages: true,
      showEmotionWheel: true,
      showGuidedInput: false,
      questionContext: 'simplified'
    },
    minimal: {
      name: 'Essential',
      description: 'Basic input with quick response options',
      supportLanguages: false,
      showEmotionWheel: false,
      showGuidedInput: false,
      questionContext: 'minimal'
    }
  };

  const currentSectionData = sections.find(s => s.key === currentSection);
  const currentQuestions = reflectionQuestions[currentSection]?.questions || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const SectionVisual = currentSectionData.visual;

  const handleResponseSubmit = (responseData) => {
    const questionId = currentQuestion.id;
    
    // Store the response
    setResponses(prev => ({
      ...prev,
      [questionId]: responseData.response
    }));

    // Store emotional analysis
    setEmotionalAnalyses(prev => ({
      ...prev,
      [questionId]: responseData.analysis
    }));

    // Move to next question or section
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      moveToNextSection();
    }
  };

  const moveToNextSection = () => {
    const sectionIndex = sections.findIndex(s => s.key === currentSection);
    if (sectionIndex < sections.length - 1) {
      setCurrentSection(sections[sectionIndex + 1].key);
      setCurrentQuestionIndex(0);
      setShowSectionOverview(true);
    } else {
      completeAssessment();
    }
  };

  const completeAssessment = () => {
    // Compile comprehensive results
    const formattedResponses = Object.entries(responses).map(([questionId, response]) => {
      const allQuestions = Object.values(reflectionQuestions).flatMap(section => section.questions);
      const question = allQuestions.find(q => q.id === questionId);
      const analysis = emotionalAnalyses[questionId];
      
      return {
        questionId,
        question: question?.question || '',
        response,
        analysis,
        category: question?.category || 'unknown',
        metadata: {
          inclusivityMode,
          emotionalIntelligence: analysis ? {
            emotionalState: analysis.emotionalState,
            insights: analysis.insights,
            encouragement: analysis.encouragement
          } : null
        }
      };
    });

    // Generate overall emotional intelligence summary
    const overallAnalysis = emotionEngine.synthesizeEmotionalJourney(Object.values(emotionalAnalyses));

    onComplete({
      responses: formattedResponses,
      emotionalJourney: overallAnalysis,
      inclusivityMode,
      metadata: {
        totalTime: Date.now() - startTime,
        questionTypes: Object.values(emotionalAnalyses).map(a => a.responseType),
        emotionalRange: overallAnalysis.emotionalRange,
        supportUsed: Object.values(emotionalAnalyses).map(a => a.supportFeatures).flat()
      }
    });
  };

  const [startTime] = useState(Date.now());

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      const sectionIndex = sections.findIndex(s => s.key === currentSection);
      if (sectionIndex > 0) {
        setCurrentSection(sections[sectionIndex - 1].key);
        const prevQuestions = reflectionQuestions[sections[sectionIndex - 1].key]?.questions || [];
        setCurrentQuestionIndex(prevQuestions.length - 1);
      }
    }
  };

  const skipCurrentQuestion = () => {
    // Record that question was intentionally skipped
    const questionId = currentQuestion.id;
    const skipAnalysis = emotionEngine.interpretSilence('intentional_skip', {
      context: currentQuestion.question,
      timeSpent: 0
    });

    setResponses(prev => ({
      ...prev,
      [questionId]: '[Skipped - choosing not to answer]'
    }));

    setEmotionalAnalyses(prev => ({
      ...prev,
      [questionId]: skipAnalysis
    }));

    // Move to next question
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      moveToNextSection();
    }
  };

  const getProgressPercentage = () => {
    const totalQuestions = sections.reduce((total, section) => {
      return total + (reflectionQuestions[section.key]?.questions.length || 0);
    }, 0);
    
    const completedQuestions = Object.keys(responses).length;
    return Math.round((completedQuestions / totalQuestions) * 100);
  };

  const getCurrentQuestionNumber = () => {
    let questionNumber = 0;
    for (const section of sections) {
      if (section.key === currentSection) {
        return questionNumber + currentQuestionIndex + 1;
      }
      questionNumber += reflectionQuestions[section.key]?.questions.length || 0;
    }
    return questionNumber;
  };

  const getTotalQuestions = () => {
    return sections.reduce((total, section) => {
      return total + (reflectionQuestions[section.key]?.questions.length || 0);
    }, 0);
  };

  // Section Overview Screen
  if (showSectionOverview) {
    return (
      <div className="inclusive-self-assessment">
        <div className="assessment-header">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <p className="progress-text">
            {getProgressPercentage()}% Complete • {Object.keys(responses).length} responses shared
          </p>
        </div>

        <div className="section-overview">
          <div className="section-visual">
            {SectionVisual && <SectionVisual />}
          </div>
          
          <div className="section-info">
            <h2>{currentSectionData.title}</h2>
            <p className="section-subtitle">{currentSectionData.subtitle}</p>
            
            {inclusivityMode === 'minimal' ? (
              <p className="section-description">{currentSectionData.accessibleDescription}</p>
            ) : (
              <p className="section-description">{currentSectionData.description}</p>
            )}

            <div className="section-stats">
              <div className="stat">
                <span className="stat-number">{currentQuestions.length}</span>
                <span className="stat-label">Questions</span>
              </div>
              <div className="stat">
                <span className="stat-number">~5min</span>
                <span className="stat-label">Estimated time</span>
              </div>
              <div className="stat">
                <span className="stat-number">Any</span>
                <span className="stat-label">Length response</span>
              </div>
            </div>

            <div className="section-encouragement">
              <p>💫 <strong>Remember:</strong> There are no wrong answers. Share whatever feels true to you right now.</p>
              <p>You can express yourself through words, emotions, quick selections, or any combination that feels right.</p>
            </div>

            <div className="section-actions">
              <button 
                className="start-section-btn"
                onClick={() => setShowSectionOverview(false)}
              >
                Begin "{currentSectionData.title}"
              </button>
              
              {Object.keys(responses).length > 0 && (
                <button 
                  className="skip-section-btn"
                  onClick={moveToNextSection}
                >
                  Skip this section
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Inclusivity Mode Selector */}
        <div className="inclusivity-controls">
          <h4>Adjust for your needs:</h4>
          <div className="mode-selector">
            {Object.entries(inclusivityModes).map(([modeKey, mode]) => (
              <button
                key={modeKey}
                className={`mode-option ${inclusivityMode === modeKey ? 'active' : ''}`}
                onClick={() => setInclusivityMode(modeKey)}
              >
                <span className="mode-name">{mode.name}</span>
                <span className="mode-description">{mode.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Question Screen
  return (
    <div className="inclusive-self-assessment">
      <div className="assessment-header">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <p className="progress-text">
          Question {getCurrentQuestionNumber()} of {getTotalQuestions()} • {currentSectionData.title}
        </p>
      </div>

      <div className="question-container">
        <div className="question-section">
          <h3 className="question-text">
            {inclusivityMode === 'minimal' 
              ? currentQuestion.simplified || currentQuestion.question
              : currentQuestion.question
            }
          </h3>
          
          {inclusivityMode !== 'minimal' && currentQuestion.context && (
            <p className="question-context">{currentQuestion.context}</p>
          )}

          {inclusivityMode === 'full' && (
            <div className="theoretical-context">
              <details>
                <summary>Why this question matters</summary>
                <p>{theoreticalFrameworks[currentSectionData.framework]?.insight}</p>
              </details>
            </div>
          )}
        </div>

        <InclusiveResponseInput
          question={currentQuestion}
          onResponse={handleResponseSubmit}
          placeholder={
            inclusivityMode === 'minimal' 
              ? "Share whatever comes to mind..." 
              : "Take your time. Share whatever feels true, however you'd like to express it."
          }
          supportMultiLanguage={inclusivityModes[inclusivityMode].supportLanguages}
        />

        <div className="question-navigation">
          <div className="nav-left">
            <button 
              className="nav-btn secondary"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0 && sections.findIndex(s => s.key === currentSection) === 0}
            >
              ← Previous
            </button>
          </div>

          <div className="nav-center">
            <button 
              className="skip-btn"
              onClick={skipCurrentQuestion}
            >
              Skip this question
            </button>
          </div>

          <div className="nav-right">
            <button 
              className="nav-btn secondary"
              onClick={() => setShowSectionOverview(true)}
            >
              Section Overview
            </button>
          </div>
        </div>

        {/* Previous responses for context */}
        {Object.keys(responses).length > 0 && inclusivityMode === 'full' && (
          <div className="response-context">
            <details>
              <summary>Your recent responses ({Object.keys(responses).length})</summary>
              <div className="previous-responses">
                {Object.entries(responses).slice(-3).map(([qId, response]) => {
                  const analysis = emotionalAnalyses[qId];
                  return (
                    <div key={qId} className="previous-response">
                      <p className="response-text">"{response}"</p>
                      {analysis && analysis.emotionalState && (
                        <p className="response-emotion">
                          Felt: {analysis.emotionalState.dominant} ({analysis.emotionalState.intensity}/5)
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default InclusiveSelfAssessment;
