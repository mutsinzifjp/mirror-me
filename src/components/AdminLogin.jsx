import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = ({ onAdminLogin, onClose }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    secretKey: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Admin credentials (in production, these should be environment variables)
  const ADMIN_CONFIG = {
    username: 'admin',
    password: 'MirrorMe2025!Admin',
    secretKey: 'PhilosophicalMaster2025',
    maxAttempts: 3,
    lockoutTime: 300000 // 5 minutes in milliseconds
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateCredentials = () => {
    const newErrors = {};

    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }

    if (!credentials.secretKey.trim()) {
      newErrors.secretKey = 'Secret key is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkLockout = () => {
    const lockoutData = localStorage.getItem('adminLockout');
    if (lockoutData) {
      const { timestamp, attemptCount } = JSON.parse(lockoutData);
      const now = Date.now();
      
      if (attemptCount >= ADMIN_CONFIG.maxAttempts) {
        const timeLeft = ADMIN_CONFIG.lockoutTime - (now - timestamp);
        if (timeLeft > 0) {
          const minutesLeft = Math.ceil(timeLeft / 60000);
          setErrors({ 
            general: `Admin access locked. Please wait ${minutesLeft} minutes before trying again.` 
          });
          return false;
        } else {
          // Lockout expired, reset
          localStorage.removeItem('adminLockout');
        }
      }
    }
    return true;
  };

  const recordFailedAttempt = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const lockoutData = {
      timestamp: Date.now(),
      attemptCount: newAttempts
    };
    
    localStorage.setItem('adminLockout', JSON.stringify(lockoutData));

    if (newAttempts >= ADMIN_CONFIG.maxAttempts) {
      setErrors({ 
        general: `Too many failed attempts. Admin access locked for 5 minutes.` 
      });
    } else {
      setErrors({ 
        general: `Invalid credentials. ${ADMIN_CONFIG.maxAttempts - newAttempts} attempts remaining.` 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!checkLockout()) {
      return;
    }

    if (!validateCredentials()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Simulate network delay for security
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Verify admin credentials
      const isValidUsername = credentials.username === ADMIN_CONFIG.username;
      const isValidPassword = credentials.password === ADMIN_CONFIG.password;
      const isValidSecretKey = credentials.secretKey === ADMIN_CONFIG.secretKey;

      if (isValidUsername && isValidPassword && isValidSecretKey) {
        // Clear any lockout data on successful login
        localStorage.removeItem('adminLockout');
        
        // Create admin session
        const adminSession = {
          isAdmin: true,
          loginTime: Date.now(),
          sessionId: Date.now().toString(36) + Math.random().toString(36).substr(2)
        };
        
        localStorage.setItem('adminSession', JSON.stringify(adminSession));
        
        // Clear form
        setCredentials({
          username: '',
          password: '',
          secretKey: ''
        });
        
        onAdminLogin(adminSession);
      } else {
        recordFailedAttempt();
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCredentials({
      username: '',
      password: '',
      secretKey: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>🔐 Admin Authentication</h2>
          <button onClick={handleClose} className="close-btn">✕</button>
        </div>

        <div className="security-notice">
          <p>⚠️ Unauthorized access is strictly prohibited. All login attempts are logged.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Admin Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              className={errors.username ? 'error' : ''}
              placeholder="Enter admin username"
              disabled={isLoading}
              autoComplete="username"
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter admin password"
              disabled={isLoading}
              autoComplete="current-password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="secretKey">Secret Access Key</label>
            <input
              type="password"
              id="secretKey"
              name="secretKey"
              value={credentials.secretKey}
              onChange={handleInputChange}
              className={errors.secretKey ? 'error' : ''}
              placeholder="Enter secret access key"
              disabled={isLoading}
              autoComplete="off"
            />
            {errors.secretKey && <span className="error-text">{errors.secretKey}</span>}
          </div>

          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={isLoading || attempts >= ADMIN_CONFIG.maxAttempts}
          >
            {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
          </button>
        </form>

        <div className="admin-info">
          <div className="credentials-info">
            <h4>🔑 Demo Credentials (Change in Production)</h4>
            <div className="demo-creds">
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> MirrorMe2025!Admin</p>
              <p><strong>Secret Key:</strong> PhilosophicalMaster2025</p>
            </div>
            <p className="security-note">
              🛡️ In production, store these credentials securely and change the default values.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
