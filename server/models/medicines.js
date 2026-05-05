import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    // Medical Info
    dosage: {
      type: String, // e.g. "500mg", "1 tablet twice daily"
    },

    sideEffects: [
      {
        type: String,
      },
    ],

    expiryDate: {
      type: Date,
      required: false, // Set to true if you want to enforce medical safety
    },

    // Prescription Logic
    prescriptionRequired: {
      type: Boolean,
      default: false,
    },

    prescriptionType: {
      type: String,
      enum: ["none", "optional", "required"],
      default: "none",
    },

    // Financial & Inventory Tracking
    buyingPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    // Legacy support for 'price' (mapped to sellingPrice)
    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    sku: {
      type: String,
      trim: true,
      unique: true, // Recommended for inventory systems
      sparse: true, // Allows multiple null values if SKU isn't provided
    },

    supplier: {
      type: String,
      trim: true,
    },

    // Images
    image: {
      type: String,
    },

    // Seller / Owner
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true }, // Ensure virtuals are included when sending to frontend
    toObject: { virtuals: true } 
  }
);

/**
 * Virtual field to calculate profit margin percentage
 * Usage: medicine.profitMargin
 */
medicineSchema.virtual("profitMargin").get(function () {
  if (!this.buyingPrice || !this.sellingPrice) return 0;
  const profit = this.sellingPrice - this.buyingPrice;
  return ((profit / this.sellingPrice) * 100).toFixed(2);
});

const Medicine =
  mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);

export default Medicine;