import Medicine from "../models/medicines.js";

// ✅ CREATE MEDICINE
export const createMedicine = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      howToUse,
      safetyInfo,
      dosage,
      sideEffects,
      expiryDate,
      prescriptionRequired,
      prescriptionType,
      buyingPrice,
      sellingPrice,
      price,
      unitPrice,
      stock,
      sku,
      supplier,
      dispensedBy,
    } = req.body;

    // ✅ Fix: use req.files (upload.fields) instead of req.file (upload.single)
    const imagePath = req.files?.image?.[0]
      ? req.files.image[0].path.replace(/\\/g, "/")
      : null;

    const additionalImages = req.files?.additionalImages
      ? req.files.additionalImages.map((f) => f.path.replace(/\\/g, "/"))
      : [];

    const medicine = await Medicine.create({
      name,
      brand,
      category, // Validated against the 8 categories in your model
      description,
      howToUse,
      safetyInfo,
      dosage,
      sideEffects: sideEffects
        ? Array.isArray(sideEffects)
          ? sideEffects
          : [sideEffects]
        : [],
      expiryDate,
      prescriptionRequired:
        prescriptionRequired === "true" || prescriptionRequired === true,
      prescriptionType,
      buyingPrice: Number(buyingPrice) || 0,
      sellingPrice: Number(sellingPrice) || Number(price) || 0,
      price: Number(price) || Number(sellingPrice) || 0,
      unitPrice: Number(unitPrice) || 0,
      stock: Number(stock) || 0,
      sku,
      supplier,
      dispensedBy,
      image: imagePath,
      additionalImages,
      sellerId: req.user?._id,
    });

    res.status(201).json({
      message: "Medicine created successfully",
      medicine,
    });
  } catch (error) {
    console.error("Create Medicine Error:", error.message);
    res.status(500).json({ message: "Failed to create medicine entry" });
  }
};

// ✅ UPDATE MEDICINE
export const updateMedicine = async (req, res) => {
  try {
    const updates = { ...req.body };

    // ✅ Handle multiple file uploads during update
    if (req.files?.image?.[0]) {
      updates.image = req.files.image[0].path.replace(/\\/g, "/");
    }

    if (req.files?.additionalImages?.length > 0) {
      updates.additionalImages = req.files.additionalImages.map((f) =>
        f.path.replace(/\\/g, "/")
      );
    }

    // Convert numeric fields to prevent string errors in MongoDB
    if (updates.buyingPrice) updates.buyingPrice = Number(updates.buyingPrice);
    if (updates.sellingPrice) updates.sellingPrice = Number(updates.sellingPrice);
    if (updates.price) updates.price = Number(updates.price);
    if (updates.unitPrice) updates.unitPrice = Number(updates.unitPrice);
    if (updates.stock) updates.stock = Number(updates.stock);

    // Handle boolean conversion for prescription logic
    if (updates.prescriptionRequired !== undefined) {
      updates.prescriptionRequired =
        updates.prescriptionRequired === "true" ||
        updates.prescriptionRequired === true;
    }

    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json({
      message: "Medicine updated successfully",
      medicine,
    });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ message: "Failed to update medicine" });
  }
};

// ✅ GET ALL MEDICINES
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.status(200).json({ medicines });
  } catch (error) {
    console.error("Fetch All Error:", error.message);
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
};

// ✅ GET MEDICINE BY ID
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ medicine });
  } catch (error) {
    console.error("Fetch ID Error:", error.message);
    res.status(500).json({ message: "Error fetching item" });
  }
};

// ✅ DELETE MEDICINE
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Medicine removed from inventory" });
  } catch (error) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ message: "Delete failed" });
  }
};

// ✅ GET BY CATEGORY (Handles the 8 new categories)
export const getMedicinesByCategory = async (req, res) => {
  try {
    const medicines = await Medicine.find({ category: req.params.category });
    res.status(200).json({ medicines });
  } catch (error) {
    console.error("Category Error:", error.message);
    res.status(500).json({ message: "Category search failed" });
  }
};

// ✅ GET PRESCRIPTION ONLY
export const getPrescriptionMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ prescriptionRequired: true });
    res.status(200).json({ medicines });
  } catch (error) {
    console.error("Prescription Fetch Error:", error.message);
    res.status(500).json({ message: "Failed to fetch prescription-only items" });
  }
};