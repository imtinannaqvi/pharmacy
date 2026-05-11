import jwt from "jsonwebtoken";
import User from "../models/User.js";

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

// Admin Only Authorization
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "Access denied. Admins only.",
    });
  }
};

// Admin or Pharmacist Authorization
export const adminOrPharmacist = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "pharmacist")) {
    next();
  } else {
    res.status(403).json({
      message: "Access denied. Only admins or pharmacists can perform this action.",
    });
  }
};
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};