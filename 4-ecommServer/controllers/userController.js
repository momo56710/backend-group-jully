const User = require("../models/userModal");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email");
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const user = await User.create({ name, email, address });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        runValidators: true,
        new: true,
      }
    );
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
