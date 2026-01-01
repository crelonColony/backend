import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["Pending", "Mentor Assigned", "Meeting Scheduled"],
    default: "Pending",
  },
  topic: { type: String, required: true },
  description: { type: String },
  scheduledTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;
