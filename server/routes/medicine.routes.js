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

// FIXED: Using 'auth' as the primary export, but keeping 'protect' as an alias 
// to match your medicine controller's existing logic.
import { auth as protect, adminOnly } from "../middleware/authMiddleware.js";

// FIXED: Corrected the path to match where we created the multer file.
import upload from "../middleware/multer.js";

const router = express.Router();

// ── PUBLIC ROUTES ─────────────────────────────────────────────────────────────

// Order matters: specific routes like /prescription must come BEFORE /:id
// otherwise Express will think "prescription" is an ID.
router.get("/prescription", getPrescriptionMedicines);
router.get("/category/:category", getMedicinesByCategory);
router.get("/", getAllMedicines);
router.get("/:id", getMedicineById);

// ── PROTECTED / ADMIN ROUTES ──────────────────────────────────────────────────

// Added 'adminOnly' to ensure only authorized staff can add/edit drugs.
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createMedicine
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateMedicine
);

router.delete("/:id", protect, adminOnly, deleteMedicine);

export default router;