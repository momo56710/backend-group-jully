const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { uploadSingleImage } = require("../middleware/uplaodImage");
const verifyToken = require("../middleware/verifyToken");
router.get("/", getAllUsers);
router.get("/me", verifyToken, getUserById);
router.post("/login", loginUser);
router.post("/", uploadSingleImage("avatar"), createUser);
// router.get("/:id", getUserById);
router.put("/", verifyToken, updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
