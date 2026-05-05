import Medicine from "../models/medicines.js";

// ✅ CREATE MEDICINE
export const createMedicine = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      dosage,
      sideEffects,
      expiryDate,
      prescriptionRequired,
      prescriptionType,
      buyingPrice,
      sellingPrice,
      price, // Support for legacy field
      stock,
      sku,
      supplier,
    } = req.body;

    // Capture the file path from Multer (if it exists)
    // We replace backslashes with forward slashes for URL consistency
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const medicine = await Medicine.create({
      name,
      brand,
      category,
      description,
      dosage,
      sideEffects: sideEffects ? (Array.isArray(sideEffects) ? sideEffects : [sideEffects]) : [],
      expiryDate,
      prescriptionRequired: prescriptionRequired === 'true' || prescriptionRequired === true,
      prescriptionType,
      buyingPrice: Number(buyingPrice) || 0,
      sellingPrice: Number(sellingPrice) || Number(price) || 0,
      price: Number(price) || Number(sellingPrice) || 0, // Fill legacy 'price' field
      stock: Number(stock) || 0,
      sku,
      supplier,
      image: imagePath,
      sellerId: req.user?._id, // Available if 'protect' middleware is used
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

    // If a new file is uploaded, update the image path in the update object
    if (req.file) {
      updates.image = req.file.path.replace(/\\/g, "/");
    }

    // Ensure numeric fields are correctly typed
    if (updates.buyingPrice) updates.buyingPrice = Number(updates.buyingPrice);
    if (updates.sellingPrice) updates.sellingPrice = Number(updates.sellingPrice);
    if (updates.price) updates.price = Number(updates.price);
    if (updates.stock) updates.stock = Number(updates.stock);

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

// ✅ OTHER METHODS (unchanged but included for completeness)
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.status(200).json({ medicines });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
};

export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ medicine });
  } catch (error) {
    res.status(500).json({ message: "Error fetching item" });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Medicine removed from inventory" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const getMedicinesByCategory = async (req, res) => {
  try {
    const medicines = await Medicine.find({ category: req.params.category });
    res.status(200).json({ medicines });
  } catch (error) {
    res.status(500).json({ message: "Category search failed" });
  }
};

export const getPrescriptionMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ prescriptionRequired: true });
    res.status(200).json({ medicines });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch prescription-only items" });
  }
};