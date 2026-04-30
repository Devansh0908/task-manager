const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required. Set it in your environment variables.");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

const sendAuthResponse = (res, user, statusCode) => {
  const token = createToken(user._id);

  res.status(statusCode).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      projects: user.projects
    }
  });
};

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  if (role && !["admin", "member"].includes(role)) {
    return res.status(400).json({ message: "Role must be admin or member" });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return res.status(400).json({ message: "A user with that email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "member"
  });

  sendAuthResponse(res, user, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  sendAuthResponse(res, user, 200);
});

module.exports = { signup, login };
