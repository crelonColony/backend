import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, unique: true, required: true }, // for subdomain
  fullName: String,
  email: String,
  phone: String,
  headline: String,
  about: String,
  education: [
    {
      degree: String,
      institution: String,
      startYear: String,
      endYear: String,
    },
  ],
  experience: [
    {
      role: String,
      company: String,
      startYear: String,
      endYear: String,
      responsibilities: String,
    },
  ],
  skills: [String],
  projects: [
    {
      title: String,
      description: String,
      link: String,
    },
  ],
  profileImage: { type: String },
  resumePDF: { type: String }, // generated file link
}, { timestamps: true });

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;
