import WeeklyReport from "../models/WeeklyReport.js";
import Internship from "../models/internship.js";
import dotenv from "dotenv";
dotenv.config();

// Submit weekly report
export const submitWeeklyReport = async (req, res) => {
  try {
    const { internshipId, weekNumber, description } = req.body;
    const studentId = req.user._id;

    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ msg: "Internship not found" });

    // Save file info if uploaded
    const reportData = {
      internship: internshipId,
      student: studentId,
      weekNumber,
      description,
    };
    if (req.file) reportData.file = `/uploads/reports/${req.file.filename}`;

    const report = await WeeklyReport.create(reportData);
    res.status(201).json({ msg: "Report submitted successfully!", report });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get student's own reports
export const getStudentReports = async (req, res) => {
  try {
    const studentId = req.user._id;
    const reports = await WeeklyReport.find({ student: studentId })
      .populate("internship", "title company")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// Get all weekly reports (Admin only)
export const getAllReports = async (req, res) => {
  try {
    const reports = await WeeklyReport.find()
      .populate("student", "name email")
      .populate("internship", "title company mentor")
      .sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
