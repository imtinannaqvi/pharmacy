const Header = ({ title }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
      
      {/* Title */}
      <h1 className="text-xl font-bold text-black min-w-fit">{title}</h1>

      {/* Search */}
      <div className="flex-1 mx-6 max-w-md">
        <input
          type="text"
          placeholder="Search orders, customers, products..."
          className="w-full px-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:border-blue-300 focus:bg-white transition"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 min-w-fit">
        <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition">
          ↓ Export
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg transition">
          + New Order
        </button>
        <button className="relative w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition">
          🔔
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>

    </div>
  )
}

export default Header