import Header from "./Header"

const Orders = () => {
  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <Header title="Order Management" />
      <div className="p-8 max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              📦 Order Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage and process all customer orders
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-cyan-400 text-white rounded-xl text-sm font-bold hover:bg-cyan-500 transition-all shadow-md shadow-cyan-100">
              + Manual Order
            </button>
          </div>
        </div>

        {/* Placeholder for the table content you'll add next */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 mb-6">
  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
    <form className="flex flex-wrap items-center gap-3 flex-1">
      {/* Search Group */}
      <div className="flex items-center gap-2">
        <input 
          type="text" 
          placeholder="Search orders, customers..." 
          className="w-72 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
        />
       
      </div>

      {/* Status Dropdown */}
      <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none hover:border-gray-300 transition-colors cursor-pointer">
        <option>All Statuses</option>
        <option>Processing</option>
        <option>Rx Pending</option>
        <option>Dispatched</option>
        <option>Delivered</option>
        <option>Cancelled</option>
      </select>

      {/* Date Dropdown */}
      <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none hover:border-gray-300 transition-colors cursor-pointer">
        <option>All Dates</option>
        <option>Today</option>
        <option>This Week</option>
        <option>This Month</option>
      </select>
    </form>

    {/* Order Count aligned to the right */}
    <div className="flex-none">
      <span className="text-md  text-black  ">
        .Showing 142 orders
      </span>
    </div>
  </div>
</div>
   

   <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className="bg-gray-50/80 text-[#8a99af] text-[10px] font-black uppercase tracking-widest">
        <th className="py-4 px-6">Order Ref</th>
        <th className="py-4 px-6">Customer</th>
        <th className="py-4 px-6">Products</th>
        <th className="py-4 px-6">Total</th>
        <th className="py-4 px-6">Delivery</th>
        <th className="py-4 px-6">Status</th>
        <th className="py-4 px-6 text-center">POM</th>
        <th className="py-4 px-6 text-right">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-50">
      {[
        { 
          ref: "ORD-7284201", date: "22 May 2026", 
          customer: "Sarah Nwosu", id: "NMC: 9988776", 
          products: "Botox 100u × 2, Profhilo 2ml × 1", 
          total: "£330.00", delivery: "Next Day · DHL", 
          status: "Dispatched", statusClass: "text-cyan-600 bg-cyan-50", 
          type: "POM", typeClass: "bg-red-50 text-red-500",
          action: "Dispatch", actionClass: "bg-green-500 text-white"
        },
        { 
          ref: "ORD-7284198", date: "20 May 2026", 
          customer: "Tom Clarke", id: "GDC: 1122334", 
          products: "Mounjaro 2.5mg × 4", 
          total: "£596.00", delivery: "Cold-Chain", 
          status: "Rx Pending", statusClass: "text-red-500 bg-red-50", 
          type: "POM", typeClass: "bg-red-50 text-red-500",
          action: "Verify Rx", actionClass: "bg-cyan-500 text-white"
        }
      ].map((order, idx) => (
        <tr key={idx} className="hover:bg-gray-50/50 transition-all text-sm">
          {/* Vertical stack with minimal gap */}
          <td className="py-4 px-6">
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-gray-900">{order.ref}</span>
              <span className="text-[10px] text-gray-400 font-normal mt-0.5">{order.date}</span>
            </div>
          </td>
          
          <td className="py-4 px-6">
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-gray-900">{order.customer}</span>
              <span className="text-[10px] text-gray-400 font-normal uppercase mt-0.5">{order.id}</span>
            </div>
          </td>

          <td className="py-4 px-6 text-gray-500 text-xs leading-relaxed max-w-[220px]">
            {order.products}
          </td>

          <td className="py-4 px-6 font-black text-gray-900">{order.total}</td>
          
          <td className="py-4 px-6 text-gray-400 font-medium text-xs">
            {order.delivery}
          </td>

          <td className="py-4 px-6">
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1.5 w-fit ${order.statusClass}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span> {order.status}
            </span>
          </td>

          <td className="py-4 px-6 text-center">
            <span className={`text-[9px] font-black px-2 py-0.5 rounded ${order.typeClass}`}>{order.type}</span>
          </td>

          <td className="py-4 px-6 text-right">
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-600 hover:bg-gray-50">View</button>
              <button className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-sm ${order.actionClass}`}>
                {order.action !== "Invoice" && <span>✓</span>} {order.action}
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      </div>
    </div>
  )
}

export default Orders