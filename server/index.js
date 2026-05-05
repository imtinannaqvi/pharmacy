import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";

// ── Route Imports ────────────────────────────────────────────────────────────
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import medicineRoutes from "./routes/medicine.routes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js"; // New Prescription Routes

dotenv.config();

const app = express();

// ── Directory Setup ──────────────────────────────────────────────────────────
// Ensures the 'uploads' folder exists on server start to avoid ENOENT errors
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(express.json());

// Serve the uploads folder so images are accessible via URL
// Example: http://localhost:4000/uploads/1714830000.jpg
app.use("/uploads", express.static("uploads"));

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.send("Medico Guidance API Running..."));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/prescriptions", prescriptionRoutes); // Registering the Prescription Logic

// ── DB Connection ─────────────────────────────────────────────────────────────
let isConnecting = false;

const connectDB = async (retries = 5) => {
  if (isConnecting) return;
  isConnecting = true;

  for (let i = 1; i <= retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
      });
      console.log("✅ MongoDB Connected Successfully");
      isConnecting = false;
      return;
    } catch (err) {
      console.error(`MongoDB attempt ${i}/${retries} failed:`, err.message);
      if (i === retries) {
        console.error("All retries exhausted. Will retry in 30s...");
        isConnecting = false;
        setTimeout(() => connectDB(), 30000);
        return;
      }
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
};

// ── Global Error Handler ──────────────────────────────────────────────────────
// Catches any unhandled errors and prevents the server from crashing
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ── Start Server ──────────────────────────────────────────────────────────────
connectDB().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});