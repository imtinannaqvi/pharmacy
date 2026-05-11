import express from "express";
import {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getMedicinesByCategory,
  getPrescriptionMedicines,
} from "../controllers/medicine.controller.js";

import { auth as protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// ── PUBLIC ROUTES ─────────────────────────────────────────────────────────────
router.get("/prescription", getPrescriptionMedicines);
router.get("/category/:category", getMedicinesByCategory);
router.get("/", getAllMedicines);
router.get("/:id", getMedicineById);

// ── PROTECTED / ADMIN ROUTES ──────────────────────────────────────────────────

// ✅ Fix: upload.fields() instead of upload.single() to accept both image and additionalImages
router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 3 },
  ]),
  createMedicine
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 3 },
  ]),
  updateMedicine
);

router.delete("/:id", protect, adminOnly, deleteMedicine);

export default router;