import React, { useState, useEffect } from 'react';
import { MirrorSymbol } from './PhilosophicalVisuals';
import './AdminPanel.css';

const AdminPanel = ({ onClose, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    // Get all users from localStorage
    try {
      const usersData = localStorage.getItem('mirrorMe_users');
      const allUsers = usersData ? JSON.parse(usersData) : {};
      
      const usersList = Object.values(allUsers).map(user => ({
        ...user,
        responsesCount: user.profileData?.responses?.length || 0,
        feedbackCount: user.profileData?.feedbacks?.length || 0,
        hasAnalysis: !!user.profileData?.analyses,
        lastActivity: user.lastLoginAt || user.createdAt
      }));

      // Calculate platform statistics
      const totalUsers = usersList.length;
      const activeUsers = usersList.filter(u => u.lastLoginAt).length;
      const totalResponses = usersList.reduce((sum, u) => sum + u.responsesCount, 0);
      const totalFeedback = usersList.reduce((sum, u) => sum + u.feedbackCount, 0);
      const completedAnalyses = usersList.filter(u => u.hasAnalysis).length;

      setUsers(usersList);
      setStats({
        totalUsers,
        activeUsers,
        totalResponses,
        totalFeedback,
        completedAnalyses,
        avgResponsesPerUser: totalUsers > 0 ? (totalResponses / totalUsers).toFixed(1) : 0
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortedUsers = () => {
    let filtered = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'lastActivity') {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const exportUserData = () => {
    const dataToExport = {
      exportDate: new Date().toISOString(),
      platformStats: stats,
      users: users.map(user => ({
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        responsesCount: user.responsesCount,
        feedbackCount: user.feedbackCount,
        hasAnalysis: user.hasAnalysis
      }))
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mirror-me-user-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const viewUserDetails = (user) => {
    // Get full user data including responses
    try {
      const usersData = localStorage.getItem('mirrorMe_users');
      const allUsers = usersData ? JSON.parse(usersData) : {};
      const fullUserData = allUsers[user.email];
      setSelectedUser(fullUserData);
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const deleteUser = (userEmail) => {
    if (window.confirm(`Are you sure you want to delete user: ${userEmail}?`)) {
      try {
        const usersData = localStorage.getItem('mirrorMe_users');
        const allUsers = usersData ? JSON.parse(usersData) : {};
        delete allUsers[userEmail];
        localStorage.setItem('mirrorMe_users', JSON.stringify(allUsers));
        loadUserData(); // Refresh the data
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="admin-panel-overlay">
      <div className="admin-panel">
        <div className="admin-header">
          <div className="admin-header-left">
            <div className="admin-brand">
              <MirrorSymbol size={40} className="admin-symbol" />
              <h2>Admin Panel</h2>
            </div>
          </div>
          <div className="admin-header-actions">
            <button onClick={onLogout} className="admin-logout-btn">
              🔐 Admin Logout
            </button>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card">
            <h3>{stats.activeUsers}</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalResponses}</h3>
            <p>Total Responses</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalFeedback}</h3>
            <p>Feedback Received</p>
          </div>
          <div className="stat-card">
            <h3>{stats.completedAnalyses}</h3>
            <p>Completed Analyses</p>
          </div>
          <div className="stat-card">
            <h3>{stats.avgResponsesPerUser}</h3>
            <p>Avg Responses/User</p>
          </div>
        </div>

        <div className="admin-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search users by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="action-buttons">
            <button onClick={exportUserData} className="export-btn">
              📊 Export Data
            </button>
            <button onClick={loadUserData} className="refresh-btn">
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('email')}>
                  Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('name')}>
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('createdAt')}>
                  Joined {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('lastActivity')}>
                  Last Active {sortBy === 'lastActivity' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('responsesCount')}>
                  Responses {sortBy === 'responsesCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('feedbackCount')}>
                  Feedback {sortBy === 'feedbackCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Analysis</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getSortedUsers().map((user, index) => (
                <tr key={user.email} className={index % 2 === 0 ? 'even' : 'odd'}>
                  <td className="email-cell">{user.email}</td>
                  <td>{user.name}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{formatDate(user.lastActivity)}</td>
                  <td className="number-cell">{user.responsesCount}</td>
                  <td className="number-cell">{user.feedbackCount}</td>
                  <td className="status-cell">
                    {user.hasAnalysis ? '✅' : '⏳'}
                  </td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => viewUserDetails(user)}
                      className="view-btn"
                      title="View details"
                    >
                      👁️
                    </button>
                    <button 
                      onClick={() => deleteUser(user.email)}
                      className="delete-btn"
                      title="Delete user"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedUser && (
          <div className="user-details-modal">
            <div className="user-details">
              <div className="details-header">
                <h3>User Details: {selectedUser.name}</h3>
                <button onClick={() => setSelectedUser(null)} className="close-details-btn">✕</button>
              </div>
              
              <div className="details-content">
                <div className="basic-info">
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Joined:</strong> {formatDate(selectedUser.createdAt)}</p>
                  <p><strong>Last Login:</strong> {formatDate(selectedUser.lastLoginAt)}</p>
                </div>

                {selectedUser.profileData?.responses && (
                  <div className="responses-section">
                    <h4>Responses ({selectedUser.profileData.responses.length})</h4>
                    <div className="responses-list">
                      {selectedUser.profileData.responses.slice(0, 3).map((response, index) => (
                        <div key={index} className="response-preview">
                          <p><strong>Q:</strong> {response.question?.substring(0, 80)}...</p>
                          <p><strong>A:</strong> {response.response?.substring(0, 100)}...</p>
                        </div>
                      ))}
                      {selectedUser.profileData.responses.length > 3 && (
                        <p className="more-indicator">... and {selectedUser.profileData.responses.length - 3} more responses</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedUser.profileData?.feedbacks && (
                  <div className="feedback-section">
                    <h4>Feedback Received ({selectedUser.profileData.feedbacks.length})</h4>
                    <div className="feedback-list">
                      {selectedUser.profileData.feedbacks.slice(0, 2).map((feedback, index) => (
                        <div key={index} className="feedback-preview">
                          <p><strong>From:</strong> Anonymous</p>
                          <p><strong>Response:</strong> {feedback.response?.substring(0, 100)}...</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
