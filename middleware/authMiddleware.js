import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userId = decoded.id || decoded.userId;
      if (!userId) return res.status(401).json({ msg: "Invalid token payload" });

      const user = await User.findById(userId).select("-password");
      if (!user) return res.status(404).json({ msg: "User not found" });

      req.user = user; // attach user object
      next();
    } catch (err) {
      console.error("JWT Verification Failed:", err.message);
      return res.status(401).json({ msg: "Unauthorized, invalid token" });
    }
  } else {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: "Not authorized" });
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Admins only" });
  next();
};

export const mentorOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: "Not authorized" });
  if (req.user.role !== "mentor") return res.status(403).json({ msg: "Mentors only" });
  next();
};
