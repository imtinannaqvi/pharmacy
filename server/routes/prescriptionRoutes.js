import express from "express";
import { 
  uploadPrescription, 
  getPendingPrescriptions, 
  verifyPrescription, 
  checkUserPrescriptionStatus 
} from "../controllers/prescription.controller.js"; // Path to your controller
import upload from "../middleware/multer.js"; // Path to your Multer file
import { auth, adminOnly } from "../middleware/authMiddleware.js"; // Your auth logic

const router = express.Router();

// 1. User uploads a prescription for a medicine
router.post("/upload", auth, upload.single("image"), uploadPrescription);

// 2. Admin/Pharmacist gets the list of pending reviews
router.get("/pending", auth, adminOnly, getPendingPrescriptions);

// 3. Admin/Pharmacist approves or rejects
router.patch("/verify/:id", auth, adminOnly, verifyPrescription);

// 4. Frontend checks if a user is allowed to buy a specific medicine
router.get("/status/:medicineId", auth, checkUserPrescriptionStatus);

export default router;