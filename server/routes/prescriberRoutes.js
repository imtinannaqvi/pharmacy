import express from "express";
const router = express.Router(); // <--- This line was missing or broken

import {
  searchPrescribers,
  sendLinkRequest,
  getActiveLinks,
  submitPrescriptionRequest,
  // Admin Controllers
  getAdminPendingLinks,
  getAdminPrescriptionRequests,
  verifyLink,
  verifyPrescriptionRequest
} from "../controllers/prescriberController.js";

import { auth, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

// --- USER ROUTES ---
// Regular users can search, link, and submit
router.get("/search", auth, searchPrescribers);
router.post("/link", auth, sendLinkRequest);
router.get("/active-links", auth, getActiveLinks);
router.post("/request-prescription", auth, upload.single("consentFile"), submitPrescriptionRequest);

// --- ADMIN ONLY ROUTES ---
// Only Admin role can access these endpoints to see and pass data
router.get("/admin/pending", auth, adminOnly, getAdminPendingLinks);
router.get("/admin/requests", auth, adminOnly, getAdminPrescriptionRequests);
router.patch("/admin/verify-link/:id", auth, adminOnly, verifyLink);
router.patch("/admin/verify-request/:id", auth, adminOnly, verifyPrescriptionRequest);

export default router;