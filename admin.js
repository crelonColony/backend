import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const email = "admin@12.com";      // 👈 your admin email
  const password = "Admin123";           // 👈 your admin password
  const name = "Admin";
  const contact = "1234567890";

  // Check if admin already exists
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists");
    mongoose.disconnect();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = new User({
    name,
    email,
    password: hashedPassword,
    contact,
    role: "admin",   // 👈 set role as admin
  });

  await admin.save();
  console.log("Admin user created!");
  mongoose.disconnect();
};

run();
