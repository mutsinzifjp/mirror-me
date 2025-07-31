import React, { useState } from 'react';
import authService from '../services/AuthService';
import './UserProfile.css';

const UserProfile = ({ user, onLogout, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const userStats = authService.getUserStats();

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const result = authService.updateProfile({
        name: editData.name,
        email: editData.email
      });

      if (result.success) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        if (onProfileUpdate) {
          onProfileUpdate(result.user);
        }
      } else {
        setMessage(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('An error occurred while updating your profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    const result = authService.logout();
    if (result.success && onLogout) {
      onLogout();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCompletionPercentage = () => {
    if (!userStats) return 0;
    const totalQuestions = 12; // Assuming 12 total reflection questions
    return Math.round((userStats.responsesCount / totalQuestions) * 100);
  };

  const getJourneyStage = () => {
    const completion = getCompletionPercentage();
    if (completion === 0) return 'Just Beginning';
    if (completion < 25) return 'Early Explorer';
    if (completion < 50) return 'Active Reflector';
    if (completion < 75) return 'Deep Thinker';
    if (completion < 100) return 'Nearly Complete';
    return 'Philosophical Master';
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <div className="user-avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="user-info">
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                className="edit-input"
                disabled={isLoading}
              />
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                placeholder="Your email"
                className="edit-input"
                disabled={isLoading}
              />
              <div className="edit-actions">
                <button 
                  onClick={handleSaveProfile}
                  className="save-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={handleEditToggle}
                  className="cancel-btn"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="display-info">
              <h2>{user?.name || 'Philosophical Explorer'}</h2>
              <p className="user-email">{user?.email}</p>
              <button onClick={handleEditToggle} className="edit-btn">
                Edit Profile
              </button>
            </div>
          )}
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Sign Out
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="profile-stats">
        <h3>Your Philosophical Journey</h3>
        
        <div className="journey-stage">
          <div className="stage-indicator">
            <span className="stage-title">{getJourneyStage()}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
            <span className="progress-text">{getCompletionPercentage()}% Complete</span>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-number">{userStats?.responsesCount || 0}</div>
              <div className="stat-label">Reflections Completed</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🤝</div>
            <div className="stat-content">
              <div className="stat-number">{userStats?.feedbackCount || 0}</div>
              <div className="stat-label">External Perspectives</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🧠</div>
            <div className="stat-content">
              <div className="stat-number">{userStats?.hasAnalysis ? '✓' : '○'}</div>
              <div className="stat-label">Philosophical Analysis</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-number">{formatDate(userStats?.memberSince).split(',')[0]}</div>
              <div className="stat-label">Member Since</div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <h3>Account Management</h3>
        
        <div className="action-buttons">
          <button className="action-btn secondary">
            Download My Data
          </button>
          <button className="action-btn secondary">
            Reset Progress
          </button>
          <button className="action-btn danger">
            Delete Account
          </button>
        </div>

        <div className="account-info">
          <p><strong>Last Login:</strong> {formatDate(userStats?.lastLogin)}</p>
          <p><strong>Data Storage:</strong> All your reflections are stored securely and privately</p>
          <p><strong>Privacy:</strong> Your personal insights are never shared with anyone</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
