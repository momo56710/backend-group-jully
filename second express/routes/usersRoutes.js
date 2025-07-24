const fs = require("fs");
const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
} = require("../controllers/usersControllers");
const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);

module.exports = router;
