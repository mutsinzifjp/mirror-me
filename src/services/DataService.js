// Data persistence service for storing user responses and analysis
import authService from './AuthService';

export class PhilosophicalDataService {
  constructor() {
    this.storagePrefix = 'philosophical_journey_';
  }

  // Get current storage key (user-specific if logged in, session-based if not)
  getStorageKey(type, sessionId) {
    const user = authService.getCurrentUser();
    if (user) {
      return `${this.storagePrefix}${type}_user_${user.id}`;
    }
    return `${this.storagePrefix}${type}_${sessionId}`;
  }

  // Save user's self-reflection responses
  saveUserResponses(sessionId, responses) {
    try {
      const data = {
        responses,
        timestamp: new Date().toISOString(),
        sessionId
      };
      
      const storageKey = this.getStorageKey('responses', sessionId);
      localStorage.setItem(storageKey, JSON.stringify(data));
      
      // If user is logged in, also save to their profile data
      if (authService.isLoggedIn()) {
        authService.saveUserData('responses', responses);
      }
      
      console.log('User responses saved successfully');
    } catch (error) {
      console.error('Error saving user responses:', error);
    }
  }

  // Save feedback from others
  saveFeedbackResponse(sessionId, feedbackResponse) {
    try {
      const existingFeedback = this.getFeedbackResponses(sessionId);
      const updatedFeedback = [...existingFeedback, {
        ...feedbackResponse,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      }];
      
      const storageKey = this.getStorageKey('feedback', sessionId);
      localStorage.setItem(storageKey, JSON.stringify(updatedFeedback));
      
      // If user is logged in, also save to their profile data
      if (authService.isLoggedIn()) {
        authService.saveUserData('feedbacks', updatedFeedback);
      }
      
      console.log('Feedback response saved successfully');
      
      // Notify user that feedback was received (in production, this would be a real notification)
      this.notifyFeedbackReceived(sessionId);
    } catch (error) {
      console.error('Error saving feedback response:', error);
    }
  }

