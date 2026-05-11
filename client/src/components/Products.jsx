import { useState, useEffect } from "react";
import API from "../api/axios"; 
import Header from "./Header";
import { ImagePlus, Trash2, Edit, ShoppingCart, FileText, X } from "lucide-react"; 
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

const Products = () => {
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null); 
  const [addingToCart, setAddingToCart] = useState(null); 
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Additional images state
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  // --- NEW CATEGORIES LIST ---
  const categories = [
    "Botulinum Toxins",
    "Dermal Fillers",
    "Skin Boosters",
    "Fat Dissolvers",
    "Mesotherapy",
    "Anesthetics",
    "Skincare",
    "Consumables"
  ];

  // --- NEW FILTER STATE ---
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "Botulinum Toxins",
    description: "",
    howToUse: "",
    safetyInfo: "",
    prescriptionRequired: false,
    unitPrice: "",
    dispensedBy: "",
    dosage: "",
    buyingPrice: "",
    sellingPrice: "",
    stock: "",
    expiryDate: "",
    sku: "",
    supplier: ""
  });

  const fetchProducts = async () => {
    try {
      const response = await API.get("/medicines"); 
      const data = Array.isArray(response.data) 
        ? response.data 
        : (response.data.medicines || []);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- FILTERED PRODUCTS LOGIC ---
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = async (product) => {
    if (!product._id) {
      toast.error("Invalid product.");
      return;
    }
    if (addingToCart === product._id) return;

    setAddingToCart(product._id);
    try {
      await addToCart(product);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Add to cart error:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Failed to add item to cart.");
    } finally {
      setAddingToCart(null);
    }
  };

  const handleEdit = (product) => {
    setSelectedId(product._id);
    setFormData({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "Botulinum Toxins",
      description: product.description || "",
      howToUse: product.howToUse || "",
      safetyInfo: product.safetyInfo || "",
      prescriptionRequired: product.prescriptionRequired || false,
      unitPrice: product.unitPrice || product.sellingPrice || "",
      dispensedBy: product.dispensedBy || "",
      dosage: product.dosage || "",
      buyingPrice: product.buyingPrice || "",
      sellingPrice: product.sellingPrice || product.price || "",
      stock: product.stock || "",
      expiryDate: product.expiryDate ? product.expiryDate.split('T')[0] : "",
      sku: product.sku || "",
      supplier: product.supplier || ""
    });

    if (product.image) {
      setPreviewUrl(`http://localhost:4000/${product.image}`);
    }

    if (product.additionalImages && Array.isArray(product.additionalImages)) {
      const existingPreviews = product.additionalImages.map(
        (img) => `http://localhost:4000/${img}`
      );
      setAdditionalPreviews(existingPreviews);
    } else {
      setAdditionalPreviews([]);
    }

    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this product from inventory?")) {
      try {
        await API.delete(`/medicines/${id}`);
        setProducts(products.filter((p) => p._id !== id));
        toast.success("Product removed from inventory");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete product.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAdditionalFiles = (e) => {
    const files = Array.from(e.target.files);
    if (additionalPreviews.length + files.length > 3) {
      toast.error("Maximum 3 additional images allowed");
      return;
    }
    
    setAdditionalImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setAdditionalPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeAdditionalImage = (index) => {
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
    setAdditionalImages(prev => prev.filter((_, i) => i !== (index - (additionalPreviews.length - additionalImages.length))));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    data.set("buyingPrice", Number(formData.buyingPrice));
    data.set("sellingPrice", Number(formData.sellingPrice));
    data.set("price", Number(formData.sellingPrice));
    data.set("stock", Number(formData.stock));

    if (imageFile) {
      data.append("image", imageFile); 
    }

    additionalImages.forEach((file) => {
      data.append("additionalImages", file);
    });

    try {
      const token = localStorage.getItem("token");
      const config = { 
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}` 
        } 
      };

      if (selectedId) {
        const response = await API.put(`/medicines/${selectedId}`, data, config);
        const updatedProduct = response.data.medicine || response.data;
        setProducts(products.map(p => p._id === selectedId ? updatedProduct : p));
        toast.success("Product updated successfully");
      } else {
        const response = await API.post("/medicines", data, config);
        const newProduct = response.data.medicine || response.data;
        setProducts(prev => [...prev, newProduct]);
        toast.success("Product added to inventory");
      }
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMsg = error.response?.status === 401 
        ? "Unauthorized: Please log in again." 
        : "Error saving: Check all numeric fields.";
      toast.error(errorMsg);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
    setImageFile(null);
    setPreviewUrl(null);
    setAdditionalImages([]);
    setAdditionalPreviews([]);
    setFormData({
      name: "", brand: "", category: "Botulinum Toxins", description: "",
      howToUse: "", safetyInfo: "", prescriptionRequired: false,
      unitPrice: "", dispensedBy: "",
      dosage: "", buyingPrice: "", sellingPrice: "", stock: "",
      expiryDate: "", sku: "", supplier: ""
    });
  };

  const calculateMargin = () => {
    if (!formData.buyingPrice || !formData.sellingPrice) return 0;
    const profit = formData.sellingPrice - formData.buyingPrice;
    return ((profit / formData.sellingPrice) * 100).toFixed(1);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen relative font-poppins">
      <Header title="Products" />
      <div className="p-8 max-w-[1600px] mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              💊 Inventory Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {products.length} active medical listings
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-cyan-500 text-white rounded-xl text-sm font-bold hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-100 flex items-center gap-2"
          >
            <span className="text-lg">+</span> Add New Product
          </button>
        </div>

        {/* --- NEW CATEGORY FILTER BAR --- */}
        <div className="flex gap-2 overflow-x-auto pb-6 mb-4 no-scrollbar">
          <button 
            onClick={() => setSelectedCategory("All")}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === "All" ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-100' : 'bg-white text-gray-400 border border-gray-100'}`}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-100' : 'bg-white text-gray-400 border border-gray-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[#8a99af] text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                <th className="py-5 px-6">Product Details</th>
                <th className="py-5 px-6">Category</th>
                <th className="py-5 px-6">Pricing (GBP)</th>
                <th className="py-5 px-6">Margin</th>
                <th className="py-5 px-6">Stock Status</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-20 font-bold italic text-gray-400">Syncing with API...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-20 font-bold italic text-gray-400">No products found in this category.</td>
                </tr>
              ) : filteredProducts.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
                        {item.image ? (
                          <img src={`http://localhost:4000/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">📦</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-gray-900 text-sm">{item.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{item.sku || "NO-SKU-ASSIGNED"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[10px] bg-cyan-50 text-cyan-600 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider">{item.category}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold italic">Cost: £{item.buyingPrice || 0}</span>
                      <span className="text-sm font-black text-gray-900">Sale: £{item.sellingPrice || item.price}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-xs font-black ${item.buyingPrice ? 'text-green-600' : 'text-gray-300'}`}>
                      {item.buyingPrice ? (((item.sellingPrice - item.buyingPrice) / item.sellingPrice) * 100).toFixed(0) : 0}%
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-full ${item.stock > 5 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {item.stock} Units
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleAddToCart(item)} disabled={addingToCart === item._id} className={`p-2 rounded-lg transition-all ${addingToCart === item._id ? 'text-gray-300 cursor-not-allowed' : 'text-green-500 hover:bg-green-50'}`}>
                        {addingToCart === item._id ? <span className="text-xs font-bold">...</span> : <ShoppingCart size={18}/>}
                      </button>
                      <button onClick={() => handleEdit(item)} className="p-2 text-cyan-500 hover:bg-cyan-50 rounded-lg transition-all"><Edit size={18}/></button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-5xl p-10 shadow-2xl overflow-y-auto max-h-[95vh]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                {selectedId ? "Modify Medicine Record" : "New Inventory Entry"}
              </h2>
              <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition-all">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">
              <div className="w-full lg:w-5/12 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Main Product View</label>
                  <div 
                    onClick={() => document.getElementById('imageInput').click()}
                    className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center hover:border-cyan-400 transition-all group cursor-pointer overflow-hidden relative"
                  >
                    {previewUrl ? (
                      <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="text-center">
                        <ImagePlus className="text-gray-300 group-hover:text-cyan-400 transition-colors mb-2 mx-auto" size={48} />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-cyan-500">Attach Main Image</span>
                      </div>
                    )}
                    <input id="imageInput" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Additional Angles (Max 3)</label>
                    <div className="grid grid-cols-3 gap-3">
                        {additionalPreviews.map((url, idx) => (
                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                                <img src={url} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
                                <button type="button" onClick={() => removeAdditionalImage(idx)} className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        {additionalPreviews.length < 3 && (
                            <button 
                                type="button" 
                                onClick={() => document.getElementById('additionalImagesInput').click()}
                                className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center hover:border-cyan-400 transition-all text-gray-300 hover:text-cyan-400"
                            >
                                <ImagePlus size={24} />
                                <input id="additionalImagesInput" type="file" accept="image/*" multiple className="hidden" onChange={handleAdditionalFiles} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">General Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-cyan-400 rounded-xl px-4 py-3 text-sm outline-none transition-all font-bold min-h-[100px]" placeholder="Detailed product info..."/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">How to Use</label>
                    <textarea name="howToUse" value={formData.howToUse} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-cyan-400 rounded-xl px-4 py-3 text-sm outline-none transition-all font-bold min-h-[80px]" placeholder="Usage instructions..."/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Safety & Warnings</label>
                    <textarea name="safetyInfo" value={formData.safetyInfo} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-cyan-400 rounded-xl px-4 py-3 text-sm outline-none transition-all font-bold min-h-[80px]" placeholder="Safety warnings..."/>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-7/12 space-y-6">
                <div className="bg-gray-50/50 p-6 rounded-[1.5rem] border border-gray-100 space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Product Name</label>
                      <input name="name" required value={formData.name} onChange={handleChange} className="w-full bg-white border-2 border-transparent focus:border-cyan-400 rounded-xl px-4 py-3 text-sm outline-none transition-all font-bold" placeholder="e.g. Neuramis Deep"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">SKU</label>
                      <input name="sku" required value={formData.sku} onChange={handleChange} className="w-full bg-white border-2 border-transparent focus:border-cyan-400 rounded-xl px-4 py-3 text-sm outline-none transition-all font-bold" placeholder="BATCH-001"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Category</label>
                      <select name="category" required value={formData.category} onChange={handleChange} className="w-full bg-white border-2 border-transparent focus:border-cyan-400 rounded-xl px-4 py-3 text-sm outline-none transition-all font-bold">
                        {/* --- UPDATED DYNAMIC OPTIONS --- */}
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-3 pt-5 pl-2">
                      <input type="checkbox" name="prescriptionRequired" id="prescriptionRequired" checked={formData.prescriptionRequired} onChange={handleChange} className="w-5 h-5 accent-cyan-500 rounded cursor-pointer" />
                      <label htmlFor="prescriptionRequired" className="text-xs font-black text-gray-700 uppercase cursor-pointer flex items-center gap-2"><FileText size={14} className="text-red-500" /> Prescription Required?</label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Unit Price (£)</label>
                      <input name="unitPrice" type="number" step="0.01" required value={formData.unitPrice} onChange={handleChange} className="w-full bg-white border-2 border-transparent focus:border-cyan-400 rounded-xl px-4 py-3 text-sm outline-none transition-all font-bold" placeholder="0.00" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Supplied By</label>
                      <input name="supplier" required value={formData.supplier} onChange={handleChange} className="w-full bg-white border-2 border-transparent focus:border-cyan-400 rounded-xl px-4 py-3 text-sm outline-none transition-all font-bold" placeholder="Wholesaler Name" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Dispensed By</label>
                      <input name="dispensedBy" required value={formData.dispensedBy} onChange={handleChange} className="w-full bg-white border-2 border-transparent focus:border-cyan-400 rounded-xl px-4 py-3 text-sm outline-none transition-all font-bold" placeholder="Pharmacist" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Manufacturer/Brand</label>
                    <input name="brand" required value={formData.brand} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-cyan-400 rounded-xl px-4 py-3 text-sm outline-none transition-all font-bold" placeholder="e.g. Hugel Pharma"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Expiration</label>
                    <input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-cyan-400 rounded-xl px-4 py-3 text-sm outline-none transition-all font-bold"/>
                  </div>
                </div>

                <div className="bg-cyan-50/40 p-6 rounded-[1.5rem] border border-cyan-100">
                  <h3 className="text-[10px] font-black uppercase text-cyan-600 mb-4 tracking-[0.2em]">Financial Audit</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500">Purchase (£)</label>
                      <input name="buyingPrice" type="number" step="0.01" required value={formData.buyingPrice} onChange={handleChange} className="w-full bg-white border border-cyan-100 rounded-xl px-4 py-3 text-sm outline-none font-black" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500">Retail (£)</label>
                      <input name="sellingPrice" type="number" step="0.01" required value={formData.sellingPrice} onChange={handleChange} className="w-full bg-white border border-cyan-100 rounded-xl px-4 py-3 text-sm outline-none font-black" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500">Est. Margin</label>
                      <div className="w-full bg-white border border-cyan-100 rounded-xl px-4 py-3 text-sm font-black text-green-600 text-center">{calculateMargin()}%</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Current Stock</label>
                    <input name="stock" type="number" required value={formData.stock} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-cyan-400 rounded-xl px-4 py-3 text-sm outline-none transition-all font-bold" placeholder="Units available" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Dosage/Strength</label>
                    <input name="dosage" value={formData.dosage} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-cyan-400 rounded-xl px-4 py-3 text-sm outline-none transition-all font-bold" placeholder="e.g. 100 Units" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 py-4 text-gray-400 font-bold hover:text-gray-600 transition-all uppercase text-[10px] tracking-widest">Discard Changes</button>
                  <button type="submit" className="flex-[2] py-4 bg-cyan-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-600 transition-all shadow-xl shadow-cyan-100">{selectedId ? "Commit Updates" : "Add to Inventory"}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;