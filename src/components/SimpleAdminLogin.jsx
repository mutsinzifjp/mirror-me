import React, { useState } from 'react';
import './SimpleAdminLogin.css';

const SimpleAdminLogin = ({ onAdminLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCreateCredentials, setShowCreateCredentials] = useState(false);
  
  // Create credentials form state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Check for custom credentials first
    const savedCredentials = localStorage.getItem('mirrorMe_adminCredentials');
    
    if (savedCredentials) {
      try {
        const credentials = JSON.parse(savedCredentials);
        if (username === credentials.username && password === credentials.password) {
          const adminSession = {
            isAdmin: true,
            loginTime: Date.now(),
            sessionExpiry: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
            lastActivity: Date.now(),
            customAdmin: true
          };
          
          localStorage.setItem('adminSession', JSON.stringify(adminSession));
          onAdminLogin(adminSession);
          return;
        }
      } catch (error) {
        console.error('Error reading admin credentials:', error);
      }
    }
    
    // Fallback to default credentials
    if (username === 'admin' && password === 'admin123') {
      const adminSession = {
        isAdmin: true,
        loginTime: Date.now(),
        sessionExpiry: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        lastActivity: Date.now(),
        defaultAdmin: true
      };
      
      localStorage.setItem('adminSession', JSON.stringify(adminSession));
      onAdminLogin(adminSession);
    } else {
      setError('Invalid username or password');
    }
  };

  const handleCreateCredentials = (e) => {
    e.preventDefault();
    
    if (!newUsername.trim()) {
      setError('Username is required');
      return;
    }
    
    if (newUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    if (!newPassword) {
      setError('Password is required');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Save admin credentials
    const adminCredentials = {
      username: newUsername,
      password: newPassword,
      createdAt: Date.now()
    };
    
    localStorage.setItem('mirrorMe_adminCredentials', JSON.stringify(adminCredentials));
    
    // Auto login with new credentials
    const adminSession = {
      isAdmin: true,
      loginTime: Date.now(),
      sessionExpiry: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      lastActivity: Date.now(),
      newlyCreated: true
    };
    
    localStorage.setItem('adminSession', JSON.stringify(adminSession));
    onAdminLogin(adminSession);
  };

  const hasCustomCredentials = !!localStorage.getItem('mirrorMe_adminCredentials');

  if (showCreateCredentials) {
    return (
      <div className="modal-overlay">
        <div className="admin-login-modal">
          <div className="admin-login-header">
            <h3>🔐 Create Admin Credentials</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <form onSubmit={handleCreateCredentials} className="admin-login-form">
            <div className="setup-intro">
              <p>Create your personal admin credentials. Only you will know these!</p>
            </div>
            
            <div className="form-group">
              <label>Choose Username:</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter your admin username"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Choose Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your admin password"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="login-actions">
              <button type="submit" className="create-btn">
                🔐 Create & Login
              </button>
              <button type="button" onClick={() => setShowCreateCredentials(false)} className="cancel-btn">
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="admin-login-modal">
        <div className="admin-login-header">
          <h3>🔧 Admin Access</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={hasCustomCredentials ? "Your username" : "admin"}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={hasCustomCredentials ? "Your password" : "admin123"}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="login-actions">
            <button type="submit" className="login-btn">
              🔓 Login
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
          
          {!hasCustomCredentials && (
            <>
              <div className="divider">
                <span>OR</span>
              </div>
              <button 
                type="button" 
                onClick={() => setShowCreateCredentials(true)}
                className="setup-btn"
              >
                🔐 Create Your Own Credentials
              </button>
              <div className="login-hint">
                <small>Default: admin / admin123</small>
              </div>
            </>
          )}
          
          {hasCustomCredentials && (
            <div className="custom-credentials-note">
              <small>✅ Using your custom credentials</small>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SimpleAdminLogin;
