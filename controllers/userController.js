import User from "../models/User.js";
import Profile from "../models/Profile.js";
// Delete user



export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Create mentor/member
export const createUser = async (req, res) => {
  const { name, email, password, contact, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const user = await User.create({ name, email, password, contact, role });
    await Profile.create({ user: user._id });

    res.status(201).json({ msg: `${role} created successfully`, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.role = role;
    await user.save();
    res.json({ msg: `Role updated to ${role}` });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const getMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: "mentor" }).select("_id name email");
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};