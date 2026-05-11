import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // --- Account Status ---
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    
    // --- Personal Details ---
    accountType: { type: String, enum: ["Prescriber", "Practitioner"], required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    dob: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },

    // --- Prescriber / Practitioner Credentials ---
    professionalRole: { type: String }, // e.g., Doctor, Dentist, Pharmacist
    registrationNumber: { type: String }, // GMC/GDC/NMC number
    primarySpeciality: { type: String }, // Dermatology, Cosmetic, etc.
    trainingQualification: { type: String }, // For non-prescribers

    // --- Practice / Business Details ---
    practiceName: { type: String },
    businessAddress: { type: String },
    vatNumber: { type: String },
    referralSource: { type: String }, // How did you hear about us?

    // --- Declarations ---
    agreedToTerms: { type: Boolean, required: true },
    isAuthorisedProfessional: { type: Boolean, required: true },

    // --- Auth Logic ---
    otp: { type: String },
    otpExpire: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;