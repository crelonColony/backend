import mongoose from "mongoose";

const weeklyReportSchema = new mongoose.Schema({
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Internship",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  weekNumber: { type: Number, required: true },
  description: { type: String },
  file: { type: String }, // path to uploaded PDF/DOC
}, { timestamps: true });

const WeeklyReport = mongoose.model("WeeklyReport", weeklyReportSchema);
export default WeeklyReport;
