import { useState } from "react";
import axios from "axios";
import {
  User, Stethoscope, FileText, Search, Plus, Trash2,
  CheckCircle, Loader2, AlertCircle, Pill, Truck
} from "lucide-react";
import { toast } from "react-hot-toast";

const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="flex flex-col gap-1.5 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-0.5">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors" />
      )}
      <input
        {...props}
        autoComplete="off"
        className={`w-full ${Icon ? "pl-9" : "pl-3.5"} pr-3.5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm text-slate-800 placeholder:text-slate-300 font-medium`}
      />
    </div>
  </div>
);

const SectionCard = ({ icon: Icon, title, color, children }) => {
  const colors = {
    cyan:    { bg: "bg-cyan-500",    light: "bg-cyan-50",    text: "text-cyan-600",    border: "border-cyan-100" },
    emerald: { bg: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
    violet:  { bg: "bg-violet-500",  light: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-100" },
    amber:   { bg: "bg-amber-500",   light: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100" },
    orange:  { bg: "bg-orange-500",  light: "bg-orange-50",  text: "text-orange-600",  border: "border-orange-100" },
  };
  const c = colors[color] || colors.cyan;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className={`px-5 py-4 border-b ${c.border} flex items-center gap-3`}>
        <div className={`w-8 h-8 rounded-xl ${c.light} ${c.text} flex items-center justify-center`}>
          <Icon size={16} />
        </div>
        <h2 className="text-sm font-black text-slate-800 tracking-tight">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

const Prescriptions = () => {
  const [submitting, setSubmitting] = useState(false);
  const initialState = {
    patient:     { firstName: "", lastName: "", gender: "Male", dob: "", email: "", phone: "", address: "", allergies: "", contraindications: "" },
    prescriber:  { name: "", regNumber: "", type: "Doctor", clinicName: "", clinicalNotes: "" },
    medications: [],
    // Added new fields to state
    delivery:    { fulfillmentMethod: "Ship direct to the address", deliveryAddress: "", validity: "27 days" }
  };
  const [formData, setFormData]       = useState(initialState);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching]     = useState(false);

  const handlePatientChange    = (f, v) => setFormData(p => ({ ...p, patient:    { ...p.patient,    [f]: v } }));
  const handlePrescriberChange = (f, v) => setFormData(p => ({ ...p, prescriber: { ...p.prescriber, [f]: v } }));
  const handleDeliveryChange   = (f, v) => setFormData(p => ({ ...p, delivery:    { ...p.delivery,    [f]: v } }));

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      setSearching(true);
      try {
        const { data } = await axios.get(`http://localhost:4000/api/medicines?search=${query}`);
        setSearchResults(data.medicines || []);
      } catch { setSearchResults([]); }
      finally { setSearching(false); }
    } else {
      setSearchResults([]);
    }
  };

  const addMedication = (med) => {
    if (formData.medications.find(m => m._id === med._id)) return toast.error("Already added");
    setFormData(p => ({ ...p, medications: [...p.medications, med] }));
    toast.success(`${med.name} added`);
    setSearchQuery(""); setSearchResults([]);
  };

  const removeMedication = (id) => setFormData(p => ({ ...p, medications: p.medications.filter(m => m._id !== id) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.medications.length) return toast.error("Add at least one medication");
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:4000/api/prescriptions/submit", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      toast.success("Prescription submitted successfully!");
      setFormData(initialState); setSearchQuery(""); setSearchResults([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed.");
    } finally { setSubmitting(false); }
  };

  const selectClass = "w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-800 font-medium outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all";

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-16">

      {/* Page Header */}
      <div className="bg-white border-b border-slate-100 px-8 py-5 mb-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">New Prescription</h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Fill in patient, prescriber, and medication details</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl">
            <AlertCircle size={13} className="text-amber-500" />
            <span className="text-[11px] font-bold text-amber-600">Pending Approval</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-6 space-y-5">

        {/* Row 1: Patient + Prescriber */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Patient Details */}
          <SectionCard icon={User} title="Patient Details" color="cyan">
            <div className="grid grid-cols-2 gap-3">
              <InputField label="First Name"   value={formData.patient.firstName} onChange={e => handlePatientChange("firstName", e.target.value)} placeholder="John"   required />
              <InputField label="Last Name"    value={formData.patient.lastName}  onChange={e => handlePatientChange("lastName",  e.target.value)} placeholder="Smith"  required />

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Gender</label>
                <select value={formData.patient.gender} onChange={e => handlePatientChange("gender", e.target.value)} className={selectClass}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>

              <InputField label="Date of Birth" type="date" value={formData.patient.dob} onChange={e => handlePatientChange("dob", e.target.value)} required />

              <div className="col-span-2">
                <InputField label="Email" type="email" value={formData.patient.email} onChange={e => handlePatientChange("email", e.target.value)} placeholder="patient@email.com" required />
              </div>
              <div className="col-span-2">
                <InputField label="Phone" type="tel" value={formData.patient.phone} onChange={e => handlePatientChange("phone", e.target.value)} placeholder="+44 7700 000000" required />
              </div>
              <div className="col-span-2">
                <InputField label="Address" value={formData.patient.address} onChange={e => handlePatientChange("address", e.target.value)} placeholder="123 Main Street, London" required />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-0.5">Allergies / Contraindications</label>
                <textarea
                  value={formData.patient.contraindications}
                  onChange={e => handlePatientChange("contraindications", e.target.value)}
                  placeholder="e.g. Penicillin, NSAIDs, Latex..."
                  rows={2}
                  className="w-full px-3.5 py-3 bg-red-50/40 border border-red-100 rounded-xl outline-none focus:border-red-300 focus:ring-2 focus:ring-red-300/10 text-sm text-slate-800 font-medium placeholder:text-slate-300 transition-all resize-none"
                />
              </div>
            </div>
          </SectionCard>

          {/* Right column */}
          <div className="space-y-5">

            {/* Prescriber */}
            <SectionCard icon={Stethoscope} title="Prescriber Details" color="emerald">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <InputField label="Full Name" value={formData.prescriber.name} onChange={e => handlePrescriberChange("name", e.target.value)} placeholder="Dr. Sarah Connor" required />
                </div>
                <InputField label="Reg. Number" value={formData.prescriber.regNumber} onChange={e => handlePrescriberChange("regNumber", e.target.value)} placeholder="GMC-12345" required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Type</label>
                  <select value={formData.prescriber.type} onChange={e => handlePrescriberChange("type", e.target.value)} className={selectClass}>
                    <option>Doctor</option>
                    <option>Medical Dentist</option>
                    <option>Nurse Prescriber</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <InputField label="Clinic / Practice Name" value={formData.prescriber.clinicName} onChange={e => handlePrescriberChange("clinicName", e.target.value)} placeholder="City Health Clinic" required />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-0.5">Clinical Notes <span className="normal-case font-medium">(optional)</span></label>
                  <textarea
                    value={formData.prescriber.clinicalNotes}
                    onChange={e => handlePrescriberChange("clinicalNotes", e.target.value)}
                    placeholder="Any additional clinical notes or instructions..."
                    rows={2}
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 text-sm text-slate-800 font-medium placeholder:text-slate-300 transition-all resize-none"
                  />
                </div>
              </div>
            </SectionCard>

            {/* Medications Search */}
            <SectionCard icon={Pill} title="Medications" color="violet">
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                {searching && <Loader2 size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-violet-400 animate-spin" />}
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="Search by medicine name..."
                  className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/10 text-sm font-medium text-slate-800 placeholder:text-slate-300 transition-all"
                  onChange={e => handleSearch(e.target.value)}
                />
                {searchResults.length > 0 && (
                  <div className="absolute w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-44 overflow-y-auto">
                    {searchResults.map(med => (
                      <div key={med._id} onClick={() => addMedication(med)}
                        className="px-4 py-2.5 hover:bg-violet-50 cursor-pointer flex justify-between items-center border-b border-slate-50 last:border-0 transition-colors">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{med.name}</p>
                          {med.category && <p className="text-[10px] text-slate-400">{med.category}</p>}
                        </div>
                        <div className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center">
                          <Plus size={12} className="text-violet-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected medications */}
              {formData.medications.length === 0 ? (
                <div className="py-6 text-center border-2 border-dashed border-slate-100 rounded-xl">
                  <Pill size={20} className="mx-auto text-slate-200 mb-2" />
                  <p className="text-xs text-slate-300 font-bold">No medications added yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-36 overflow-y-auto pr-0.5">
                  {formData.medications.map((med, i) => (
                    <div key={med._id} className="flex items-center justify-between px-3 py-2.5 bg-violet-50 border border-violet-100 rounded-xl group">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-lg bg-violet-200 text-violet-700 text-[10px] font-black flex items-center justify-center">{i + 1}</span>
                        <span className="text-xs font-bold text-slate-700">{med.name}</span>
                      </div>
                      <button type="button" onClick={() => removeMedication(med._id)}
                        className="w-6 h-6 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formData.medications.length > 0 && (
                <p className="text-[10px] text-slate-400 font-bold mt-2 text-right">
                  {formData.medications.length} medication{formData.medications.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </SectionCard>

          </div>
        </div>

        {/* Dispensing & Delivery Section */}
        <SectionCard icon={Truck} title="Dispensing & Delivery" color="orange">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-0.5">Fulfillment Method</label>
              <select 
                value={formData.delivery.fulfillmentMethod} 
                onChange={e => handleDeliveryChange("fulfillmentMethod", e.target.value)} 
                className={selectClass}
              >
                <option>Ship direct to the address</option>
                <option>Ship to the clinic</option>
                <option>Patient to collect from the pharmacy</option>
              </select>
            </div>
            
            <div className="md:col-span-1">
              <InputField 
                label="Delivery Address" 
                value={formData.delivery.deliveryAddress} 
                onChange={e => handleDeliveryChange("deliveryAddress", e.target.value)} 
                placeholder="Enter delivery address" 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-0.5">Prescription Validity</label>
              <select 
                value={formData.delivery.validity} 
                onChange={e => handleDeliveryChange("validity", e.target.value)} 
                className={selectClass}
              >
                <option>27 days</option>
                <option>14 days</option>
                <option>7 days</option>
                <option>Immediate same on day</option>
              </select>
            </div>
          </div>
        </SectionCard>

        {/* Row 2: Allergies + Submit */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-5">

            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center">
                  <AlertCircle size={13} className="text-amber-500" />
                </div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Known Allergies</label>
              </div>
              <textarea
                value={formData.patient.allergies}
                placeholder="List any known allergies, e.g. Penicillin, Latex, Aspirin..."
                rows={2}
                onChange={e => handlePatientChange("allergies", e.target.value)}
                className="w-full p-3 bg-amber-50/40 border border-amber-100 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 text-sm text-slate-800 font-medium placeholder:text-slate-300 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto shrink-0 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20"
            >
              {submitting
                ? <><Loader2 size={15} className="animate-spin" /> Submitting...</>
                : <><CheckCircle size={15} /> Submit Prescription</>
              }
            </button>

          </div>
        </div>

      </form>
    </div>
  );
};

export default Prescriptions;