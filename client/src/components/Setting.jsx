import Header from "./Header"

const Setting = () => {
  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <Header title="Setting" />
      <div className="p-8 max-w-[1600px] mx-auto">
        
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#0f172a] flex items-center gap-2">
            ⚙️ System Settings
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Pharmacy Details Card */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-lg">🏥</span>
              <h2 className="text-lg font-black text-[#0f172a]">Pharmacy Details</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pharmacy Name</label>
                <input 
                  type="text" 
                  defaultValue="Healthcare Time Ltd t/a Time Pharmacy"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">GPhC Registration</label>
                <input 
                  type="text" 
                  defaultValue="9010453"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Responsible Pharmacist</label>
                <input 
                  type="text" 
                  placeholder="Responsible Pharmacist name"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all text-gray-600"
                />
              </div>
              <button className="bg-cyan-400 text-white px-8 py-2.5 rounded-xl text-sm font-black hover:bg-cyan-500 transition-all shadow-md shadow-cyan-100">
                Save
              </button>
            </div>
          </div>

          {/* Three-Pot Financial Settings Card */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-lg">💵</span>
              <h2 className="text-lg font-black text-[#0f172a]">Three-Pot Financial Settings</h2>
            </div>

            {/* Blue Info Banner */}
            <div className="bg-[#e0f2fe] border border-[#bae6fd] rounded-xl p-4 mb-6 flex items-start gap-3">
              <span className="text-blue-500 text-xs mt-0.5">ℹ️</span>
              <p className="text-[#0369a1] text-[11px] leading-relaxed">
                Dr G retains 100% of net margin. Time Pharmacy is reimbursed costs only (COGS, packaging, delivery). No percentage split applies.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Dr G Margin Retention</label>
                <input 
                  type="text" 
                  defaultValue="100% of net margin"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Time Pharmacy — Reimbursement Basis</label>
                <input 
                  type="text" 
                  defaultValue="Exact costs only (COGS + packaging + delivery)"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Payment Processing Rate (%)</label>
                <input 
                  type="text" 
                  defaultValue="1.5"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">VAT Rate (%)</label>
                <input 
                  type="text" 
                  defaultValue="20"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all text-gray-600"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Setting