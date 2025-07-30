const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");
const { uploadMultipleImages } = require("../middlewares/uploadMiddleware");

// GET /posts - Get all posts with search and pagination
router.get("/", postController.getAllPosts);

// GET /posts/:id - Get post by ID
router.get("/:id", authMiddleware, postController.getPostById);

// POST /posts - Create new post
router.post("/", uploadMultipleImages("images", 10), postController.createPost);

// PUT /posts/:id - Update post
router.put("/:id", authMiddleware, uploadMultipleImages("images", 10), postController.updatePost);

// DELETE /posts/:id - Delete post
router.delete("/:id", postController.deletePost);

module.exports = router;
