import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import { ShoppingCart, Zap, FileText, AlertCircle, Loader2, Upload, Eye, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // States for upload form
  const [file, setFile] = useState(null);
  const [medId, setMedId] = useState("");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:4000/api/prescriptions/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrescriptions(data.prescriptions);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !medId) return toast.error("Please select a file and medicine ID");

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("medicine", medId);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:4000/api/prescriptions/upload", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      toast.success("Prescription uploaded for review!");
      setFile(null);
      setMedId("");
      fetchPrescriptions();
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:4000/api/prescriptions/verify/${id}`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPrescriptions();
      toast.success(`Prescription ${status}! Item is now purchasable.`);
    } catch (error) {
      toast.error("Action failed");
    }
  };

  // Helper function to check if a specific medicine is approved for this user
  // This logic is what you will use on the Home Page/Product Cards
  const isMedicineApproved = (medicineId) => {
    return prescriptions.some(rx => 
      (rx.medicine?._id === medicineId || rx.medicine === medicineId) && 
      rx.status === 'approved'
    );
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-cyan-600" size={40} /></div>;

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-poppins">
      <Header title="Rx Approvals" />
      <div className="p-8 max-w-[1400px] mx-auto text-base">
        
        {/* UPLOAD SECTION */}
        <div className="mb-10 bg-white p-6 rounded-[2.5rem] border-2 border-dashed border-cyan-100 shadow-sm">
          <h2 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
            <Upload size={20} className="text-cyan-500" /> Upload Medical Prescription
          </h2>
          <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Enter Medicine ID (e.g. from Home Page)" 
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 outline-none"
              value={medId}
              onChange={(e) => setMedId(e.target.value)}
            />
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])}
              className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
            <button 
              disabled={uploading}
              className="bg-cyan-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-cyan-700 disabled:bg-gray-300 transition-all"
            >
              {uploading ? "Uploading..." : "Submit for Verification"}
            </button>
          </form>
        </div>

        {/* GUIDANCE BOX */}
        <div className="flex items-center gap-3 p-4 font-bold text-cyan-800 bg-cyan-50 border border-cyan-100 rounded-2xl mb-8 shadow-sm">
          <CheckCircle size={22} className="text-cyan-600" />
          <span>Once approved, the "Add to Cart" button will automatically appear for that product.</span>
        </div>

        {/* LIST SECTION */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-black text-gray-800 uppercase">Verification History</h2>
            <span className="bg-white px-4 py-1 rounded-full text-xs font-bold text-gray-400 border border-gray-100">
              {prescriptions.length} Records
            </span>
          </div>

          <div className="p-6 space-y-4">
            {prescriptions.length === 0 ? (
              <div className="text-center py-20 text-gray-400">No prescriptions found. Please upload one to unlock restricted items.</div>
            ) : (
              prescriptions.map((rx) => (
                <div key={rx._id} className="flex flex-col md:flex-row items-center justify-between p-6 border border-gray-100 rounded-[1.5rem] bg-white hover:border-cyan-200 transition-all gap-6 shadow-sm">
                  <div className="flex items-center gap-5">
                    <div className="relative group">
                      <img 
                        src={`http://localhost:4000/uploads/${rx.image}`} 
                        className="w-20 h-20 rounded-2xl object-cover border border-gray-200"
                        alt="Rx"
                      />
                      <button 
                        onClick={() => window.open(`http://localhost:4000/uploads/${rx.image}`, '_blank')}
                        className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-gray-900 text-base">RX-{rx._id.slice(-6).toUpperCase()}</span>
                      <span className="text-base font-extrabold text-cyan-600">{rx.medicine?.name || "Medicine ID: " + rx.medicine}</span>
                      <span className={`text-xs font-bold uppercase ${rx.status === 'approved' ? 'text-emerald-500' : 'text-orange-500'}`}>
                        Status: {rx.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {rx.status === "pending" ? (
                      <>
                        <button onClick={() => handleVerify(rx._id, "approved")} className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors">Verify (Admin)</button>
                        <button onClick={() => handleVerify(rx._id, "rejected")} className="px-6 py-2 border border-red-200 text-red-500 rounded-lg font-bold hover:bg-red-50">Reject</button>
                      </>
                    ) : rx.status === "approved" ? (
                      <>
                        {/* 
                           This button is now VISIBLE because status is approved. 
                           Apply this same 'rx.status === "approved"' logic to your Home Page product cards.
                        */}
                        <button className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-black">
                          <ShoppingCart size={16}/> Add to Cart
                        </button>
                        <button className="px-6 py-2 bg-cyan-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-cyan-100 hover:bg-cyan-600">
                          <Zap size={16} fill="white"/> Buy Now
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-end">
                        <span className="text-red-500 font-bold px-4 py-2 bg-red-50 rounded-lg border border-red-100">Verification Rejected</span>
                        <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Please Re-upload valid file</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;