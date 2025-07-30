// ========================================
// WEBSOCKET ROUTES WITH AUTHENTICATION
// ========================================
// These routes provide HTTP endpoints to interact with the WebSocket server
// All routes require authentication via JWT token in Authorization header

const express = require("express");
const router = express.Router();
const WebSocketController = require("../controllers/websocketController");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel"); // Import User model

// Apply authentication middleware to all routes
// This ensures only authenticated users can access WebSocket management endpoints
router.use(authMiddleware);

// ========================================
// BROADCAST MESSAGING ENDPOINTS
// ========================================

/**
 * POST /websocket/broadcast
 * Send broadcast message to all connected users
 * Requires: message in request body
 * Authentication: Required (JWT token)
 */
router.post("/broadcast", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required"
    });
  }

  // Send message to all authenticated WebSocket users
  WebSocketController.sendToAll(message);
  res.json({
    success: true,
    message: "Broadcast message sent",
    data: {
      message,
      timestamp: new Date().toISOString()
    }
  });
});

// ========================================
// PRIVATE MESSAGING ENDPOINTS
// ========================================

/**
 * POST /websocket/send-to-user
 * Send private message to specific user
 * Requires: userId or username and message in request body
 * Authentication: Required (JWT token)
 */
router.post("/send-to-user", async (req, res) => {
  const { userId, username, message } = req.body;
  let targetUserId = userId;

  // If username is provided, look up the userId
  if (!targetUserId && username) {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      targetUserId = user._id.toString();
    } catch (err) {
      return res.status(500).json({ success: false, message: "Error looking up user by username" });
    }
  }

  if (!targetUserId || !message) {
    return res.status(400).json({
      success: false,
      message: "User ID or username and message are required"
    });
  }

  // Attempt to send message to specific user
  const sent = WebSocketController.sendToUser(targetUserId, message);
  if (sent) {
    res.json({
      success: true,
      message: "Message sent to user",
      data: {
        userId: targetUserId,
        message,
        timestamp: new Date().toISOString()
      }
    });
  } else {
    res.status(404).json({
      success: false,
      message: "User not connected or not found"
    });
  }
});

/**
 * POST /websocket/send-to-users
 * Send message to multiple specific users
 * Requires: userIds array and message in request body
 * Authentication: Required (JWT token)
 */
router.post("/send-to-users", (req, res) => {
  const { userIds, message } = req.body;
  if (!userIds || !Array.isArray(userIds) || !message) {
    return res.status(400).json({
      success: false,
      message: "User IDs array and message are required"
    });
  }

  // Send message to multiple users and get delivery results
  const results = WebSocketController.sendToUsers(userIds, message);
  res.json({
    success: true,
    message: "Messages sent to users",
    data: {
      results,
      message,
      timestamp: new Date().toISOString()
    }
  });
});

// ========================================
// ROLE-BASED MESSAGING ENDPOINTS
// ========================================

/**
 * POST /websocket/send-to-role
 * Send message to users by role
 * Requires: role and message in request body
 * Authentication: Required (JWT token)
 */
router.post("/send-to-role", (req, res) => {
  const { role, message } = req.body;
  if (!role || !message) {
    return res.status(400).json({
      success: false,
      message: "Role and message are required"
    });
  }

  // Send message to all users with specified role
  const results = WebSocketController.sendToRole(role, message);
  res.json({
    success: true,
    message: `Message sent to ${results.length} users with role ${role}`,
    data: {
      results,
      role,
      message,
      timestamp: new Date().toISOString()
    }
  });
});

// ========================================
// NOTIFICATION ENDPOINTS
// ========================================

/**
 * POST /websocket/notification
 * Send notification to all users
 * Requires: title and message in request body
 * Authentication: Required (JWT token)
 */
router.post("/notification", (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) {
    return res.status(400).json({
      success: false,
      message: "Title and message are required"
    });
  }

  // Send notification to all connected users
  WebSocketController.sendNotification(title, message);
  res.json({
    success: true,
    message: "Notification sent to all users",
    data: {
      title,
      message,
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * POST /websocket/user-notification
 * Send notification to specific user
 * Requires: userId, title, and message in request body
 * Authentication: Required (JWT token)
 */
router.post("/user-notification", (req, res) => {
  const { userId, title, message } = req.body;
  if (!userId || !title || !message) {
    return res.status(400).json({
      success: false,
      message: "User ID, title and message are required"
    });
  }

  // Send notification to specific user
  WebSocketController.sendUserNotification(userId, title, message);
  res.json({
    success: true,
    message: "Notification sent to user",
    data: {
      userId,
      title,
      message,
      timestamp: new Date().toISOString()
    }
  });
});

// ========================================
// SYSTEM MESSAGE ENDPOINTS
// ========================================

/**
 * POST /websocket/system-message
 * Send system message to all users
 * Requires: message in request body
 * Authentication: Required (JWT token)
 */
router.post("/system-message", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required"
    });
  }

  // Send system message to all connected users
  WebSocketController.sendSystemMessage(message);
  res.json({
    success: true,
    message: "System message sent to all users",
    data: {
      message,
      timestamp: new Date().toISOString()
    }
  });
});

// ========================================
// CONNECTION MANAGEMENT ENDPOINTS
// ========================================

/**
 * GET /websocket/connected-users
 * Get information about all connected users
 * Authentication: Required (JWT token)
 * Returns: List of connected users with their details
 */
router.get("/connected-users", (req, res) => {
  const users = WebSocketController.getConnectedUsers();
  const count = WebSocketController.getConnectedClientsCount();
  
  res.json({
    success: true,
    data: {
      count,
      users
    }
  });
});

/**
 * GET /websocket/user-connected/:userId
 * Check if specific user is connected
 * Authentication: Required (JWT token)
 * Returns: Connection status for the specified user
 */
router.get("/user-connected/:userId", (req, res) => {
  const { userId } = req.params;
  const isConnected = WebSocketController.isUserConnected(userId);
  
  res.json({
    success: true,
    data: {
      userId,
      isConnected
    }
  });
});

/**
 * POST /websocket/disconnect-user
 * Disconnect specific user (admin only)
 * Requires: userId in request body
 * Authentication: Required (JWT token + admin role)
 * Description: Forcefully disconnects a user from WebSocket
 */
router.post("/disconnect-user", (req, res) => {
  const { userId } = req.body;
  
  // Check if current user has admin privileges
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  }

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  // Attempt to disconnect the user
  const disconnected = WebSocketController.disconnectUser(userId);
  if (disconnected) {
    res.json({
      success: true,
      message: "User disconnected successfully",
      data: {
        userId,
        timestamp: new Date().toISOString()
      }
    });
  } else {
    res.status(404).json({
      success: false,
      message: "User not connected or not found"
    });
  }
});

// ========================================
// STATISTICS ENDPOINTS
// ========================================

/**
 * GET /websocket/stats
 * Get WebSocket server statistics
 * Authentication: Required (JWT token)
 * Returns: Connection statistics and user IDs
 */
router.get("/stats", (req, res) => {
  const count = WebSocketController.getConnectedClientsCount();
  const userIds = WebSocketController.getConnectedUserIds();
  
  res.json({
    success: true,
    data: {
      connectedUsers: count,
      connectedUserIds: userIds,
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router; 