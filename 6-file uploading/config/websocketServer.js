// ========================================
// WEBSOCKET SERVER CONFIGURATION
// ========================================
// This file handles WebSocket server setup, authentication, and connection management

const WebSocket = require("ws");
const jwt = require("jsonwebtoken"); // Required for JWT token verification

/**
 * Initialize WebSocket server with authentication
 * @param {Object} server - HTTP server instance
 * @returns {Object} - Object containing WebSocket server and connections
 */
const initializeWebSocketServer = (server) => {
  // Create WebSocket server attached to HTTP server
  const wss = new WebSocket.Server({ server });

  // Store authenticated WebSocket connections
  // Map structure: userId -> WebSocket connection
  // This allows us to send messages to specific users
  const authenticatedConnections = new Map();

  // Handle new WebSocket connections
  wss.on("connection", (ws) => {
    console.log("New WebSocket connection established");

    // Immediately request authentication from the client
    // This prevents unauthorized access to the WebSocket
    ws.send(
      JSON.stringify({
        type: "auth_required",
        message: "Authentication required. Send your JWT token.",
      })
    );

    // Handle incoming messages from the client
    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data);
        console.log("Received WebSocket message:", message);
        // ========================================
        // AUTHENTICATION HANDLING
        // ========================================
        if (message.type === "auth" && message.token) {
          try {
            // Verify the JWT token using the same secret as the REST API
            const decoded = jwt.verify(message.token, process.env.JWT_SECRET);

            // Store user information on the WebSocket connection
            ws.userId = decoded.userId;
            ws.user = decoded;

            // Add the authenticated connection to our map
            authenticatedConnections.set(decoded.userId, ws);

            // Send success response to client (include username)
            ws.send(
              JSON.stringify({
                type: "auth_success",
                message: "Authentication successful",
                user: {
                  id: decoded.userId,
                  email: decoded.email,
                  username: decoded.username,
                  role: decoded.role,
                },
              })
            );

            console.log(
              `User ${decoded.email} successfully authenticated via WebSocket`
            );
          } catch (error) {
            // Token verification failed
            ws.send(
              JSON.stringify({
                type: "auth_error",
                message: "Invalid token",
              })
            );
            console.log("WebSocket authentication failed:", error.message);
          }
          return; // Exit early after authentication attempt
        }

        // ========================================
        // MESSAGE HANDLING FOR AUTHENTICATED USERS
        // ========================================

        // Only allow authenticated users to send other types of messages
        if (!ws.userId) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Authentication required before sending messages",
            })
          );
          return;
        }

        // Echo the message back to the authenticated user
        // This is a simple example - you can implement custom message handling here
        ws.send(
          JSON.stringify({
            type: "echo",
            data: message,
            username: ws.user?.username,
            timestamp: new Date().toISOString(),
          })
        );
      } catch (error) {
        // Handle JSON parsing errors
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Invalid message format - JSON required",
          })
        );
      }
    });

    // ========================================
    // CONNECTION CLEANUP
    // ========================================

    // Handle WebSocket disconnection
    ws.on("close", () => {
      if (ws.userId) {
        // Remove the user from authenticated connections
        authenticatedConnections.delete(ws.userId);
        console.log(`User ${ws.userId} disconnected from WebSocket`);
      }
      console.log("WebSocket connection closed");
    });
  });

  // ========================================
  // GLOBAL ACCESS FOR CONTROLLERS
  // ========================================

  // Make WebSocket server and authenticated connections available globally
  // This allows other parts of the application to send messages via WebSocket
  global.wss = wss;
  global.authenticatedConnections = authenticatedConnections;

  console.log("WebSocket server initialized with authentication");
  console.log(
    "WebSocket authentication is enabled - clients must provide JWT token"
  );

  return {
    wss,
    authenticatedConnections,
  };
};

module.exports = {
  initializeWebSocketServer,
};
