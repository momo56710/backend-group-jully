const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModal");
require("dotenv").config();
const getAllUsers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    })
      .select("name email avatar")
      .skip(skip)
      .limit(limit)
      .sort({ email: 1 });
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);
    res.status(200).json({
      message: "Users fetched successfully",
      users,
      pagination: {
        totalPages,
        totalUsers,
        currentPage: page,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
const createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      address,
      password: hashedPassword,
      role,
      avatar: req.file ? req.file.path : "/uploads/users/default.png",
    });
    res.status(201).json({ message: "User created successfully", user });
    console.log(user);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        message: "User already exists",
        error: "email must be unique",
      });
    } else {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
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
      req.user.userId,
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
  loginUser,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
