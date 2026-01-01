import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, default: "" },
  tagline: { type: String, default: "" },
  role: { type: String, default: "" },
  bio: { type: String, default: "" },
  address: { type: String, default: "" },
  dob: { type: String, default: "" },
  profileImage: { type: String, default: "" }, // filename of uploaded image
  skills: { type: [String], default: [] },
  projects: {
    type: [{ title: String, link: String }],
    default: [],
  },
  socialLinks: {
    type: [{ platform: String, url: String }],
    default: [],
  },
});

export default mongoose.model("Profile", profileSchema);
