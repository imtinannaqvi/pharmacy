import Prescription from "../models/Prescription.js";
import Medicine from "../models/medicines.js";
import fs from "fs";

export const submitPrescription = async (req, res) => {
  try {
    let { patient, prescriber, medications } = req.body;

    if (!patient || !medications || medications.length === 0) {
      return res.status(400).json({ message: "Patient details and at least one medication are required." });
    }

    if (typeof prescriber === "string") {
      try { prescriber = JSON.parse(prescriber); } catch { prescriber = {}; }
    }
    if (typeof patient === "string") {
      try { patient = JSON.parse(patient); } catch { patient = {}; }
    }

    const newPrescription = new Prescription({
      user:              req.user.id,
      patientDetails:    patient,
      prescriberDetails: prescriber,
      medications:       medications.map((med) => med._id || med),
      status:            "pending",
      method:            "form",
    });

    await newPrescription.save();

    res.status(201).json({
      success: true,
      message: "Prescription submitted successfully for approval!",
      prescription: newPrescription,
    });
  } catch (error) {
    console.error("Submit Error:", error);
    res.status(500).json({ message: "Server error during prescription submission." });
  }
};

export const uploadPrescription = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Prescription image is required." });
    const { medicineId } = req.body;
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Medicine not found." });
    }
    const newPrescription = new Prescription({ user: req.user.id, medicine: medicineId, image: req.file.filename, status: "pending", method: "upload" });
    await newPrescription.save();
    res.status(201).json({ message: "Prescription uploaded successfully.", prescription: newPrescription });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Failed to process prescription upload." });
  }
};

export const getPendingPrescriptions = async (req, res) => {
  try {
    const pending = await Prescription.find({ status: "pending" }).populate("user", "name email").populate("medicine", "name brand dosage price").sort({ createdAt: -1 });
    res.status(200).json({ count: pending.length, prescriptions: pending });
  } catch (error) {
    res.status(500).json({ message: "Error fetching the verification queue." });
  }
};

export const verifyPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid status." });
    const updated = await Prescription.findByIdAndUpdate(id, { status, pharmacistNote: note, verifiedAt: Date.now() }, { new: true }).populate("medicine", "name");
    if (!updated) return res.status(404).json({ message: "Prescription not found." });
    res.status(200).json({ message: `Prescription ${status} successfully.`, prescription: updated });
  } catch (error) {
    res.status(500).json({ message: "Verification process failed." });
  }
};

export const checkUserPrescriptionStatus = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const prescription = await Prescription.findOne({ user: req.user.id, $or: [{ medicine: medicineId }, { medications: medicineId }] }).sort({ createdAt: -1 });
    res.status(200).json(prescription || { status: "none" });
  } catch (error) {
    res.status(500).json({ message: "Error checking status." });
  }
};