import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import workshopRoutes from "./routes/workshopRoutes.js";

import sessionRoutes from "./routes/sessionRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import weeklyReportRoutes from "./routes/weeklyReportRoutes.js";

import http from "http";
import { Server } from "socket.io";

// 👉 Import your WebSocket handler
// import socketHandler from "./websocket/chat.js";

dotenv.config();

// ------------------------------------------------
// 1) CREATE APP FIRST (important!)
// ------------------------------------------------
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect DB
connectDB();

// ------------------------------------------------
// File path setup
// ------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static uploads folder
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use("/uploads", express.static(uploadsPath));

// ------------------------------------------------
// 2) ROUTES
// ------------------------------------------------
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/reports", weeklyReportRoutes);

// Google credential check
const keyPath = path.join(__dirname, "crelon-c5846b53bf59.json");
if (fs.existsSync(keyPath)) {
  const credentials = JSON.parse(fs.readFileSync(keyPath, "utf8"));
  console.log("Google credentials loaded successfully");
} else {
  console.warn("⚠️ Missing Google API credentials file");
}

// ------------------------------------------------
// 3) CREATE HTTP SERVER (required for WebSockets)
// ------------------------------------------------
const server = http.createServer(app);

// ------------------------------------------------
// 4) CREATE SOCKET.IO SERVER
// ------------------------------------------------
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

// Load your socket functions
// socketHandler(io);

// ------------------------------------------------
// 5) START SERVER WITH server.listen() (IMPORTANT)
// ------------------------------------------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server + WebSockets running on port ${PORT}`);
});
