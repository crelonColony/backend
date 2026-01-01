import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String },
  duration: { type: String },
  location: { type: String },
  type: { type: String, enum: ["free", "stipend"], default: "free" },
  stipend: { type: Number, default: 0 },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  image: { type: String },
}, { timestamps: true });

const Internship = mongoose.model("Internship", internshipSchema);
export default Internship;
