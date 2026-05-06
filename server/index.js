import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

// ── Route Imports ────────────────────────────────────────────────────────────
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import medicineRoutes from "./routes/medicine.routes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js"; 
import cartRoutes from "./routes/cart.routes.js";

dotenv.config();

const app = express();

// ── Directory Setup ──────────────────────────────────────────────────────────
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ── CORS (Updated for Preflight Handling) ────────────────────────────────────
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(express.json());
// Adding URL encoded parser to help with form-data if needed
app.use(express.urlencoded({ extended: true }));

// Serve the uploads folder
app.use("/uploads", express.static("uploads"));

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.send("API Running..."));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/prescriptions", prescriptionRoutes); 
app.use("/api/cart", cartRoutes);

// ── DB Connection ─────────────────────────────────────────────────────────────
// Ensure your MONGODB_URI in .env ends with /pharmacy to match your Compass DB
let isConnecting = false;

const connectDB = async (retries = 5) => {
  if (isConnecting) return;
  isConnecting = true;

  for (let i = 1; i <= retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log("✅ MongoDB Connected Successfully");
      isConnecting = false;
      return;
    } catch (err) {
      console.error(`MongoDB attempt ${i}/${retries} failed:`, err.message);
      if (i === retries) {
        isConnecting = false;
        setTimeout(() => connectDB(), 30000);
        return;
      }
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
};

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Global Error Log:", err.stack); // Cites error details to your terminal
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
// Add this after your existing routes
// app.get("/clear-carts", async (req, res) => {
//   await mongoose.connection.collection("carts").deleteMany({});
//   res.json({ message: "Carts cleared!" });
// });

// TEMPORARY - DELETE AFTER USE
// app.get("/approve-user/:email", async (req, res) => {
//   const User = (await import("./models/User.js")).default;
//   const user = await User.findOneAndUpdate(
//     { email: req.params.email },
//     { isVerified: true, isApproved: true, role: "admin" },
//     { new: true }
//   );
//   res.json({ message: "User approved!", user });
// });

// TEMPORARY - DELETE AFTER USE
// app.get("/fix-user/:email", async (req, res) => {
//   try {
//     const User = (await import("./models/User.js")).default;
//     const bcrypt = (await import("bcryptjs")).default;
//     const hashed = await bcrypt.hash("Test1234", 10);
//     const user = await User.findOneAndUpdate(
//       { email: req.params.email },
//       { 
//         isVerified: true, 
//         isApproved: true, 
//         role: "admin",
//         password: hashed
//       },
//       { new: true }
//     );
//     if (!user) return res.json({ message: "User not found!" });
//     res.json({ message: "Fixed!", email: user.email, role: user.role });
//   } catch(e) {
//     res.json({ error: e.message });
//   }
// });
// TEMPORARY - DELETE AFTER USE
// app.get("/reset-pass", async (req, res) => {
//   try {
//     const bcryptjs = (await import("bcryptjs")).default;
//     const UserModel = (await import("./models/User.js")).default;
//     const hashed = await bcryptjs.hash("Admin1234", 10);
//     const user = await UserModel.findOneAndUpdate(
//       { email: "alex2@gmail.com" },
//       { password: hashed, isVerified: true, isApproved: true, role: "admin" },
//       { new: true }
//     );
//     if (!user) return res.json({ error: "User not found in DB!" });
//     res.json({ ok: true, email: user.email, role: user.role });
//   } catch(e) {
//     res.json({ error: e.message });
//   }
// });
// ── Start Server ──────────────────────────────────────────────────────────────
connectDB().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});