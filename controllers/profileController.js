import Profile from "../models/Profile.js";
import fs from "fs";
import path from "path";

// Get current user's profile
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ msg: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update profile (including image)
export const updateProfile = async (req, res) => {
  try {
    const data = { ...req.body };

    // If file uploaded
    if (req.file) {
      data.profileImage = req.file.path.replace("\\", "/"); // path for frontend
    }

    // Convert JSON fields from string to arrays/objects
    if (data.skills) data.skills = JSON.parse(data.skills);
    if (data.projects) data.projects = JSON.parse(data.projects);
    if (data.socialLinks) data.socialLinks = JSON.parse(data.socialLinks);

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      data,
      { new: true, runValidators: true }
    );

    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete profile
export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ user: req.user.id });
    if (profile && profile.profileImage) {
      // Delete image from uploads folder
      fs.unlink(profile.profileImage, (err) => {
        if (err) console.error("Failed to delete image:", err);
      });
    }
    res.json({ msg: "Profile deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
