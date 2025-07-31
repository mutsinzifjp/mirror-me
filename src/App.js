import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import SelfAssessment from './components/SelfAssessment';
import InclusiveSelfAssessment from './components/InclusiveSelfAssessment';
import InviteFeedback from './components/InviteFeedback';
import JohariWindow from './components/JohariWindow';
import ReflectionInsights from './components/ReflectionInsights';
import FeedbackPortal from './components/FeedbackPortal';
import Dashboard from './components/Dashboard';
import AuthForms from './components/AuthForms';
import UserProfile from './components/UserProfile';
import { ThemeProvider } from './contexts/ThemeContext';
import { PhilosophicalDataService } from './services/DataService';
import authService from './services/AuthService';
import { philosophicalDisclaimer } from './data/traits';
import './index.css';

function App() {
  // Check if this is a feedback portal URL first, before any hooks
  const isFeedbackPortal = window.location.pathname.includes('/feedback/');
  
  if (isFeedbackPortal) {
    return <FeedbackPortal />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Main application component with hooks
function MainApp() {
  const [currentView, setCurrentView] = useState('welcome');
  const [assessmentType, setAssessmentType] = useState('inclusive'); // 'standard' or 'inclusive'
  const [selfResponses, setSelfResponses] = useState([]);
  const [feedbackResponses, setFeedbackResponses] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    isAnonymous: false,
    inviteCode: null
  });

  // Initialize data service
  const dataService = useMemo(() => new PhilosophicalDataService(), []);

  // Check authentication status on app load
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      // Automatically navigate to dashboard if user has data
      const userData = authService.getUserData('responses');
      const feedbackData = authService.getUserData('feedbacks');
      
      if (userData && userData.length > 0) {
        setSelfResponses(userData);
        // Auto-navigate to dashboard for returning users with data
        setCurrentView('dashboard');
      }
      
      if (feedbackData && feedbackData.length > 0) {
        setFeedbackResponses(feedbackData);
      }
      
      console.log('✅ User session restored automatically');
    } else {
      // No valid session, ensure we're on welcome page
      setCurrentView('welcome');
    }
  }, []);

  // Track user activity to extend session
  useEffect(() => {
    if (isAuthenticated) {
      const handleUserActivity = () => {
        // Extend session on user activity
        authService.extendSession();
      };

      // Add activity listeners
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.addEventListener(event, handleUserActivity, { passive: true });
      });

      // Cleanup listeners
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleUserActivity);
        });
      };
    }
  }, [isAuthenticated]);

  // Function to load existing data for a session
  const loadExistingData = useCallback((sessionId) => {
    // Load existing user responses
    const existingResponses = dataService.getUserResponses(sessionId);
    if (existingResponses.length > 0) {
      setSelfResponses(existingResponses);
      console.log('📥 Loaded existing user responses');
    }

    // Load existing user profile
    const existingProfile = dataService.getUserProfile(sessionId);
    if (existingProfile && existingProfile.name) {
      setUserProfile(existingProfile);
      console.log('📥 Loaded existing user profile');
    }

    // Load existing feedback
    const existingFeedback = dataService.getFeedbackResponses(sessionId);
    if (existingFeedback.length > 0) {
      setFeedbackResponses(existingFeedback);
      console.log('📥 Loaded existing feedback responses');
    }
  }, [dataService]);

  // Generate unique session ID and load existing data
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      setSessionId(newSessionId);
      
      // Load any existing data for this session (if not logged in)
      if (!isAuthenticated) {
        loadExistingData(newSessionId);
      }
    }
  }, [isAuthenticated, sessionId, loadExistingData]);

  // Save data whenever it changes
  useEffect(() => {
    if (sessionId && selfResponses.length > 0) {
      dataService.saveUserResponses(sessionId, selfResponses);
      console.log('✅ Saved user responses to localStorage');
    }
  }, [selfResponses, sessionId, dataService]);

  useEffect(() => {
    if (sessionId && userProfile.name) {
      dataService.saveUserProfile(sessionId, userProfile);
      console.log('✅ Saved user profile to localStorage');
    }
  }, [userProfile, sessionId, dataService]);

  useEffect(() => {
    if (sessionId && feedbackResponses.length > 0) {
      // Save each feedback response
      feedbackResponses.forEach(feedback => {
        if (!feedback.saved) {
          dataService.saveFeedbackResponse(sessionId, { ...feedback, saved: true });
        }
      });
      console.log('✅ Saved feedback responses to localStorage');
    }
  }, [feedbackResponses, sessionId, dataService]);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    // Define navigation hierarchy for back button
    const navigationFlow = {
      'assessment': 'welcome',
      'invite': 'assessment', 
      'johari': 'invite',
      'insights': 'johari',
      'dashboard': 'welcome',
      'profile': 'dashboard'
    };
    
    const previousView = navigationFlow[currentView] || 'welcome';
    setCurrentView(previousView);
  };

  const handleSelfAssessment = (responses) => {
    setSelfResponses(responses);
    // Data will be automatically saved via useEffect
    setCurrentView('invite');
  };

  const handleInclusiveSelfAssessment = (assessmentData) => {
    // Handle the enhanced response format from inclusive assessment
    if (assessmentData.responses) {
      // New format with emotional intelligence
      setSelfResponses(assessmentData.responses);
      
      // Store additional metadata for enhanced insights
      if (isAuthenticated) {
        authService.setUserData('emotionalJourney', assessmentData.emotionalJourney);
        authService.setUserData('inclusivityData', {
          mode: assessmentData.inclusivityMode,
          metadata: assessmentData.metadata
        });
      } else if (sessionId) {
        dataService.saveEmotionalJourney(sessionId, assessmentData.emotionalJourney);
        dataService.saveInclusivityData(sessionId, {
          mode: assessmentData.inclusivityMode,
          metadata: assessmentData.metadata
        });
      }
      
      console.log('✅ Saved inclusive assessment with emotional intelligence data');
    } else {
      // Fallback for simple response format
      setSelfResponses(assessmentData);
    }
    
    setCurrentView('invite');
  };

  const handleFeedbackReceived = (responses) => {
    setFeedbackResponses(prev => [...prev, ...responses]);
    // Data will be automatically saved via useEffect
  };

  // Authentication handlers
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    
    // Load user's existing data
    const userData = authService.getUserData('responses');
    if (userData && userData.length > 0) {
      setSelfResponses(userData);
    }
    
    const feedbackData = authService.getUserData('feedbacks');
    if (feedbackData && feedbackData.length > 0) {
      setFeedbackResponses(feedbackData);
    }
    
    // Update user profile
    setUserProfile(prev => ({
      ...prev,
      name: user.name || '',
      isAnonymous: false
    }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentView('welcome');
    // Clear session data but keep it in localStorage for session-based access
  };

  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    setUserProfile(prev => ({
      ...prev,
      name: updatedUser.name || ''
    }));
  };

  // Show auth forms if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <Header 
          title="Mirror Me" 
          subtitle="Philosophical self-discovery through multiple lenses"
          currentView="auth"
          showAuth={true}
        />
        <main className="main-content">
          <AuthForms onAuthSuccess={handleAuthSuccess} />
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header 
        title="Mirror Me" 
        subtitle="Philosophical self-discovery through multiple lenses"
        currentView={currentView}
        onNavigate={handleViewChange}
        onBack={currentView !== 'welcome' ? handleBack : null}
        sessionId={sessionId}
        hasData={selfResponses.length > 0 || feedbackResponses.length > 0}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <div className="header-completion"></div>

      <main className="main-content">
        {currentView === 'profile' && (
          <UserProfile 
            user={currentUser}
            onLogout={handleLogout}
            onProfileUpdate={handleProfileUpdate}
          />
        )}

        {currentView === 'welcome' && (
          <WelcomeView 
            onStart={() => setCurrentView('self')}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        )}

        {currentView === 'self' && (
          <>
            {assessmentType === 'inclusive' ? (
              <InclusiveSelfAssessment 
                onComplete={handleInclusiveSelfAssessment}
                selectedResponses={selfResponses}
              />
            ) : (
              <SelfAssessment 
                onComplete={handleSelfAssessment}
                selectedResponses={selfResponses}
              />
            )}
            
            {/* Assessment Type Switcher */}
            <div className="assessment-type-switcher">
              <div className="switcher-content">
                <p>Prefer a different experience?</p>
                <div className="type-options">
                  <button 
                    className={`type-btn ${assessmentType === 'inclusive' ? 'active' : ''}`}
                    onClick={() => setAssessmentType('inclusive')}
                  >
                    🌟 Inclusive Experience
                    <span>Multiple ways to express yourself</span>
                  </button>
                  <button 
                    className={`type-btn ${assessmentType === 'standard' ? 'active' : ''}`}
                    onClick={() => setAssessmentType('standard')}
                  >
                    📝 Standard Experience  
                    <span>Traditional text-based approach</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {currentView === 'invite' && (
          <InviteFeedback 
            sessionId={sessionId}
            userProfile={userProfile}
            onFeedbackReceived={handleFeedbackReceived}
            onContinue={() => setCurrentView('johari')}
          />
        )}

        {currentView === 'johari' && (
          <JohariWindow 
            selfResponses={selfResponses}
            feedbackResponses={feedbackResponses}
            onViewInsights={() => setCurrentView('insights')}
          />
        )}

        {currentView === 'insights' && (
          <ReflectionInsights 
            selfResponses={selfResponses}
            feedbackResponses={feedbackResponses}
            userProfile={userProfile}
            onViewDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard 
            userProfile={userProfile}
            sessionId={sessionId}
            selfResponses={selfResponses}
            feedbackResponses={feedbackResponses}
            dataService={dataService}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

// Welcome Component - Philosophical Introduction
const WelcomeView = ({ onStart, userProfile, setUserProfile }) => {
  return (
    <div className="welcome-view">
      <div className="welcome-hero">
        <h1>Welcome to Your Mirror</h1>
        <p className="welcome-subtitle lead-text">
          An exploration of self through the intersection of ancient wisdom and modern psychology
        </p>
      </div>

      <div className="philosophy-section">
        <div className="philosophy-quote">
          <blockquote>
            The curious paradox is that when I accept myself just as I am, then I can change.
          </blockquote>
          <cite>Carl Rogers</cite>
        </div>
      </div>

      <div className="framework-introduction">
        <h2>Theoretical Foundations</h2>
        <p className="lead-text">
          This exploration draws from multiple philosophical and psychological traditions, 
          each offering a unique lens for understanding the complexity of human identity.
        </p>
        
        <div className="framework-grid">
          <div className="framework-card">
            <h3 className="framework-title">Johari Window</h3>
            <div className="framework-philosopher">Joseph Luft & Harry Ingham</div>
            <p className="framework-description">
              Explores the relationship between self-knowledge and social awareness through 
              four quadrants of known and unknown aspects of self.
            </p>
          </div>
          
          <div className="framework-card">
            <h3 className="framework-title">I-Thou Relationship</h3>
            <div className="framework-philosopher">Martin Buber</div>
            <p className="framework-description">
              The quality of encounter between self and other as fundamental to authentic 
              identity formation and genuine meeting.
            </p>
          </div>
          
          <div className="framework-card">
            <h3 className="framework-title">Mirror Stage Theory</h3>
            <div className="framework-philosopher">Jacques Lacan</div>
            <p className="framework-description">
              How we form identity through reflection and external recognition, 
              exploring the relationship between self-image and social mirroring.
            </p>
          </div>
          
          <div className="framework-card">
            <h3 className="framework-title">Contextual Identity</h3>
            <div className="framework-philosopher">Contemporary Psychology</div>
            <p className="framework-description">
              Recognition that identity is fluid and context-dependent, shaped by 
              relationships, environment, and unconscious patterns.
            </p>
          </div>
        </div>
      </div>

      <div className="journey-steps">
        <h2>Your Journey of Discovery</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Self-Reflection</h3>
            <p>
              Explore how you see yourself across different contexts and relationships, 
              moving beyond simple adjectives to deeper patterns of being.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Invite Perspectives</h3>
            <p>
              Share a private link with people whose views you value, creating space 
              for authentic feedback without judgment.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Discover Patterns</h3>
            <p>
              Explore the intersection of self-perception and others' perceptions through 
              your personalized Johari Window and philosophical insights.
            </p>
          </div>
        </div>
      </div>

      <div className="philosophical-disclaimer">
        <h3 className="disclaimer-title">{philosophicalDisclaimer.title}</h3>
        <p className="disclaimer-text">{philosophicalDisclaimer.text}</p>
      </div>

      <div className="profile-setup">
        <h3>Before we begin this exploration...</h3>
        <div className="form-group">
          <label>How would you like to be addressed in this journey?</label>
          <input 
            type="text" 
            placeholder="Your name (or leave blank to remain anonymous)"
            value={userProfile.name}
            onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>
            <input 
              type="checkbox"
              checked={userProfile.isAnonymous}
              onChange={(e) => setUserProfile({...userProfile, isAnonymous: e.target.checked})}
            />
            Keep my identity anonymous to those providing feedback
          </label>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
        <button className="primary-action" onClick={onStart}>
          Begin Your Journey of Self-Discovery
        </button>
      </div>
    </div>
  );
};

export default App;
