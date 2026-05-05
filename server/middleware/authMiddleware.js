import jwt from "jsonwebtoken";
import User from "../models/user.js";

// General Authentication
export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Admin/Pharmacist Authorization (The missing export)
export const adminOnly = (req, res, next) => {
  // Checks for admin status or pharmacist role
  if (req.user && (req.user.isAdmin || req.user.role === "admin" || req.user.role === "pharmacist")) {
    next();
  } else {
    res.status(403).json({ 
      message: "Access denied. Only pharmacists or admins can perform this action." 
    });
  }
};