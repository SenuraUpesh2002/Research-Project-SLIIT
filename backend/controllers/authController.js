// backend/controllers/authController.js
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const User = require("../models/User");

// Register
const registerUser = asyncHandler(async (req, res) => {
  let { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    const error = new Error("Name, email, and password are required");
    error.statusCode = 400;
    throw error;
  }

  if (!role) role = "user";

  const validRoles = ["user", "admin"];
  if (!validRoles.includes(role)) {
    const error = new Error("Invalid role");
    error.statusCode = 400;
    throw error;
  }

  const userExists = await User.findByEmail(email);
  if (userExists) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create(name, email, password, role);

  res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user.id),
  });
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByEmail(email);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await User.comparePassword(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user.id),
  });
});

// Profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
