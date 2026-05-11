import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
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
      // Fixed 8 Categories strictly enforced via enum
      enum: [
        "Botulinum Toxins",
        "Dermal Fillers",
        "Skin Boosters",
        "Fat Dissolvers",
        "Mesotherapy",
        "Anesthetics",
        "Skincare",
        "Consumables"
      ]
    },
    description: {
      type: String,
    },
    // --- UPDATED FIELDS ---
    howToUse: {
      type: String,
      trim: true,
    },
    safetyInfo: {
      type: String,
      trim: true,
    },
    additionalImages: [
      {
        type: String,
      },
    ],
    // ----------------------
    dosage: {
      type: String,
    },
    sideEffects: [
      {
        type: String,
      },
    ],
    expiryDate: {
      type: Date,
      required: false,
    },
    prescriptionRequired: {
      type: Boolean,
      default: false,
    },
    prescriptionType: {
      type: String,
      enum: ["none", "optional", "required"],
      default: "none",
    },
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
      unique: true, 
      sparse: true,
    },
    supplier: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
  }
);

medicineSchema.virtual("profitMargin").get(function () {
  if (!this.buyingPrice || !this.sellingPrice) return 0;
  const profit = this.sellingPrice - this.buyingPrice;
  return ((profit / this.sellingPrice) * 100).toFixed(2);
});

const Medicine = mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);

export default Medicine;