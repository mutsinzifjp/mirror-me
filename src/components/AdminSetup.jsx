import React, { useState } from 'react';
import './AdminSetup.css';

const AdminSetup = ({ onSetupComplete, onClose }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!credentials.username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (credentials.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    if (!credentials.password) {
      setError('Password is required');
      return;
    }
    
    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (credentials.password !== credentials.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Save admin credentials securely in localStorage
    const adminCredentials = {
      username: credentials.username,
      password: credentials.password,
      createdAt: Date.now()
    };
    
    localStorage.setItem('mirrorMe_adminCredentials', JSON.stringify(adminCredentials));
    
    setSuccess('Admin credentials created successfully!');
    
    setTimeout(() => {
      onSetupComplete();
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="admin-setup-modal">
        <div className="admin-setup-header">
          <h3>🔧 Create Admin Access</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="admin-setup-content">
          <p className="setup-intro">
            Create your own secure admin credentials. Only you will know these!
          </p>
          
          <form onSubmit={handleSubmit} className="admin-setup-form">
            <div className="form-group">
              <label>Choose Admin Username:</label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Enter your admin username"
                minLength="3"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Choose Admin Password:</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter your admin password"
                minLength="6"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={credentials.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your admin password"
                required
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="setup-actions">
              <button type="submit" className="create-btn">
                🔐 Create Admin Access
              </button>
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
          
          <div className="setup-note">
            <small>
              ⚠️ Remember your credentials! They're stored locally and securely.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
