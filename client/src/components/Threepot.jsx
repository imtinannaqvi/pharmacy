import Header from "./Header"

const Threepot = () => {
  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <Header title="Threepot" />
      <div className="p-8 max-w-[1400px] mx-auto">
        
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-[#0f172a] flex items-center gap-2">
            🏦 Three-Pot Financial System
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            DrGPharma revenue allocation — Time Pharmacy (dispensing pharmacy)
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-[#e0f2fe] border border-[#bae6fd] rounded-xl p-4 mb-8 flex items-start gap-3">
          <span className="text-blue-500 mt-0.5">ℹ️</span>
          <p className="text-[#0369a1] text-xs leading-relaxed">
            <span className="font-bold">Two-Party Model:</span> DrGPharma (brand) and Healthcare Time Ltd t/a Time Pharmacy (pharmacy). 
            All revenue flows through the Three-Pot system ensuring compliant financial separation and VAT management.
          </p>
        </div>

        {/* Financial Pots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* POT 1 - Stock Account */}
          <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-100">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-80 mb-4">
              <span className="text-blue-200">💙</span> Pot 1 — Stock Account
            </div>
            <h2 className="text-5xl font-black mb-1">£5,000.00</h2>
            <p className="text-blue-100 text-sm mb-8">Pre-funded stock purchasing account</p>
            
            <div className="space-y-3 pt-6 border-t border-white/20 text-sm">
              <div className="flex justify-between opacity-90"><span>Opening balance:</span> <span>£5,000</span></div>
              <div className="flex justify-between opacity-90"><span>Stock value held:</span> <span>£3,800</span></div>
              <div className="flex justify-between opacity-90"><span>Available to purchase:</span> <span>£1,200</span></div>
              <div className="flex justify-between items-center whitespace-nowrap font-black pt-2 mt-2 border-t border-white/10">
  <span>👥 Stock + Available = Total:</span>
  <span>£5,000 ✓</span>
</div>
            </div>
          </div>

          {/* POT 2 - Security Deposit */}
          <div className="bg-[#059669] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-100">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-80 mb-4">
              <span className="text-emerald-200">💚</span> Pot 2 — Security Deposit
            </div>
            <h2 className="text-5xl font-black mb-1">£5,000.00</h2>
            <p className="text-emerald-100 text-sm mb-8">Dr G deposit — held at ex-VAT cost value</p>
            
            <div className="space-y-3 pt-6 border-t border-white/20 text-sm">
              <div className="flex justify-between opacity-90"><span>Deposit held (ex-VAT):</span> <span>£5,000</span></div>
              <div className="flex justify-between opacity-90"><span>Pot 1 stock value:</span> <span>£5,000</span></div>
              <div className="flex justify-between opacity-90"><span>VAT charged at termination only</span></div>
              <div className="flex justify-between opacity-90"><span>Not released on individual sales</span></div>
              <div className="flex justify-between font-black pt-2 mt-2 border-t border-white/10">
                <span>👥 Pot 2 = Pot 1:</span>
                <span>£5,000 ✓</span>
              </div>
            </div>
          </div>

          {/* POT 3 - Sales Revenue */}
          <div className="bg-[#7c3aed] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-purple-100">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-80 mb-4">
              <span className="text-purple-200">💜</span> Pot 3 — Sales Revenue
            </div>
            <h2 className="text-5xl font-black mb-1">£28,450.00</h2>
            <p className="text-purple-100 text-sm mb-8">All patient payments — 100% margin to Dr G</p>
            
            <div className="space-y-2 pt-4 border-t border-white/20 text-xs">
              <div className="flex justify-between opacity-90"><span>Revenue (ex-VAT):</span> <span>£23,708</span></div>
              <div className="flex justify-between opacity-90"><span>VAT reserve (ring-fenced):</span> <span>£4,742</span></div>
              <div className="flex justify-between opacity-90 text-red-200"><span>Less: COGS (ex-VAT):</span> <span>-£14,220</span></div>
              <div className="flex justify-between opacity-90 text-red-200"><span>Less: Packaging (ex-VAT):</span> <span>-£710</span></div>
              <div className="flex justify-between opacity-90 text-red-200"><span>Less: Delivery (ex-VAT):</span> <span>-£1,136</span></div>
              <div className="flex justify-between opacity-90 text-red-200"><span>Less: Payment processing:</span> <span>-£427</span></div>
              <div className="flex justify-between font-black pt-2 mt-2 border-t border-white/10 text-sm">
                <span>👥 Dr G Commission:</span>
                <span>£7,215 ✓</span>
              </div>
              <div className="flex justify-between font-black">
                <span>Pharmacy nets:</span>
                <span>£0.00 ✓</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Threepot