import Header from './Header'
import { BiCheck } from 'react-icons/bi'

const stats = [
  {
    icon: "📦",
    value: "142",
    label: "Total Orders (Month)",
    change: "↑ 18% vs last month",
    changeColor: "text-blue-600 bg-blue-100",
    accent: "bg-cyan-400",
  },
  {
    icon: "💷",
    value: "£28,450",
    label: "Revenue (Month)",
    change: "↑ £4,200 vs last month",
    changeColor: "text-green-600",
    accent: "bg-green-400",
  },
  {
    icon: "⚡",
    value: "89",
    label: "Prescriptions Issued",
    change: "↑ 12 vs last month",
    changeColor: "text-orange-500",
    accent: "bg-yellow-400",
  },
  {
    icon: "👥",
    value: "347",
    label: "Registered Practitioners",
    change: "↑ 23 new this month",
    changeColor: "text-purple-600",
    accent: "bg-purple-400",
  },
]

const Dashboard = () => {
  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Top accent bar */}
              <div className={`h-1 w-full ${stat.accent}`} />
              <div className="p-5">
                {/* Icon */}
                <div className="text-2xl mb-3">{stat.icon}</div>
                {/* Value */}
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                {/* Label */}
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                {/* Change */}
                <p className={`text-xs mt-2 font-medium inline-block px-2 py-0.5 rounded ${stat.changeColor}`}>
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                📦 Recent Orders
              </h2>
              <button className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                View All
              </button>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 pb-2 uppercase tracking-wide">Ref</th>
                  <th className="text-left text-xs font-semibold text-gray-400 pb-2 uppercase tracking-wide">Customer</th>
                  <th className="text-left text-xs font-semibold text-gray-400 pb-2 uppercase tracking-wide">Total</th>
                  <th className="text-left text-xs font-semibold text-gray-400 pb-2 uppercase tracking-wide">Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { ref: "ORD-7284201", customer: "Sarah Nwosu", total: "£330.00", status: "Dispatched", statusColor: "text-cyan-600 bg-cyan-50" },
                  { ref: "ORD-7284198", customer: "Tom Clarke", total: "£596.00", status: "Rx Pending", statusColor: "text-red-500 bg-red-50" },
                  { ref: "ORD-7284185", customer: "Dr. R. Patel", total: "£245.50", status: "Processing", statusColor: "text-orange-500 bg-orange-50" },
                  { ref: "ORD-7284177", customer: "Lisa Mensah", total: "£189.00", status: "Delivered", statusColor: "text-green-600 bg-green-50" },
                  { ref: "ORD-7284169", customer: "J. Williams", total: "£420.00", status: "Delivered", statusColor: "text-green-600 bg-green-50" },
                ].map((order, idx) => (
                  <tr key={idx} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 font-bold text-gray-900 text-xs">{order.ref}</td>
                    <td className="py-3 text-gray-700">{order.customer}</td>
                    <td className="py-3 text-gray-700">{order.total}</td>
                    <td className="py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${order.statusColor}`}>
                        ● {order.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <button className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                🔔 Recent Activity
              </h2>
              <span className="text-sm text-gray-400">Live feed</span>
            </div>

            <div className="space-y-4">
              {[
                { icon: "📦", iconBg: "bg-orange-100", title: "New order ORD-7284201 placed by Sarah Nwosu", sub: "Botox 100u × 2, Profhilo 2ml — £330.00", time: "2m ago" },
                { icon: "⚡", iconBg: "bg-pink-100", title: "Prescription RX-7284099 issued by Dr. Williams", sub: "Patient: J. Smith · Mounjaro 2.5mg × 4", time: "14m ago" },
                { icon: "✅", iconBg: "bg-green-100", title: "Order ORD-7284177 delivered", sub: "Lisa Mensah — Lemonbottle × 3", time: "1h ago" },
                { icon: "👤", iconBg: "bg-blue-100", title: "New practitioner registration — Dr. A. Hassan", sub: "GPhC prescriber · Awaiting credential verification", time: "2h ago" },
                { icon: "💷", iconBg: "bg-purple-100", title: "Commission allocation processed — May batch", sub: "Dr G commission: £7,215 · Pharmacy nets: £0.00 ✓", time: "3h ago" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full ${item.iconBg} flex items-center justify-center text-base shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#f8f9fa] p-4 sm:p-8 font-sans text-white mt-6 rounded-2xl">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6 ">
              <h2 className="text-gray-800 font-extrabold text-xl flex items-center gap-2">
                📊 Three-Pot Financial System — May 2026
              </h2>
              <button className="bg-[#fdf2e9] text-[#c05621] px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-orange-200 transition-colors">
                Full Report →
              </button>
            </div>

            {/* Top Row: Pot 1 and Pot 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Pot 1 - Stock Account */}
              <div className="bg-[#3b82f6] p-10 rounded-[3rem] shadow-xl relative overflow-hidden flex flex-col min-h-[400px]">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Pot 1 — Stock Account</p>
                  <h3 className="text-7xl font-extrabold mt-6 mb-2 tracking-tight">£5,000</h3>
                  <p className="text-sm font-medium opacity-90">Product purchasing fund</p>
                </div>
                
                <div className="flex-1"></div>

                <div className="pt-6 border-t border-white/20">
                  <div className="space-y-2 text-sm font-medium">
                    <div className="flex justify-between"><span>Stock value held:</span><span>£3,800</span></div>
                    <div className="flex justify-between"><span>Available for purchase:</span><span>£1,200</span></div>
                  </div>
                  <div className="mt-8 pt-5 border-t border-white/20 flex justify-between items-center font-extrabold text-xs">
                    <span className="uppercase tracking-wider">Pot 1 = Pot 2:</span>
                    <span className="flex items-center gap-2 text-xl">£5,000 <BiCheck className="bg-white text-[#3b82f6] rounded-full p-1 text-2xl" /></span>
                  </div>
                </div>
              </div>

              {/* Pot 2 - Security Deposit */}
              <div className="bg-[#065f46] p-10 rounded-[3rem] shadow-xl relative overflow-hidden flex flex-col min-h-[400px]">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Pot 2 — Security Deposit</p>
                  <h3 className="text-7xl font-extrabold mt-6 mb-2 tracking-tight">£5,000</h3>
                  <p className="text-sm font-medium opacity-90">Dr G deposit held by Time Pharmacy</p>
                </div>

                <div className="flex-1"></div>

                <div className="pt-6 border-t border-white/20">
                  <div className="space-y-2 text-sm font-medium">
                    <div className="flex justify-between"><span>Deposit held (ex-VAT):</span><span>£5,000</span></div>
                    <div className="flex justify-between"><span>Pot 1 stock value:</span><span>£5,000</span></div>
                  </div>
                  <div className="mt-8 pt-5 border-t border-white/20 flex justify-between items-center font-extrabold text-xs">
                    <span className="uppercase tracking-wider">Pot 1 = Pot 2:</span>
                    <span className="flex items-center gap-2 text-xl">Equilibrium <BiCheck className="bg-white text-[#065f46] rounded-full p-1 text-2xl" /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Pot 3 - Full Width */}
            <div className="bg-[#6b21a8] p-10 rounded-[3rem] shadow-xl relative overflow-hidden min-h-[350px]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24"></div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Pot 3 — Sales Revenue</p>
              <h3 className="text-7xl font-extrabold mt-6 mb-2 tracking-tight">£28,450</h3>
              <p className="text-sm font-medium opacity-90 mb-12">All patient payments → 100% to Dr G</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10 border-t border-white/10 pt-10">
                <div className="space-y-3 text-sm font-medium">
                  <div className="flex justify-between"><span>Revenue ex-VAT:</span><span>£23,708</span></div>
                  <div className="flex justify-between"><span>VAT reserve (ring-fenced):</span><span>£4,742</span></div>
                  <div className="flex justify-between opacity-70"><span>Less: COGS (ex-VAT):</span><span>-£14,220</span></div>
                  <div className="flex justify-between opacity-70"><span>Less: Packaging cost:</span><span>-£710</span></div>
                </div>

                <div className="flex flex-col justify-end space-y-4 font-black border-t lg:border-t-0 lg:border-l border-white/20 lg:pl-10 pt-4 lg:pt-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase tracking-widest opacity-70">Dr G Commission:</span>
                    <span className="flex items-center gap-3 text-3xl font-extrabold">£7,215 <BiCheck className="text-4xl" /></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase tracking-widest opacity-70">Pharmacy nets:</span>
                    <span className="flex items-center gap-3 text-3xl font-extrabold">£0.00 <BiCheck className="text-4xl" /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard