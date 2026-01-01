import Session from "../models/Session.js";
import User from "../models/User.js";

// Student books a session
export const bookSession = async (req, res) => {
  try {
    const { topic, description } = req.body;
    const studentId = req.user._id;

    const session = await Session.create({
      student: studentId,
      topic,
      description,
      status: "Pending",
    });

    res.status(201).json({ msg: "Session request submitted!", session });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Admin assigns a mentor to session
export const assignMentor = async (req, res) => {
  try {
    const { mentorId } = req.body;
    const { id } = req.params; // session id

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ msg: "Session not found" });

    session.mentor = mentorId;
    session.status = "Mentor Assigned";
    await session.save();

    res.status(200).json({ msg: "Mentor assigned successfully!", session });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Admin schedules a meeting time
export const scheduleMeeting = async (req, res) => {
  try {
    const { time } = req.body;
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ msg: "Session not found" });

    session.scheduledTime = time;
    session.status = "Meeting Scheduled";
    await session.save();

    res.status(200).json({ msg: "Meeting scheduled successfully!", session });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all sessions for admin
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("student", "name email")
      .populate("mentor", "name email");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get student’s sessions
export const getStudentSessions = async (req, res) => {
  try {
    const studentId = req.user._id;
    const sessions = await Session.find({ student: studentId })
      .populate("mentor", "name email")
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all sessions assigned to a mentor
export const getMentorSessions = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "No mentor authentication" });
    }

    console.log("Mentor ID:", req.user._id); // debugging line

    const sessions = await Session.find({ mentor: req.user._id })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    console.error("💥 Error loading mentor sessions:", error);
    res.status(500).json({ msg: "Internal error fetching mentor sessions" });
  }
};
