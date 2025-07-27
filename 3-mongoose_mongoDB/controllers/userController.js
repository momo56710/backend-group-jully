const User = require("../models/User");
const bcrypt = require("bcrypt");

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check if user already exists

    const user = new User({ name, username, email, password });
    await user.save();

    // Don't send password in response
    const userResponse = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };

    res.status(201).json(userResponse);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "User with this email or username already exists" });
    } else {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password -email -username");
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
