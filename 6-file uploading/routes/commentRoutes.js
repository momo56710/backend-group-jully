const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { uploadMultipleFiles } = require("../middlewares/uploadMiddleware");

// GET /comments - Get all comments with search and pagination
router.get("/", commentController.getAllComments);

// GET /comments/:id - Get comment by ID
router.get("/:id", commentController.getCommentById);

// POST /comments - Create new comment
router.post("/", uploadMultipleFiles("attachments", 5), commentController.createComment);

// PUT /comments/:id - Update comment
router.put("/:id", uploadMultipleFiles("attachments", 5), commentController.updateComment);

// DELETE /comments/:id - Delete comment
router.delete("/:id", commentController.deleteComment);

module.exports = router;
