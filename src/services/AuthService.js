class AuthenticationService {
  constructor() {
    this.currentUser = this.loadCurrentUser();
    this.users = this.loadUsers();
  }

  // Load current user from localStorage
  loadCurrentUser() {
    try {
      const userData = localStorage.getItem('mirrorMe_currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error loading current user:', error);
      return null;
    }
  }

  // Load all users from localStorage
  loadUsers() {
    try {
      const usersData = localStorage.getItem('mirrorMe_users');
      return usersData ? JSON.parse(usersData) : {};
    } catch (error) {
      console.error('Error loading users:', error);
      return {};
    }
  }

  // Save users to localStorage
  saveUsers() {
    try {
      localStorage.setItem('mirrorMe_users', JSON.stringify(this.users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  // Save current user to localStorage
  saveCurrentUser() {
    try {
      if (this.currentUser) {
        localStorage.setItem('mirrorMe_currentUser', JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem('mirrorMe_currentUser');
      }
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  }

  // Check if current session is valid
  isSessionValid() {
    if (!this.currentUser) {
      return false;
    }

    // Check if session has expiry and if it's still valid
    if (this.currentUser.sessionExpiry) {
      const now = Date.now();
      if (now > this.currentUser.sessionExpiry) {
        console.log('❌ Session expired, logging out user');
        this.logout();
        return false;
      }
      
      // Update last activity
      this.currentUser.lastActivity = now;
      this.saveCurrentUser();
      return true;
    }

    // Legacy sessions without expiry are still valid but should be updated
    return true;
  }

  // Extend current session
  extendSession() {
    if (this.currentUser) {
      this.currentUser.sessionExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
      this.currentUser.lastActivity = Date.now();
      this.saveCurrentUser();
      console.log('✅ Session extended for 7 more days');
    }
  }

  // Generate unique user ID (simple implementation without uuid dependency)
  generateUserId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  // Hash password (simple implementation - in production use proper hashing)
  hashPassword(password) {
    // Simple hash for demonstration - use bcrypt or similar in production
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  // Register new user
  register(email, password, name = '') {
    try {
      // Check if user already exists
      if (this.users[email]) {
        return { success: false, error: 'User already exists with this email' };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      // Validate password
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }

      // Create new user
      const userId = this.generateUserId();
      const hashedPassword = this.hashPassword(password);
      
      const newUser = {
        id: userId,
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        hashedPassword,
        createdAt: new Date().toISOString(),
        lastLoginAt: null,
        profileData: {
          responses: [],
          feedbacks: [],
          analyses: null,
          preferences: {}
        }
      };

      // Save user
      this.users[email.toLowerCase()] = newUser;
      this.saveUsers();

      return { success: true, user: { ...newUser, hashedPassword: undefined } };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }

  // Login user
  login(email, password) {
    try {
      const user = this.users[email.toLowerCase()];
      
      if (!user) {
        return { success: false, error: 'No account found with this email' };
      }

      const hashedPassword = this.hashPassword(password);
      if (user.hashedPassword !== hashedPassword) {
        return { success: false, error: 'Invalid password' };
      }

      // Update last login and create extended session
      user.lastLoginAt = new Date().toISOString();
      this.users[email.toLowerCase()] = user;
      this.saveUsers();

      // Set current user with extended session (7 days)
      this.currentUser = { 
        ...user, 
        hashedPassword: undefined,
        loginTime: Date.now(),
        sessionExpiry: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        lastActivity: Date.now(),
        rememberMe: true
      };
      this.saveCurrentUser();

      console.log('✅ User logged in with 7-day persistent session');
      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Logout user
  logout() {
    try {
      this.currentUser = null;
      this.saveCurrentUser();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Get current user (with session validation)
  getCurrentUser() {
    if (this.currentUser && this.isSessionValid()) {
      return this.currentUser;
    }
    return null;
  }

  // Update user profile
  updateProfile(updates) {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'No user logged in' };
      }

      // Update current user
      this.currentUser = { ...this.currentUser, ...updates };
      
      // Update in users database
      this.users[this.currentUser.email] = {
        ...this.users[this.currentUser.email],
        ...updates
      };

      this.saveUsers();
      this.saveCurrentUser();

      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  }

  // Save user's philosophical data
  saveUserData(dataType, data) {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'No user logged in' };
      }

      const userEmail = this.currentUser.email;
      if (!this.users[userEmail]) {
        return { success: false, error: 'User not found' };
      }

      // Update user's profile data
      if (!this.users[userEmail].profileData) {
        this.users[userEmail].profileData = {};
      }

      this.users[userEmail].profileData[dataType] = data;
      
      // Update current user as well
      if (!this.currentUser.profileData) {
        this.currentUser.profileData = {};
      }
      this.currentUser.profileData[dataType] = data;

      this.saveUsers();
      this.saveCurrentUser();

      return { success: true };
    } catch (error) {
      console.error('Error saving user data:', error);
      return { success: false, error: 'Failed to save data' };
    }
  }

  // Load user's philosophical data
  getUserData(dataType) {
    try {
      if (!this.currentUser) {
        return null;
      }

      return this.currentUser.profileData?.[dataType] || null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  }

  // Delete user account
  deleteAccount() {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'No user logged in' };
      }

      const userEmail = this.currentUser.email;
      delete this.users[userEmail];
      this.saveUsers();
      
      this.currentUser = null;
      this.saveCurrentUser();

      return { success: true };
    } catch (error) {
      console.error('Error deleting account:', error);
      return { success: false, error: 'Failed to delete account' };
    }
  }

  // Reset password (basic implementation)
  resetPassword(email, newPassword) {
    try {
      const user = this.users[email.toLowerCase()];
      
      if (!user) {
        return { success: false, error: 'No account found with this email' };
      }

      if (newPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }

      user.hashedPassword = this.hashPassword(newPassword);
      this.users[email.toLowerCase()] = user;
      this.saveUsers();

      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Password reset failed' };
    }
  }

  // Get user statistics
  getUserStats() {
    try {
      if (!this.currentUser) {
        return null;
      }

      const profileData = this.currentUser.profileData || {};
      return {
        responsesCount: profileData.responses?.length || 0,
        feedbackCount: profileData.feedbacks?.length || 0,
        hasAnalysis: !!profileData.analyses,
        memberSince: this.currentUser.createdAt,
        lastLogin: this.currentUser.lastLoginAt
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }
}

// Create singleton instance
const authService = new AuthenticationService();

export default authService;
