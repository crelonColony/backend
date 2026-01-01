import User from "../models/User.js";
import Profile from "../models/Profile.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // 👈 include role
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ==============================
// Register User (default = student → role: null)
// ==============================
export const register = async (req, res) => {
  const { name, email, password, contact } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    // Create user (role will be null by default)
    const user = await User.create({ name, email, password, contact });

    // Automatically create an empty profile
    await Profile.create({ user: user._id });

    const token = generateToken(user);

    res.status(201).json({
      token,
      name: user.name,
      email: user.email,
      contact: user.contact,
      role: user.role, // will be null
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ==============================
// Login User (Role-based)
// ==============================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ msg: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ msg: "Invalid password" });

    const token = generateToken(user);

    res.json({
      token,
      name: user.name,
      email: user.email,
      contact: user.contact,
      role: user.role, // 👈 include role here
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// controllers/authController.js
export const logout = async (req, res) => {
  try {
    // Since JWTs are stateless, logout is handled on client
    res.status(200).json({ msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
