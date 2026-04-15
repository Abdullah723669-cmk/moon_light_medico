import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Package, ArrowUpRight, ArrowDownRight, RefreshCcw, Plus } from 'lucide-react';

export default function AdminStockReport() {
  const [stockLogs, setStockLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchStockLogs();
  }, [targetDate]);

  const fetchStockLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/stock/?target_date=${targetDate}`);
      setStockLogs(res.data);
    } catch (err) {
      console.error('Error fetching stock logs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading Stock Reports...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Daily Stock Management</h3>
          <p className="text-sm text-gray-500 mt-1">Daily records of inventory transitions, sales, and returns.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
          />
          <button 
            onClick={fetchStockLogs}
            className="p-2 hover:bg-gray-100 rounded-full transition bg-gray-50 border border-gray-200"
            title="Refresh Data"
          >
            <RefreshCcw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <th className="p-3 font-bold rounded-tl-lg">Date</th>
              <th className="p-3 font-bold">Brand Name</th>
              <th className="p-3 font-bold text-center">Opening</th>
              <th className="p-3 font-bold text-center text-blue-600">Added</th>
              <th className="p-3 font-bold text-center text-red-600">Sales</th>
              <th className="p-3 font-bold text-center text-green-600">Returns</th>
              <th className="p-3 font-bold text-center rounded-tr-lg">Closing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stockLogs.map((log) => (
              <tr key={log.id} className="hover:bg-blue-50/30 transition text-sm">
                <td className="p-3 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {log.date}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    <Package className="w-4 h-4 text-primary" />
                    {log.brand_name}
                  </div>
                </td>
                <td className="p-3 text-center text-gray-500 font-bold">{log.opening_stock}</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-700 font-bold">
                    {log.added_quantity > 0 ? <Plus className="w-3 h-3" /> : null}
                    {log.added_quantity}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-red-600 font-bold">
                    {log.sales_quantity > 0 ? <ArrowUpRight className="w-3 h-3" /> : null}
                    {log.sales_quantity}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600 font-bold">
                    {log.return_sales_quantity > 0 ? <ArrowDownRight className="w-3 h-3" /> : null}
                    {log.return_sales_quantity}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-black">
                    {log.closing_stock}
                  </span>
                </td>
              </tr>
            ))}
            {stockLogs.length === 0 && (
              <tr>
                <td colSpan="7" className="p-12 text-center text-gray-400 italic">No stock records found yet. Records appear when stock is changed.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
