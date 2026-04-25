
import Header from "./Header"
const Prescriptions = () => {
  return (
    <div>
      <Header title="Prescription" />
      <div className="p-5">

        <div className="mb-6">
            <h1 className="text-xl font-bold text-black">
                ⚡ Prescription Management
            </h1>
            <p className="text-sm text-mauve-400 p-3">
                SwiftRx™ prescriptions requiring pharmacy review
            </p>

        </div>
        <span className="p-3 font-semibold text-orange-900 bg-orange-100 rounded-lg ">
            ⚠️ 3 prescriptions are awaiting pharmacist review before dispensing can proceed.
        </span>
        <div className="p-10 bg-white text-black rounded-xl shadow-md mt-6">
  <h1 className="text-lg font-bold text-black border-b p-3 mb-6">
    Awaiting Pharmacist Review
  </h1>
  <div className="space-y-4">
    {/* Prescription Item Start */}
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Prescription Icon */}
        <div className="text-2xl">📋</div>
        
        {/* Prescription Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-gray-900">RX-7284099</span>
            <span className="text-gray-400">•</span>
            <span className="font-bold text-gray-800">Patient: J. Smith</span>
            <span className="text-gray-400">•</span>
            <span className="font-bold text-gray-800">Mounjaro 2.5mg × 4</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Prescriber: Dr. Jane Williams (NMC: 1234567A) · Via PrescribeLink™ · Tom Clarke
          </div>
          <div className="text-[11px] text-gray-400">
            Issued: Today 14:32 · Expires: 18 Jun 2025
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="px-3 py-1.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-tighter rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
          Awaiting Review
        </span>
        
        <button className="px-5 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm flex items-center gap-1">
          ✓ Approve
        </button>
        
        <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors">
          View Full Rx
        </button>
        
        <button className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors shadow-sm">
          Query
        </button>
      </div>
    </div>
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Prescription Icon */}
        <div className="text-2xl">📋</div>
        
        {/* Prescription Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-gray-900">RX-7284099</span>
            <span className="text-gray-400">•</span>
            <span className="font-bold text-gray-800">Patient: J. Smith</span>
            <span className="text-gray-400">•</span>
            <span className="font-bold text-gray-800">Mounjaro 2.5mg × 4</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Prescriber: Dr. Jane Williams (NMC: 1234567A) · Via PrescribeLink™ · Tom Clarke
          </div>
          <div className="text-[11px] text-gray-400">
            Issued: Today 14:32 · Expires: 18 Jun 2025
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="px-3 py-1.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-tighter rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
          Awaiting Review
        </span>
        
        <button className="px-5 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm flex items-center gap-1">
          ✓ Approve
        </button>
        
        <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors">
          View Full Rx
        </button>
        
        
      </div>
    </div>
    {/* Prescription Item End */}
  </div>
</div>
      </div>
    </div>
  )
}

export default Prescriptions
