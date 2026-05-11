import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import {
  UserPlus, CheckCircle, Loader2, Clock, AlertTriangle,
  ClipboardList, ShieldCheck, Trash2, Pill, Eye, ChevronDown, ChevronUp
} from "lucide-react";
import { toast } from "react-hot-toast";

const BASE = "http://localhost:4000";
const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

// ── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    pending:  { bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-200",   icon: <Clock size={10} />,         label: "Pending"  },
    active:   { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", icon: <CheckCircle size={10} />,   label: "Verified" },
    approved: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", icon: <CheckCircle size={10} />,   label: "Approved" },
    rejected: { bg: "bg-red-50",     text: "text-red-500",     border: "border-red-200",     icon: <AlertTriangle size={10} />, label: "Rejected" },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${s.bg} ${s.text} ${s.border}`}>
      {s.icon} {s.label}
    </span>
  );
};

// ── Info Cell ─────────────────────────────────────────────────────────────────
const InfoCell = ({ label, value }) => !value ? null : (
  <div className="bg-slate-50 rounded-xl px-3 py-2.5">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
    <p className="text-xs font-semibold text-slate-700">{value}</p>
  </div>
);

const Prescriptions = () => {
  const [activeTab, setActiveTab]       = useState("prescriptions");
  const [links, setLinks]               = useState([]);
  const [requests, setRequests]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [expandedId, setExpandedId]     = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [linksRes, reqsRes] = await Promise.all([
        axios.get(`${BASE}/api/prescriber-link/admin/pending`,  { headers: authHeaders() }),
        axios.get(`${BASE}/api/prescriber-link/admin/requests`, { headers: authHeaders() }),
      ]);
      setLinks(Array.isArray(linksRes.data)    ? linksRes.data    : []);
      setRequests(Array.isArray(reqsRes.data)  ? reqsRes.data     : []);
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response?.status !== 404) toast.error("Could not load data");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAction = async (id, status) => {
    try {
      await axios.patch(`${BASE}/api/prescriber-link/admin/verify-link/${id}`,
        { status }, { headers: authHeaders() }
      );
      toast.success(status === "active" ? "Professional verified ✓" : "Request rejected");
      fetchAll();
    } catch { toast.error("Action failed"); }
  };

  const handleRequestAction = async (id, status) => {
    try {
      await axios.patch(`${BASE}/api/prescriber-link/admin/verify-request/${id}`,
        { status }, { headers: authHeaders() }
      );
      toast.success(status === "deleted" ? "Request deleted" : `Prescription ${status} ✓`);
      fetchAll();
    } catch { toast.error("Action failed"); }
  };

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  const counts = {
    pendingLinks:    links.filter(l => l.status === "pending").length,
    pendingRequests: requests.filter(r => r.status === "pending").length,
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-cyan-500" size={32} />
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Header title="Admin Prescription Center" />

      <div className="max-w-6xl mx-auto p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Links",       value: links.length,              color: "text-slate-700",   bg: "bg-white"       },
            { label: "Pending Links",      value: counts.pendingLinks,       color: "text-amber-600",   bg: "bg-amber-50"    },
            { label: "Total Requests",     value: requests.length,           color: "text-slate-700",   bg: "bg-white"       },
            { label: "Pending Requests",   value: counts.pendingRequests,    color: "text-violet-600",  bg: "bg-violet-50"   },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border border-white rounded-2xl px-4 py-3 shadow-sm`}>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-3">
          <button onClick={() => { setActiveTab("prescriptions"); setExpandedId(null); }}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === "prescriptions"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                : "bg-white text-slate-500 border border-slate-200 hover:border-violet-300"
            }`}>
            <ClipboardList size={14} />
            Prescription Requests
            {counts.pendingRequests > 0 && (
              <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-[10px]">{counts.pendingRequests}</span>
            )}
          </button>

          <button onClick={() => { setActiveTab("links"); setExpandedId(null); }}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === "links"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-200"
                : "bg-white text-slate-500 border border-slate-200 hover:border-cyan-300"
            }`}>
            <ShieldCheck size={14} />
            Professional Verification
            {counts.pendingLinks > 0 && (
              <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-[10px]">{counts.pendingLinks}</span>
            )}
          </button>
        </div>

        {/* ── Prescription Requests ───────────────────────────────────────── */}
        {activeTab === "prescriptions" && (
          <div className="space-y-3">
            {requests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
                <ClipboardList size={32} className="mx-auto text-slate-200 mb-3" />
                <p className="text-sm font-bold text-slate-400">No prescription requests found</p>
              </div>
            ) : (
              requests.map(rx => (
                <div key={rx._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                  {/* Row */}
                  <div className="flex items-center gap-4 px-5 py-4">

                    {/* Patient */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-black text-slate-900">
                          {rx.patient?.firstName} {rx.patient?.lastName}
                        </p>
                        <StatusBadge status={rx.status} />
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Prescriber: <span className="text-slate-600 font-bold">{rx.prescriber?.name || "—"}</span>
                        {rx.treatment && <span className="ml-2">· {rx.treatment}</span>}
                      </p>
                    </div>

                    {/* Medications count */}
                    {rx.medications?.length > 0 && (
                      <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-violet-50 border border-violet-100 rounded-xl">
                        <Pill size={12} className="text-violet-500" />
                        <span className="text-[10px] font-black text-violet-600">
                          {rx.medications.length} med{rx.medications.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}

                    {/* Consent doc */}
                    {rx.consentDocumentation && (
                      <button onClick={() => window.open(rx.consentDocumentation, "_blank")}
                        className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black hover:bg-slate-200 transition-colors">
                        <Eye size={12} /> Consent
                      </button>
                    )}

                    {/* Actions */}
                    <div className="shrink-0 flex gap-2">
                      {rx.status === "pending" && (
                        <>
                          <button onClick={() => handleRequestAction(rx._id, "approved")}
                            className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-black hover:bg-emerald-600 transition-colors">
                            Approve
                          </button>
                          <button onClick={() => handleRequestAction(rx._id, "rejected")}
                            className="px-3 py-1.5 border border-red-200 text-red-500 rounded-lg text-[10px] font-black hover:bg-red-50 transition-colors">
                            Reject
                          </button>
                        </>
                      )}
                      {rx.status !== "pending" && (
                        <button onClick={() => handleRequestAction(rx._id, "deleted")}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {/* Expand */}
                    <button onClick={() => toggle(rx._id)} className="text-slate-400 hover:text-slate-700 transition-colors shrink-0">
                      {expandedId === rx._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* Expanded */}
                  {expandedId === rx._id && (
                    <div className="border-t border-slate-100 px-5 py-4 space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <InfoCell label="Prescriber Email" value={rx.prescriber?.email} />
                        <InfoCell label="Treatment"        value={rx.treatment} />
                        <InfoCell label="Request ID"       value={`#${rx._id?.slice(-6).toUpperCase()}`} />
                        <InfoCell label="Submitted"        value={rx.createdAt ? new Date(rx.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"} />
                      </div>
                      {rx.clinicalNotes && (
                        <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                          <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Clinical Notes</p>
                          <p className="text-xs text-slate-700 italic">"{rx.clinicalNotes}"</p>
                        </div>
                      )}
                      {rx.medications?.length > 0 && (
                        <div className="bg-violet-50/50 border border-violet-100 rounded-xl px-3 py-2.5">
                          <p className="text-[9px] font-black text-violet-600 uppercase tracking-widest mb-2">Medications</p>
                          <div className="flex flex-wrap gap-2">
                            {rx.medications.map(m => (
                              <span key={m._id} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700">
                                {m.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Professional Verification ───────────────────────────────────── */}
        {activeTab === "links" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-cyan-50 flex items-center justify-center">
                <UserPlus size={14} className="text-cyan-500" />
              </div>
              <h2 className="text-sm font-black text-slate-800">Professional Verification Queue</h2>
            </div>

            {links.length === 0 ? (
              <div className="py-16 text-center">
                <UserPlus size={32} className="mx-auto text-slate-200 mb-3" />
                <p className="text-sm font-bold text-slate-400">No professional requests</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {links.map(link => (
                  <>
                    <div key={link._id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors">

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-black text-slate-900">
                            {link.requesterId?.name || `${link.requesterId?.firstName || ""} ${link.requesterId?.lastName || ""}`.trim() || "Unknown"}
                          </p>
                          <StatusBadge status={link.status} />
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {link.requesterRole}
                          <span className="mx-1">·</span>
                          Reg: <span className="font-bold text-slate-600">{link.registrationNumber}</span>
                          {link.prescriberId && (
                            <span className="ml-2">
                              → <span className="font-bold text-cyan-600">
                                {link.prescriberId?.name || `${link.prescriberId?.firstName || ""} ${link.prescriberId?.lastName || ""}`.trim()}
                              </span>
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="shrink-0 flex gap-2">
                        {link.status === "pending" && (
                          <>
                            <button onClick={() => handleLinkAction(link._id, "active")}
                              className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-black hover:bg-emerald-600 transition-colors">
                              Verify
                            </button>
                            <button onClick={() => handleLinkAction(link._id, "rejected")}
                              className="px-3 py-1.5 border border-red-200 text-red-500 rounded-lg text-[10px] font-black hover:bg-red-50 transition-colors">
                              Reject
                            </button>
                          </>
                        )}
                      </div>

                      <button onClick={() => toggle(link._id)} className="text-slate-400 hover:text-slate-700 transition-colors shrink-0">
                        {expandedId === link._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>

                    {expandedId === link._id && (
                      <div className="border-t border-slate-50 bg-slate-50/80 px-5 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <InfoCell label="Email"           value={link.requesterId?.email} />
                          <InfoCell label="Registration No" value={link.registrationNumber} />
                          <InfoCell label="Message"         value={link.message || "No message"} />
                          <InfoCell label="Submitted"       value={link.createdAt ? new Date(link.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"} />
                        </div>
                      </div>
                    )}
                  </>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Prescriptions;