const connectDb = require("./config/db");
const express = require("express");
const http = require("http");
const { initializeWebSocketServer } = require("./config/websocketServer");
const usersRoutes = require("./routes/usersRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const websocketRoutes = require("./routes/websocketRoutes");
const cors = require('cors');
require("dotenv").config();

const app = express();
const server = http.createServer(app);

connectDb();

app.use(express.json());
// app.use(express.static("uploads"));
app.use(cors({
  origin: "*",
  methods: "*",
  allowedHeaders: "*",
  exposedHeaders: "*",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Routes
app.use("/users", usersRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/categories", categoryRoutes);
app.use("/websocket", websocketRoutes);
app.use("/uploads", express.static("uploads"));
// Default route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Blog API",
    endpoints: {
      users: "/users",
      posts: "/posts", 
      comments: "/comments",
      categories: "/categories",
    }
  });
});

// ========================================
// WEBSOCKET SERVER INITIALIZATION
// ========================================

// Initialize WebSocket server with authentication
// This sets up the WebSocket server and makes it available globally
initializeWebSocketServer(server);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  console.log(`WebSocket server is ready on ws://localhost:${process.env.PORT}`);
});
