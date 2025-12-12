// backend/controllers/authController.js
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const User = require("../models/User");

// Register
const registerUser = asyncHandler(async (req, res) => {
  let { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  if (!role) role = "user";

  const validRoles = ["user", "admin"];
  if (!validRoles.includes(role)) {
    res.status(400);
    throw new Error("Invalid role. Allowed roles: user, admin");
  }

  const userExists = await User.findByEmail(email);
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
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
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findByEmail(email);
  console.log('Login attempt for email:', email);
  console.log('User found:', user ? true : false);

  if (user) {
    const isMatch = await User.comparePassword(password, user.password);
    console.log('Password comparison result:', isMatch);
    if (isMatch) {
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user.id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Return user in same structure as login/register for consistency
  res.json({
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
