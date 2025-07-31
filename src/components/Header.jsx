import React, { useState, useEffect } from 'react';
import { MirrorSymbol, ReflectionWaves } from './PhilosophicalVisuals';
import AdminPanel from './AdminPanel';
import SimpleAdminLogin from './SimpleAdminLogin';

const Header = ({ 
  title = "Mirror Me", 
  subtitle, 
  currentView, 
  onNavigate, 
  sessionId, 
  hasData, 
  currentUser, 
  onLogout, 
  showAuth = false,
  onBack 
}) => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Check if admin is already authenticated on component mount
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        const now = Date.now();
        
        // Check if session has expiry field (new sessions) or use legacy check
        if (session.sessionExpiry) {
          if (now < session.sessionExpiry && session.isAdmin) {
            // Update last activity and extend session
            session.lastActivity = now;
            localStorage.setItem('adminSession', JSON.stringify(session));
            setIsAdminAuthenticated(true);
            console.log('✅ Admin session restored and extended');
          } else {
            // Session expired
            localStorage.removeItem('adminSession');
            console.log('❌ Admin session expired');
          }
        } else {
          // Legacy session - convert to new format with 7-day expiry
          const sessionAge = now - session.loginTime;
          const maxSessionTime = 30 * 60 * 1000; // 30 minutes for legacy
          
          if (sessionAge < maxSessionTime && session.isAdmin) {
            // Convert to new format
            const updatedSession = {
              ...session,
              sessionExpiry: now + (7 * 24 * 60 * 60 * 1000), // 7 days from now
              lastActivity: now
            };
            localStorage.setItem('adminSession', JSON.stringify(updatedSession));
            setIsAdminAuthenticated(true);
            console.log('✅ Legacy admin session converted to 7-day session');
          } else {
            // Legacy session expired
            localStorage.removeItem('adminSession');
          }
        }
      } catch (error) {
        localStorage.removeItem('adminSession');
        console.error('Error checking admin session:', error);
      }
    }
  }, []);

  const handleAdminLogin = (adminSession) => {
    setIsAdminAuthenticated(true);
    setShowAdminLogin(false);
    setShowAdminPanel(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminSession');
    setIsAdminAuthenticated(false);
    setShowAdminPanel(false);
  };

  const getProgressPercentage = () => {
    if (showAuth || currentView === 'auth') return 0;
    const viewOrder = ['welcome', 'self', 'invite', 'johari', 'insights', 'dashboard'];
    const currentIndex = viewOrder.indexOf(currentView);
    return currentIndex >= 0 ? ((currentIndex + 1) / viewOrder.length) * 100 : 0;
  };

  const getStepName = (view) => {
    const stepNames = {
      welcome: 'Welcome',
      self: 'Self-Reflection',
      invite: 'Gather Feedback',
      johari: 'Johari Window',
      insights: 'Insights',
      dashboard: 'Dashboard',
      profile: 'Profile',
      auth: 'Authentication'
    };
    return stepNames[view] || view.charAt(0).toUpperCase() + view.slice(1);
  };

  return (
    <header className="app-header">
      <div className="header-background">
        <ReflectionWaves size={200} className="header-wave" />
      </div>
      
      <div className="header-content">
        {/* Navigation Section - Simple Back Button Only */}
        <div className="nav-section">
          {onBack && (
            <button 
              className="back-btn"
              onClick={onBack}
              title="Go back"
            >
              ← Back
            </button>
          )}
        </div>
        
        {/* Logo Section */}
        <div className="logo-section">
          <div className="brand-identity">
            <h1 className="app-title">{title}</h1>
            <MirrorSymbol size={48} className="brand-symbol mirror-reflection" />
          </div>
          {subtitle && <p className="app-subtitle">{subtitle}</p>}
        </div>
        
        {/* User Menu - Simplified */}
        {currentUser && !showAuth && (
          <div className="user-menu">
            <div className="user-info">
              <span className="user-name">Hello, {currentUser.name}</span>
              <div className="user-actions">
                <button 
                  className="nav-btn user-btn pulse-effect"
                  onClick={() => onNavigate('profile')}
                  title="View your profile"
                >
                  Profile
                </button>
                <button 
                  className="nav-btn logout-btn"
                  onClick={onLogout}
                  title="Sign out"
                >
                  Sign Out
                </button>
                {isAdminAuthenticated && (
                  <button 
                    className="nav-btn admin-btn glow-effect"
                    onClick={() => setShowAdminPanel(true)}
                    title="Admin Panel"
                  >
                    Admin
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Essential Navigation Only */}
        {hasData && onNavigate && !showAuth && (
          <div className="header-navigation">
            <button 
              className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => onNavigate('dashboard')}
              title="View your saved responses and analysis"
            >
              Dashboard
            </button>
            {currentView === 'dashboard' && (
              <button 
                className="nav-btn"
                onClick={() => onNavigate('insights')}
                title="Return to insights"
              >
                Insights
              </button>
            )}
          </div>
        )}
        
        {currentView && currentView !== 'welcome' && !showAuth && (
          <div className="journey-progress">
            <div className="progress-label">Journey Progress</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <div className="current-step">{getStepName(currentView)}</div>
          </div>
        )}
      </div>
      
      <div className="header-divider"></div>
      
      {/* Simple Admin Access - Bottom Right Corner */}
      <div className="admin-access-corner">
        <button 
          className="admin-access-btn"
          onClick={() => setShowAdminLogin(true)}
          title="Admin Access"
        >
          Admin
        </button>
      </div>
      
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <SimpleAdminLogin 
          onAdminLogin={handleAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
      
      {/* Admin Panel - Secure Access Only */}
      {showAdminPanel && isAdminAuthenticated && (
        <AdminPanel 
          onClose={() => setShowAdminPanel(false)}
          onLogout={handleAdminLogout}
        />
      )}
    </header>
  );
};

export default Header;
