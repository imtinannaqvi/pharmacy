import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.send("Server running..."));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ── DB Connection ─────────────────────────────────────────────────────────────
let isConnecting = false;

const connectDB = async (retries = 5) => {
  if (isConnecting) return;
  isConnecting = true;

  for (let i = 1; i <= retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS:          45000,
        connectTimeoutMS:         10000,
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

mongoose.connection.on("disconnected", () => {
  if (!isConnecting) {
    console.warn("MongoDB disconnected — retrying in 5s...");
    setTimeout(() => connectDB(), 5000);
  }
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err.message);
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection stable ✓");
});

// ── Start Server ──────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(4000, () => console.log("🚀 Server running on port 4000"));
});