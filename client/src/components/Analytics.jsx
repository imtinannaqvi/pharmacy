import Header from "./Header"

const stats = [
  {
    icon: "🛒",
    value: "4.2",
    label: "Avg. Items per Order",
    change: "↑ 12% vs last month", // Added back for visual balance
    changeColor: "text-blue-600 bg-blue-50",
    accent: "bg-cyan-400",
  },
  {
    icon: "💷",
    value: "£200",
    label: "Average Order Value",
    change: "↑ £15 vs last month",
    changeColor: "text-green-600 bg-green-50",
    accent: "bg-green-400",
  },
  {
    icon: "🔄",
    value: "68%",
    label: "Repeat Customer Rate",
    change: "Stable",
    changeColor: "text-orange-500 bg-orange-50",
    accent: "bg-yellow-400",
  },
  {
    icon: "⚡",
    value: "89%",
    label: "SwiftRx™ Adoption",
    change: "↑ 4% this month",
    changeColor: "text-purple-600 bg-purple-50",
    accent: "bg-purple-400",
  },
]

// Added the missing products array to fix the map error
const products = [
  { name: "Botox 100u", units: 48, revenue: "£5,712" },
  { name: "Mounjaro 5mg", units: 32, revenue: "£5,408" },
  { name: "Juvederm Voluma", units: 35, revenue: "£5,075" },
  { name: "Wegovy 0.25mg", units: 28, revenue: "£4,452" },
  { name: "Profhilo 2ml", units: 19, revenue: "£3,230" },
]

const Analytics = () => {
  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <Header title="Analytics" />
      <div className="p-8 max-w-[1600px] mx-auto">
        
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            📊 Analytics
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Sales performance and platform metrics for May 2026
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className={`h-1.5 w-full ${stat.accent}`} />
              <div className="p-6">
                <div className="text-2xl mb-4">{stat.icon}</div>
                <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
                <div className={`text-[10px] mt-4 font-bold inline-block px-2 py-1 rounded-md ${stat.changeColor}`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 5 Products Table */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <h2 className="text-lg font-bold text-[#0f3460] mb-8">Top 5 Products by Revenue</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 text-[#8a99af] text-[10px] font-black uppercase tracking-widest">
                    <th className="py-4 px-6 text-left rounded-l-2xl">Product</th>
                    <th className="py-4 px-6 text-left">Units Sold</th>
                    <th className="py-4 px-6 text-left rounded-r-2xl">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product, idx) => (
                    <tr key={idx} className="group hover:bg-gray-50/50 transition-all">
                      <td className="py-5 px-6 font-bold text-gray-700">{product.name}</td>
                      <td className="py-5 px-6 text-gray-500 font-medium">{product.units}</td>
                      <td className="py-5 px-6 font-black text-gray-900">{product.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Placeholder for future charts or secondary metrics */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
  <h2 className="text-lg font-bold text-[#0f3460] mb-8">Revenue by Category</h2>
  
  <div className="space-y-6">
    {[
      { name: "Dermal Fillers", value: "£8,450", percent: 30, color: "bg-cyan-400" },
      { name: "Weight Management", value: "£7,125", percent: 25, color: "bg-emerald-500" },
      { name: "Botulinum Toxins", value: "£5,690", percent: 20, color: "bg-amber-600/60" },
      { name: "Skin Boosters", value: "£4,267", percent: 15, color: "bg-purple-500" },
      { name: "Other", value: "£2,918", percent: 10, color: "bg-slate-400" },
    ].map((category, idx) => (
      <div key={idx} className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-gray-700">{category.name}</span>
          <span className="text-gray-900 font-medium">
            {category.value} <span className="text-gray-400 ml-1">({category.percent}%)</span>
          </span>
        </div>
        {/* Progress Bar Container */}
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          {/* Filled Portion */}
          <div 
            className={`${category.color} h-2.5 rounded-full transition-all duration-1000`} 
            style={{ width: `${category.percent}%` }}
          />
        </div>
      </div>
    ))}
  </div>
</div>
        </div>
      </div>
    </div>
  )
}

export default Analytics