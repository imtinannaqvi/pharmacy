import Prescription from "../models/Prescription.js";
import Medicine from "../models/medicines.js";
import fs from "fs";

/**
 * @desc    Upload a new prescription (User action)
 * @route   POST /api/prescriptions/upload
 */
export const uploadPrescription = async (req, res) => {
  try {
    // 1. Check if file exists (Multer handles the storage, we check the result)
    if (!req.file) {
      return res.status(400).json({ message: "Prescription image is required." });
    }

    const { medicineId } = req.body;

    // 2. Verify medicine exists and actually requires a prescription
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      // Cleanup: delete uploaded file if medicine is invalid
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Medicine not found." });
    }

    // 3. Create the record
    const newPrescription = new Prescription({
      user: req.user.id, // Set by your auth middleware
      medicine: medicineId,
      image: req.file.filename, // Store filename to access via static route
      status: "pending",
    });

    await newPrescription.save();

    res.status(201).json({
      message: "Prescription uploaded successfully. Awaiting pharmacist review.",
      prescription: newPrescription,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Failed to process prescription upload." });
  }
};

/**
 * @desc    Get all prescriptions awaiting review (Pharmacist/Admin action)
 * @route   GET /api/prescriptions/pending
 */
export const getPendingPrescriptions = async (req, res) => {
  try {
    // Populate user and medicine details so the admin dashboard shows names, not IDs
    const pending = await Prescription.find({ status: "pending" })
      .populate("user", "name email") 
      .populate("medicine", "name brand dosage price")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      count: pending.length,
      prescriptions: pending,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching the verification queue." });
  }
};

/**
 * @desc    Approve or Reject a prescription (Pharmacist/Admin action)
 * @route   PATCH /api/prescriptions/verify/:id
 */
export const verifyPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    // 1. Validate status input
    const allowedStatuses = ["approved", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'approved' or 'rejected'." });
    }

    // 2. Update record
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      id,
      { 
        status, 
        pharmacistNote: note,
        verifiedAt: Date.now() 
      },
      { new: true }
    ).populate("medicine", "name");

    if (!updatedPrescription) {
      return res.status(404).json({ message: "Prescription record not found." });
    }

    res.status(200).json({
      message: `Prescription ${status} successfully.`,
      prescription: updatedPrescription,
    });
  } catch (error) {
    res.status(500).json({ message: "Verification process failed." });
  }
};

/**
 * @desc    Get status of a user's prescription for a specific medicine
 * @route   GET /api/prescriptions/status/:medicineId
 */
export const checkUserPrescriptionStatus = async (req, res) => {
  try {
    const { medicineId } = req.params;
    
    const prescription = await Prescription.findOne({
      user: req.user.id,
      medicine: medicineId
    }).sort({ createdAt: -1 });

    res.status(200).json(prescription || { status: "none" });
  } catch (error) {
    res.status(500).json({ message: "Error checking status." });
  }
};