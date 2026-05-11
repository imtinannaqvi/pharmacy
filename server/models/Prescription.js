import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientDetails: {
      firstName: { type: String },
      lastName:  { type: String },
      gender:    { type: String },
      dob:       { type: Date },
      email:     { type: String },
      phone:     { type: String },
      address:   { type: String },
      allergies: { type: String },
    },

    // ✅ Fix: nested object, NOT String
    prescriberDetails: {
      name:       { type: String },
      regNumber:  { type: String },
      type:       { type: String },
      clinicName: { type: String },
    },

    medications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
      },
    ],

    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
    },

    image: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    method: {
      type: String,
      enum: ["upload", "form"],
      default: "form",
    },

    pharmacistNote: {
      type: String,
    },

    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Prescription", prescriptionSchema);