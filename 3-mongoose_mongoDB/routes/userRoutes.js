const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Create a new user
router.post('/', createUser);

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

module.exports = router; 