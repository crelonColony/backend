import Workshop from "../models/Workshop.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create Workshop
export const createWorkshop = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/workshops/${req.file.filename}`;
    const workshop = await Workshop.create(data);
    res.status(201).json(workshop);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get All
export const getAllWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find().sort({ createdAt: -1 });
    res.json(workshops);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get Latest (limit 3)
export const getLatestWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find().sort({ createdAt: -1 }).limit(3);
    res.json(workshops);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update Workshop
export const updateWorkshop = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = `/uploads/workshops/${req.file.filename}`;
    const updated = await Workshop.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete Workshop
export const deleteWorkshop = async (req, res) => {
  try {
    const deleted = await Workshop.findByIdAndDelete(req.params.id);
    res.json({ msg: "Workshop deleted", deleted });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Register Student
export const registerWorkshop = async (req, res) => {
  try {
    const workshopId = req.params.id;
    const userId = req.user._id;
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) return res.status(404).json({ msg: "Workshop not found" });
    if (workshop.registeredStudents.includes(userId)) {
      return res.status(400).json({ msg: "Already registered" });
    }

    workshop.registeredStudents.push(userId);
    await workshop.save();

    const user = await User.findById(userId);

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Team Crelon" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Registration Successful for ${workshop.title}`,
      html: `
        <h2>Hi ${user.name},</h2>
        <p>You’ve successfully registered for the workshop: <b>${workshop.title}</b></p>
        <p>Date: ${new Date(workshop.date).toLocaleDateString()}</p>
        <p>Location: ${workshop.location || "Online"}</p>
      `,
    });

    res.status(200).json({ msg: "Successfully registered & email sent!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
