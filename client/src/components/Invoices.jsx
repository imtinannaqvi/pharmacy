import Header from "./Header"

const Invoices = () => {
  const invoiceData = [
    { id: "INV-2025-0142", customer: "Sarah Nwosu", ref: "ORD-7284201", amount: "£275.00", vat: "£55.00", total: "£330.00", date: "22 May", status: "Paid", statusColor: "bg-green-50 text-green-600" },
    { id: "INV-2025-0141", customer: "Tom Clarke", ref: "ORD-7284198", amount: "£496.67", vat: "£99.33", total: "£596.00", date: "20 May", status: "Pending", statusColor: "bg-orange-50 text-orange-600" },
    { id: "INV-2025-0140", customer: "Dr. R. Patel", ref: "ORD-7284185", amount: "£204.58", vat: "£40.92", total: "£245.50", date: "19 May", status: "Paid", statusColor: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <Header title="Invoices" />
      <div className="p-8 max-w-[1600px] mx-auto">
        
        {/* Title and Top Action */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0f172a] flex items-center gap-2">
              🧾 Invoices
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              All customer invoices — invoiced by DrGPharma, dispensed by Time Pharmacy
            </p>
          </div>
          <button className="bg-cyan-400 text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-cyan-500 transition-all shadow-md shadow-cyan-100 flex items-center gap-2">
            + Generate Invoice
          </button>
        </div>

        {/* Invoice Table Container */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[#8a99af] text-[10px] font-black uppercase tracking-[0.1em]">
                <th className="py-5 px-6">Invoice No.</th>
                <th className="py-5 px-6">Customer</th>
                <th className="py-5 px-6">Order Ref</th>
                <th className="py-5 px-6 text-center">Amount</th>
                <th className="py-5 px-6 text-center">VAT</th>
                <th className="py-5 px-6 text-center">Total</th>
                <th className="py-5 px-6">Date</th>
                <th className="py-5 px-6">Status</th>
                <th className="py-5 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoiceData.map((invoice, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition-all group">
                  <td className="py-5 px-2">
                    <span className="font-extrabold text-gray-900 text-sm">{invoice.id}</span>
                  </td>
                  <td className="py-5 px-2 text-sm text-gray-600">
                    {invoice.customer}
                  </td>
                  <td className="py-5 px-2 text-sm text-[#8a99af]">
                    {invoice.ref}
                  </td>
                  <td className="py-5 px-2 text-sm font-medium text-gray-900 text-center">
                    {invoice.amount}
                  </td>
                  <td className="py-5 px-2 text-sm font-medium text-gray-900 text-center">
                    {invoice.vat}
                  </td>
                  <td className="py-5 px-2 text-sm font-black text-gray-900 text-center">
                    {invoice.total}
                  </td>
                  <td className="py-5 px-2 text-sm text-gray-500">
                    {invoice.date}
                  </td>
                  <td className="py-5 px-2">
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit uppercase ${invoice.statusColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-5 px-2 text-right">
                    <button className="px-5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-black text-gray-600 hover:bg-gray-50 shadow-sm transition-all">
                      PDF
                    </button>
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

export default Invoices