import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";

// ── Route Imports ─────────────────────────────────────────────────────────────
import authRoutes         from "./routes/auth.route.js";
import userRoutes         from "./routes/user.route.js";
import medicineRoutes     from "./routes/medicine.routes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import cartRoutes         from "./routes/cart.routes.js";
import PrescriberRoutes   from "./routes/prescriberRoutes.js";

dotenv.config();

const app = express();

// ── Directory Setup ───────────────────────────────────────────────────────────
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin:         "http://localhost:5173",
  credentials:    true,
  methods:        ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.send("API Running..."));

app.use("/api/auth",            authRoutes);
app.use("/api/users",           userRoutes);
app.use("/api/medicines",       medicineRoutes);
app.use("/api/prescriptions",   prescriptionRoutes);  // ✅ Fix: was never mounted
app.use("/api/prescriber-link", PrescriberRoutes);
app.use("/api/cart",            cartRoutes);

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Global Error Log:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ── DB + Start Server ─────────────────────────────────────────────────────────
let isConnecting = false;

const connectDB = async (retries = 5) => {
  if (isConnecting) return;
  isConnecting = true;
  for (let i = 1; i <= retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
      console.log("✅ MongoDB Connected Successfully");
      isConnecting = false;
      return;
    } catch (err) {
      console.error(`MongoDB attempt ${i}/${retries} failed:`, err.message);
      if (i === retries) { isConnecting = false; setTimeout(() => connectDB(), 30000); return; }
      await new Promise(res => setTimeout(res, 3000));
    }
  }
};

connectDB().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});