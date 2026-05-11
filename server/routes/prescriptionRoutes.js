import express from "express";
import {
  uploadPrescription,
  getPendingPrescriptions,
  verifyPrescription,
  checkUserPrescriptionStatus,
  submitPrescription,
} from "../controllers/prescription.controller.js";
import upload from "../middleware/multer.js";
import { auth, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Fix: use 'auth' not 'protect' — matches your authMiddleware export
router.post("/upload-consent", auth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ url: req.file.path.replace(/\\/g, "/"), path: req.file.path.replace(/\\/g, "/") });
});

router.post("/submit",          auth,             submitPrescription);
router.post("/upload",          auth, upload.single("image"), uploadPrescription);
router.get("/pending",          auth, adminOnly,  getPendingPrescriptions);
router.patch("/verify/:id",     auth, adminOnly,  verifyPrescription);
router.get("/status/:medicineId", auth,           checkUserPrescriptionStatus);

export default router;