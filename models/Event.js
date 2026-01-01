import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  type: { type: String, enum: ["free", "paid"], default: "free" },
  price: { type: Number, default: 0 },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  image: { type: String },

  groupRoomId: { type: String },
    registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
export default Event;
