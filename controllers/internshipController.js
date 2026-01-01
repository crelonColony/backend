import User from "../models/User.js";
import Internship from "../models/internship.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Admin: Create
export const createInternship = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/internships/${req.file.filename}`;
    const internship = await Internship.create(data);
    res.status(201).json(internship);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all internships
export const getAllInternships = async (req, res) => {
  try {
    const userId = req.user?._id; // Extract current user ID from token
    const internships = await Internship.find().populate("applicants", "_id name email");

    const modifiedInternships = internships.map((internship) => ({
      ...internship.toObject(),
      isApplied: internship.applicants.some(
        (applicant) => applicant._id.toString() === userId.toString()
      ),
    }));

    res.json(modifiedInternships);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get latest 3
export const getLatestInternships = async (req, res) => {
  try {
    const latest = await Internship.find().sort({ createdAt: -1 }).limit(3);
    res.json(latest);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update
export const updateInternship = async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.image = `/uploads/internships/${req.file.filename}`;
    const result = await Internship.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!result) return res.status(404).json({ msg: "Not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete
export const deleteInternship = async (req, res) => {
  try {
    const deleted = await Internship.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Internship not found" });
    res.json({ msg: "Internship deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// aplied Internship
export const getAppliedInternships = async (req, res) => {
  try {
    const userId = req.user._id; // current logged-in student
    const appliedInternships = await Internship.find({
      applicants: userId,
    }).populate("mentor", "name email");

    res.status(200).json(appliedInternships);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// Apply
export const applyInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ msg: "Internship not found" });

    const userId = req.user._id;
    if (internship.applicants.includes(userId))
      return res.status(400).json({ msg: "Already applied" });

    internship.applicants.push(userId);
    await internship.save();

    const user = await User.findById(userId);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: `"Internship Portal" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Applied for ${internship.title}`,
      html: `<p>Hello ${user.name}, your application for ${internship.title} at ${internship.company} was received successfully.</p>`
    });

    res.json({ msg: "Application successful and email sent." });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
