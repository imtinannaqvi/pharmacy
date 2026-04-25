import Header from "./Header"

const Commission = () => {
  const tableData = [
    { month: "May 2025", revenue: "£23,708", cogs: "£14,220", packaging: "£710", delivery: "£1,136", processing: "£427", commission: "£7,215", net: "£0.00 ✓" },
    { month: "April 2025", revenue: "£20,083", cogs: "£12,050", packaging: "£602", delivery: "£963", processing: "£362", commission: "£6,106", net: "£0.00 ✓" },
  ];

  const stats = [
  {
    icon: "💷",
    value: "£7,215",
    label: "Dr G Commission (May)",
    change: "↑ 18% vs April",
    changeColor: "text-blue-600 bg-blue-100",
    accent: "bg-cyan-400",
  },
  {
    icon: "🏥",
    value: "£0.0",
    label: "Time Pharmacy Net (May)",
    change: "Costs reimbursed only",
    changeColor: "text-green-600",
    accent: "bg-green-400",
  },
  {
    icon: "📊",
    value: "100%",
    label: "Dr G Margin Retention",
    change: "Per commercial agreement",
    changeColor: "text-orange-500",
    accent: "bg-yellow-400",
  },
  {
    icon: "📅",
    value: "£36,200",
    label: "YTD Dr G Commission",
    change: "↑ £4,800 vs 2024 YTD",
    changeColor: "text-purple-600",
    accent: "bg-purple-400",
  },
]
  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <Header title="commission" />
      <div className="p-8 max-w-[1600px] mx-auto">
        
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-[#0f172a] flex items-center gap-2">
            📈 Dr G Commission Tracker
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Revenue – Costs = Dr G commission. Time Pharmacy nets £0 on every order.
          </p>
        </div>

        {/* Rule Banner */}
        <div className="bg-[#e0f2fe] border border-[#bae6fd] rounded-xl p-4 mb-8 flex items-start gap-3">
          <span className="text-blue-500 mt-0.5">ℹ️</span>
          <p className="text-[#0369a1] text-xs leading-relaxed">
            <span className="font-bold">Three-Pot Rule:</span> Dr G retains 100% of the net margin. Time Pharmacy is reimbursed its exact costs only — cost of drug, packaging, and delivery (all ex-VAT). Time Pharmacy receives no dispensing fee, no percentage, and no profit share. Pharmacy nets £0 on every single order.
          </p>
        </div>

        {/* Metric Cards Grid */}
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
        

        {/* Table Section */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="font-black text-gray-900">Monthly Commission Breakdown — Three-Pot Model</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[#8a99af] text-[10px] font-black uppercase tracking-widest">
                <th className="py-5 px-2">Month</th>
                <th className="py-5 px-2">Revenue (ex-VAT)</th>
                <th className="py-5 px-2">COGS</th>
                <th className="py-5 px-2 text-center">Packaging</th>
                <th className="py-5 px-2 text-center">Delivery</th>
                <th className="py-5 px-2 text-center">Payment Proc.</th>
                <th className="py-5 px-2">Dr G Commission</th>
                <th className="py-5 px-2">Pharmacy Nets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition-all">
                  <td className="py-5 px-2 text-sm text-gray-500">{row.month}</td>
                  <td className="py-5 px-2 text-sm font-medium text-gray-900">{row.revenue}</td>
                  <td className="py-5 px-2 text-sm text-gray-600">{row.cogs}</td>
                  <td className="py-5 px-2 text-sm text-gray-600 text-center">{row.packaging}</td>
                  <td className="py-5 px-2 text-sm text-gray-600 text-center">{row.delivery}</td>
                  <td className="py-5 px-2 text-sm text-gray-600 text-center">{row.processing}</td>
                  <td className="py-5 px-2 text-sm font-black text-cyan-500">{row.commission}</td>
                  <td className="py-5 px-2 text-sm font-black text-emerald-500">{row.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Commission