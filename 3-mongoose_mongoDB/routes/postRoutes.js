const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByAuthor,
  updatePost,
  deletePost
} = require('../controllers/postController');

// Create a new post
router.post('/', createPost);

// Get all posts
router.get('/', getAllPosts);

// Get post by ID
router.get('/:id', getPostById);

// Get posts by author
router.get('/author/:authorId', getPostsByAuthor);

// Update post
router.put('/:id', updatePost);

// Delete post
router.delete('/:id', deletePost);

module.exports = router; 