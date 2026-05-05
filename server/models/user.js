import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name:                { type: String, required: true },
    email:               { type: String, required: true, unique: true },
    password:            { type: String, required: true, select: false },
    isVerified:          { type: Boolean, default: false },
    isApproved:          { type: Boolean, default: false }, // ✅ admin must approve
    role:                { type: String, enum: ["user", "admin"], default: "user" },
    otp:                 { type: String },
    otpExpire:           { type: Date },
    resetPasswordToken:  { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

// This safe check prevents the OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;