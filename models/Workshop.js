import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  trainer: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  type: { type: String, enum: ["free", "paid"], default: "free" },
  price: { type: Number, default: 0 },
  registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  image: { type: String },
}, { timestamps: true });

const Workshop = mongoose.model("Workshop", workshopSchema);
export default Workshop;
