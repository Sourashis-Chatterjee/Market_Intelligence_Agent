const express = require("express");
const { registerUser, loginUser, getMe } = require("../Controllers/userController");
const authUser = require("../Middlewares/authUser");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route — verify token and return current user
router.get("/me", authUser, getMe);

module.exports = router;