  // Get user's responses
  getUserResponses(sessionId) {
    try {
      // If user is logged in, get from their profile first
      if (authService.isLoggedIn()) {
        const userData = authService.getUserData('responses');
        if (userData && userData.length > 0) {
          return userData;
        }
      }
      
      // Fallback to session-based storage
      const storageKey = this.getStorageKey('responses', sessionId);
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data).responses : [];
    } catch (error) {
      console.error('Error loading user responses:', error);
      return [];
    }
  }

  // Get feedback responses
  getFeedbackResponses(sessionId) {
    try {
      // If user is logged in, get from their profile first
      if (authService.isLoggedIn()) {
        const userData = authService.getUserData('feedbacks');
        if (userData && userData.length > 0) {
          return userData;
        }
      }
      
      // Fallback to session-based storage
      const storageKey = this.getStorageKey('feedback', sessionId);
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading feedback responses:', error);
      return [];
    }
  }

  // Save comprehensive analysis results
  saveAnalysisResults(sessionId, analysisResults) {
    try {
      const data = {
        analysis: analysisResults,
        timestamp: new Date().toISOString(),
        sessionId
      };
      
      const storageKey = this.getStorageKey('analysis', sessionId);
      localStorage.setItem(storageKey, JSON.stringify(data));
      
      // If user is logged in, also save to their profile data
      if (authService.isLoggedIn()) {
        authService.saveUserData('analyses', analysisResults);
      }
      
      console.log('Analysis results saved successfully');
    } catch (error) {
      console.error('Error saving analysis results:', error);
    }
  }

  // Get analysis results
  getAnalysisResults(sessionId) {
    try {
      // If user is logged in, get from their profile first
      if (authService.isLoggedIn()) {
        const userData = authService.getUserData('analyses');
        if (userData) {
          return userData;
        }
      }
      
      // Fallback to session-based storage
      const storageKey = this.getStorageKey('analysis', sessionId);
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data).analysis : null;
    } catch (error) {
      console.error('Error loading analysis results:', error);
      return null;
    }
  }

  // Save user profile
  saveUserProfile(sessionId, userProfile) {
    try {
      localStorage.setItem(`${this.storagePrefix}profile_${sessionId}`, JSON.stringify(userProfile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  // Get user profile
  getUserProfile(sessionId) {
    try {
      const data = localStorage.getItem(`${this.storagePrefix}profile_${sessionId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  // Get all user sessions (for returning users)
  getUserSessions() {
    try {
      const sessions = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(`${this.storagePrefix}profile_`)) {
          const sessionId = key.replace(`${this.storagePrefix}profile_`, '');
          const profile = JSON.parse(localStorage.getItem(key));
          sessions.push({
            sessionId,
            profile,
            lastActive: this.getLastActivity(sessionId)
          });
        }
      }
      return sessions.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
    } catch (error) {
      console.error('Error loading user sessions:', error);
      return [];
    }
  }

  // Get last activity timestamp for a session
  getLastActivity(sessionId) {
    try {
      const keys = [
        `${this.storagePrefix}responses_${sessionId}`,
        `${this.storagePrefix}feedback_${sessionId}`,
        `${this.storagePrefix}analysis_${sessionId}`
      ];
      
      let latestTimestamp = null;
      
      keys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          const timestamp = parsed.timestamp || (Array.isArray(parsed) && parsed[0]?.timestamp);
          if (timestamp && (!latestTimestamp || new Date(timestamp) > new Date(latestTimestamp))) {
            latestTimestamp = timestamp;
          }
        }
      });
      
      return latestTimestamp || new Date().toISOString();
    } catch (error) {
      console.error('Error getting last activity:', error);
      return new Date().toISOString();
    }
  }

  // Notify user that feedback was received
  notifyFeedbackReceived(sessionId) {
    // In production, this would send an email/push notification
    console.log(`New feedback received for session ${sessionId}`);
    
    // Store notification in localStorage for demo purposes
    const notifications = this.getNotifications(sessionId);
    notifications.unshift({
      id: Date.now().toString(),
      type: 'feedback_received',
      message: 'You received new feedback from someone',
      timestamp: new Date().toISOString(),
      read: false
    });
    
    localStorage.setItem(`${this.storagePrefix}notifications_${sessionId}`, JSON.stringify(notifications));
  }

  // Get notifications
  getNotifications(sessionId) {
    try {
      const data = localStorage.getItem(`${this.storagePrefix}notifications_${sessionId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  markNotificationRead(sessionId, notificationId) {
    try {
      const notifications = this.getNotifications(sessionId);
      const updated = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(`${this.storagePrefix}notifications_${sessionId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Export all data for a session
  exportSessionData(sessionId) {
    try {
      return {
        sessionId,
        userProfile: this.getUserProfile(sessionId),
        responses: this.getUserResponses(sessionId),
        feedback: this.getFeedbackResponses(sessionId),
        analysis: this.getAnalysisResults(sessionId),
        notifications: this.getNotifications(sessionId),
        exportTimestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error exporting session data:', error);
      return null;
    }
  }

  // Clear all data for a session (if user wants to start over)
  clearSessionData(sessionId) {
    try {
      const keys = [
        `${this.storagePrefix}responses_${sessionId}`,
        `${this.storagePrefix}feedback_${sessionId}`,
        `${this.storagePrefix}analysis_${sessionId}`,
        `${this.storagePrefix}profile_${sessionId}`,
        `${this.storagePrefix}notifications_${sessionId}`,
        `${this.storagePrefix}emotional_journey_${sessionId}`,
        `${this.storagePrefix}inclusivity_data_${sessionId}`
      ];
      
      keys.forEach(key => localStorage.removeItem(key));
      console.log('Session data cleared successfully');
    } catch (error) {
      console.error('Error clearing session data:', error);
    }
  }

  // Save emotional journey data from inclusive assessment
  saveEmotionalJourney(sessionId, emotionalJourney) {
    try {
      const data = {
        emotionalJourney,
        timestamp: new Date().toISOString(),
        sessionId
      };
      
      const storageKey = this.getStorageKey('emotional_journey', sessionId);
      localStorage.setItem(storageKey, JSON.stringify(data));
      console.log('Emotional journey data saved successfully');
    } catch (error) {
      console.error('Error saving emotional journey:', error);
    }
  }

  // Save inclusivity data and metadata
  saveInclusivityData(sessionId, inclusivityData) {
    try {
      const data = {
        inclusivityData,
        timestamp: new Date().toISOString(),
        sessionId
      };
      
      const storageKey = this.getStorageKey('inclusivity_data', sessionId);
      localStorage.setItem(storageKey, JSON.stringify(data));
      console.log('Inclusivity data saved successfully');
    } catch (error) {
      console.error('Error saving inclusivity data:', error);
    }
  }

  // Get emotional journey data
  getEmotionalJourney(sessionId) {
    try {
      const storageKey = this.getStorageKey('emotional_journey', sessionId);
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data).emotionalJourney : null;
    } catch (error) {
      console.error('Error loading emotional journey:', error);
      return null;
    }
  }

  // Get inclusivity data
  getInclusivityData(sessionId) {
    try {
      const storageKey = this.getStorageKey('inclusivity_data', sessionId);
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data).inclusivityData : null;
    } catch (error) {
      console.error('Error loading inclusivity data:', error);
      return null;
    }
  }
}

// Export singleton instance
export const dataService = new PhilosophicalDataService();
