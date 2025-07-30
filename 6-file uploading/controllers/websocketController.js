// ========================================
// WEBSOCKET CONTROLLER WITH AUTHENTICATION SUPPORT
// ========================================
// This controller provides methods to send messages to authenticated WebSocket users
// It works with the global authenticatedConnections Map from index.js

const WebSocketController = {
  // ========================================
  // BROADCAST MESSAGING
  // ========================================
  
  /**
   * Send message to all authenticated clients
   * @param {Object|string} message - The message to send to all users
   * @description Sends a broadcast message to all currently connected and authenticated users
   */
  sendToAll: (message) => {
    if (global.authenticatedConnections) {
      global.authenticatedConnections.forEach((client, userId) => {
        // Check if the WebSocket connection is still open (readyState === 1 means OPEN)
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: 'broadcast',
            data: message,
            timestamp: new Date().toISOString()
          }));
        }
      });
    }
  },

  // ========================================
  // PRIVATE MESSAGING
  // ========================================
  
  /**
   * Send message to specific authenticated user
   * @param {string} userId - The user ID to send the message to
   * @param {Object|string} message - The message to send
   * @returns {boolean} - True if message was sent successfully, false otherwise
   * @description Sends a private message to a specific user if they are connected
   */
  sendToUser: (userId, message) => {
    if (global.authenticatedConnections && global.authenticatedConnections.has(userId)) {
      const client = global.authenticatedConnections.get(userId);
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(JSON.stringify({
          type: 'private',
          data: message,
          timestamp: new Date().toISOString()
        }));
        return true; // Message sent successfully
      }
    }
    return false; // User not connected or connection closed
  },

  /**
   * Send message to multiple specific users
   * @param {Array<string>} userIds - Array of user IDs to send the message to
   * @param {Object|string} message - The message to send
   * @returns {Array<Object>} - Array of results showing which users received the message
   * @description Sends the same message to multiple users and returns delivery status
   */
  sendToUsers: (userIds, message) => {
    const results = [];
    userIds.forEach(userId => {
      const sent = WebSocketController.sendToUser(userId, message);
      results.push({ userId, sent });
    });
    return results;
  },

  // ========================================
  // ROLE-BASED MESSAGING
  // ========================================
  
  /**
   * Send message to users by role
   * @param {string} role - The role to target (e.g., 'admin', 'user')
   * @param {Object|string} message - The message to send
   * @returns {Array<Object>} - Array of results showing which users received the message
   * @description Sends a message to all connected users with a specific role
   */
  sendToRole: (role, message) => {
    const results = [];
    if (global.authenticatedConnections) {
      global.authenticatedConnections.forEach((client, userId) => {
        // Check if user has the specified role and connection is open
        if (client.user && client.user.role === role && client.readyState === 1) {
          client.send(JSON.stringify({
            type: 'role_broadcast',
            data: message,
            timestamp: new Date().toISOString()
          }));
          results.push({ userId, sent: true });
        }
      });
    }
    return results;
  },

  // ========================================
  // CONNECTION MANAGEMENT
  // ========================================
  
  /**
   * Get number of authenticated clients currently connected
   * @returns {number} - Number of connected authenticated users
   * @description Returns the count of currently connected and authenticated users
   */
  getConnectedClientsCount: () => {
    if (global.authenticatedConnections) {
      return global.authenticatedConnections.size;
    }
    return 0;
  },

  /**
   * Get list of connected user IDs
   * @returns {Array<string>} - Array of user IDs that are currently connected
   * @description Returns an array of all user IDs that have active WebSocket connections
   */
  getConnectedUserIds: () => {
    if (global.authenticatedConnections) {
      return Array.from(global.authenticatedConnections.keys());
    }
    return [];
  },

  /**
   * Get detailed information about connected users
   * @returns {Array<Object>} - Array of user objects with id, email, and role
   * @description Returns detailed information about all currently connected users
   */
  getConnectedUsers: () => {
    const users = [];
    if (global.authenticatedConnections) {
      global.authenticatedConnections.forEach((client, userId) => {
        if (client.user) {
          users.push({
            id: userId,
            email: client.user.email,
            role: client.user.role
          });
        }
      });
    }
    return users;
  },

  // ========================================
  // NOTIFICATION SYSTEM
  // ========================================
  
  /**
   * Send notification to all users
   * @param {string} title - The notification title
   * @param {string} message - The notification message
   * @description Sends a notification to all connected users
   */
  sendNotification: (title, message) => {
    WebSocketController.sendToAll({
      type: 'notification',
      title: title,
      message: message
    });
  },

  /**
   * Send notification to specific user
   * @param {string} userId - The user ID to send notification to
   * @param {string} title - The notification title
   * @param {string} message - The notification message
   * @description Sends a notification to a specific user
   */
  sendUserNotification: (userId, title, message) => {
    WebSocketController.sendToUser(userId, {
      type: 'notification',
      title: title,
      message: message
    });
  },

  // ========================================
  // SYSTEM MESSAGES
  // ========================================
  
  /**
   * Send system message to all users
   * @param {string} message - The system message
   * @description Sends a system message to all connected users
   */
  sendSystemMessage: (message) => {
    WebSocketController.sendToAll({
      type: 'system',
      message: message
    });
  },

  /**
   * Send system message to specific user
   * @param {string} userId - The user ID to send system message to
   * @param {string} message - The system message
   * @description Sends a system message to a specific user
   */
  sendUserSystemMessage: (userId, message) => {
    WebSocketController.sendToUser(userId, {
      type: 'system',
      message: message
    });
  },

  // ========================================
  // CONNECTION UTILITIES
  // ========================================
  
  /**
   * Check if specific user is connected
   * @param {string} userId - The user ID to check
   * @returns {boolean} - True if user is connected and authenticated, false otherwise
   * @description Checks if a specific user has an active WebSocket connection
   */
  isUserConnected: (userId) => {
    if (global.authenticatedConnections) {
      const client = global.authenticatedConnections.get(userId);
      return client && client.readyState === 1; // WebSocket.OPEN
    }
    return false;
  },

  /**
   * Disconnect specific user (admin function)
   * @param {string} userId - The user ID to disconnect
   * @returns {boolean} - True if user was disconnected, false if not found
   * @description Forcefully disconnects a specific user from the WebSocket
   */
  disconnectUser: (userId) => {
    if (global.authenticatedConnections && global.authenticatedConnections.has(userId)) {
      const client = global.authenticatedConnections.get(userId);
      if (client.readyState === 1) {
        // Close the WebSocket connection with a normal closure code
        client.close(1000, 'Disconnected by server');
        // Remove from authenticated connections map
        global.authenticatedConnections.delete(userId);
        return true;
      }
    }
    return false;
  }
};

module.exports = WebSocketController; 