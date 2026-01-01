import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";

// Create or update student portfolio
export const savePortfolio = async (req, res) => {
  try {
    const data = { ...req.body, user: req.user._id };
    const existing = await Portfolio.findOne({ user: req.user._id });
    const portfolio = existing
      ? await Portfolio.findByIdAndUpdate(existing._id, data, { new: true })
      : await Portfolio.create(data);

    res.status(200).json({ msg: "Portfolio saved successfully", portfolio });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Public view by username (custom domain simulation)
export const getPortfolioByUsername = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ username: req.params.username });
    if (!portfolio) return res.status(404).json({ msg: "Portfolio not found" });
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Generate Resume (PDF)
export const generateResumePDF = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) return res.status(404).json({ msg: "Portfolio not found" });

    const doc = new PDFDocument();
    const filePath = path.join("uploads/resumes", `${portfolio.username}.pdf`);
    if (!fs.existsSync("uploads/resumes")) fs.mkdirSync("uploads/resumes", { recursive: true });
    doc.pipe(fs.createWriteStream(filePath));

    // Simple template
    doc.fontSize(22).text(portfolio.fullName, { align: "center" }).moveDown();
    doc.fontSize(14).text(`Email: ${portfolio.email}`).text(`Phone: ${portfolio.phone}`).moveDown();
    doc.text("About Me").moveDown(0.5);
    doc.fontSize(12).text(portfolio.about || "No description available").moveDown();

    doc.text("Education:");
    portfolio.education.forEach((edu) =>
      doc.text(`- ${edu.degree}, ${edu.institution} (${edu.startYear}-${edu.endYear})`)
    );

    doc.moveDown().text("Skills:");
    doc.text(portfolio.skills.join(", ")).moveDown();

    doc.text("Projects:");
    portfolio.projects.forEach(p => {
      doc.text(`- ${p.title} (${p.link || "N/A"})`);
      doc.fontSize(11).text(p.description);
      doc.moveDown();
    });

    doc.end();

    portfolio.resumePDF = `/uploads/resumes/${portfolio.username}.pdf`;
    await portfolio.save();

    res.status(200).json({ msg: "Resume generated!", resume: portfolio.resumePDF });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

