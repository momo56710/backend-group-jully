const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const { uploadSingleImage } = require("../middlewares/uploadMiddleware");

// Public routes
// POST /users/login - Login user
router.post("/login", userController.loginUser);

// Protected routes - require authentication
// GET /users - Get all users (Admin only)
router.get("/", authMiddleware, userController.getAllUsers);

// POST /users - Create new user
router.post("/", uploadSingleImage("avatar"), userController.createUser);

// GET /users/me - Get current user
router.get("/me", authMiddleware, userController.getCurrentUser);

// GET /users/:id - Get user by ID
router.get("/:id", authMiddleware, userController.getUserById);
// PUT /users/:id - Update user
router.put("/:id", authMiddleware, uploadSingleImage("avatar"), userController.updateUser);

// DELETE /users/:id - Delete user (Admin only)
router.delete("/:id", authMiddleware, userController.deleteUser);

module.exports = router;
