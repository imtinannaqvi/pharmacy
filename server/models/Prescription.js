import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  image: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  pharmacistNote: String,
  verifiedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

// Create the model
const Prescription = mongoose.model("Prescription", prescriptionSchema);

// CRITICAL: This line must be exactly like this for the import to work
export default Prescription;