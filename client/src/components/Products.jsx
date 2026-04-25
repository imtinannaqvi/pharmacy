import Header from "./Header"

const Products = () => {
  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <Header title="Products" />
      <div className="p-8 max-w-[1600px] mx-auto">
        
        {/* Title and Top Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              💊 Product Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              229 products across 13 categories
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm">
              Export 
            </button>
            <button className="px-4 py-2 bg-cyan-400 text-white rounded-xl text-sm font-bold hover:bg-cyan-500 transition-all shadow-md shadow-cyan-100">
              + Manual Product
            </button>
          </div>
        </div>

        {/* Search and Filters Container */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <form className="flex flex-wrap items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-72 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
                <button type="submit" className="bg-cyan-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-cyan-500 transition-all shadow-sm shadow-cyan-100">
                  Search
                </button>
              </div>

              <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none hover:border-gray-300 transition-colors cursor-pointer">
                <option>All Categories</option>
                <option>Botulinum Toxins</option>
                <option>Dermal Fillers (55)</option>
                <option>Skin Boosters (31)</option>
                <option>Weight Management (11)</option>
              </select>

              <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none hover:border-gray-300 transition-colors cursor-pointer">
                <option>All Types</option>
                <option>POM only </option>
                <option>OTC only</option>
              </select>
            </form>

           
          </div>
        </div>

        {/* Product Table Container */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[#8a99af] text-[10px] font-black uppercase tracking-widest">
                <th className="py-5 px-6">Product Name</th>
                <th className="py-5 px-6">Category</th>
                <th className="py-5 px-6">Price</th>
                <th className="py-5 px-6">Type</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { 
                  name: "Botox 100 units", category: "Botulinum Toxins", 
                  price: "£119.00", type: "POM", typeClass: "bg-red-50 text-red-500", 
                  stock: "In Stock", stockClass: "bg-green-50 text-green-600",
                  img: "💉" 
                },
                { 
                  name: "Bocouture 50 units", category: "Botulinum Toxins", 
                  price: "£68.00", type: "POM", typeClass: "bg-red-50 text-red-500", 
                  stock: "In Stock", stockClass: "bg-green-50 text-green-600",
                  img: "🧪" 
                },
                { 
                  name: "Juvederm Voluma 2ml", category: "Dermal Fillers", 
                  price: "£145.00", type: "POM", typeClass: "bg-red-50 text-red-500", 
                  stock: "In Stock", stockClass: "bg-green-50 text-green-600",
                  img: "📦" 
                },
                { 
                  name: "Profhilo 2ml", category: "Skin Boosters", 
                  price: "£92.00", type: "OTC", typeClass: "bg-green-50 text-green-600", 
                  stock: "In Stock", stockClass: "bg-green-50 text-green-600",
                  img: "🧴" 
                }
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-all group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center text-xl">
                        {item.img}
                      </div>
                      <span className="font-extrabold text-gray-900 text-sm">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-[#cbd5e1] font-medium">
                    {item.category}
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-900">
                    {item.price}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded ${item.typeClass}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit ${item.stockClass}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {item.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 shadow-sm transition-all">
                        Edit
                      </button>
                      <button className="px-4 py-1.5 bg-[#ef4444] text-white rounded-lg text-xs font-bold hover:bg-red-600 shadow-sm transition-all">
                        Remove
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

export default Products