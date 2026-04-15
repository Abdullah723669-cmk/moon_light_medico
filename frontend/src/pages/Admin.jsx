import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminStockReport from './AdminStockReport';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('medicines');
  const [medicines, setMedicines] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Separate states for Add and Edit forms
  const initialMedicineState = {
    brand_name: '', generic_name: '', category: '', strength: '', is_rx: false, 
    price: '', stock_quantity: '', stock_date: new Date().toISOString().split('T')[0], 
    opening_stock: '', total_sales_quantity: '', closing_stock: '',
    today_added: '', today_returns: ''
  };

  const [addFormData, setAddFormData] = useState(initialMedicineState);
  const [editFormData, setEditFormData] = useState(initialMedicineState);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMedicines();
    fetchPrescriptions();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders/");
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get("/api/prescriptions/");
      setPrescriptions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMedicines = async () => {
    try {
      const res = await axios.get("/api/medicines/");
      setMedicines(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Handlers for Add Form
  const handleAddChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      brand_name: addFormData.brand_name,
      generic_name: addFormData.generic_name,
      category: addFormData.category,
      strength: addFormData.strength,
      is_rx: addFormData.is_rx,
      price: parseFloat(addFormData.price) || 0,
      stock_quantity: parseInt(addFormData.stock_quantity, 10) || 0,
      stock_date: addFormData.stock_date || null,
      opening_stock: parseInt(addFormData.opening_stock, 10) || 0,
      total_sales_quantity: 0,
      closing_stock: parseInt(addFormData.stock_quantity, 10) || 0
    };

    try {
      await axios.post("/api/medicines/", payload);
      alert("Medicine added successfully");
      setAddFormData(initialMedicineState);
      fetchMedicines();
    } catch (error) {
      console.error(error);
      alert("Error adding medicine");
    }
  };

  // Handlers for Edit Form
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      brand_name: editFormData.brand_name,
      generic_name: editFormData.generic_name,
      category: editFormData.category,
      strength: editFormData.strength,
      is_rx: editFormData.is_rx,
      price: parseFloat(editFormData.price) || 0,
      stock_quantity: parseInt(editFormData.stock_quantity, 10) || 0,
      today_added: editFormData.today_added === '' ? null : parseInt(editFormData.today_added, 10),
      today_returns: editFormData.today_returns === '' ? null : parseInt(editFormData.today_returns, 10),
    };

    try {
      await axios.put(`/api/medicines/${editingId}`, payload);
      alert("Medicine updated successfully");
      setEditingId(null);
      fetchMedicines();
    } catch (error) {
      console.error(error);
      alert("Error updating medicine");
    }
  };

  const handleEditAction = (medicine) => {
    setEditingId(medicine.id);
    setEditFormData({
      brand_name: medicine.brand_name,
      generic_name: medicine.generic_name,
      category: medicine.category,
      strength: medicine.strength,
      is_rx: medicine.is_rx,
      price: medicine.price,
      stock_quantity: medicine.stock_quantity,
      stock_date: medicine.stock_date || '',
      opening_stock: medicine.today_opening ?? '',
      total_sales_quantity: medicine.today_sales ?? '',
      closing_stock: medicine.today_closing ?? '',
      today_added: medicine.today_added ?? '',
      today_returns: medicine.today_returns ?? ''
    });
    // Scroll to the Edit section
    const editSection = document.getElementById('edit-medicine-section');
    if (editSection) {
        editSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    try {
      await axios.delete(`/api/medicines/${id}`);
      fetchMedicines();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRx = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prescription?")) return;
    try {
      await axios.delete(`/api/prescriptions/${id}`);
      fetchPrescriptions();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      
      <div className="flex border-b mb-8 space-x-2 overflow-x-auto">
        {['medicines', 'prescriptions', 'orders', 'stock'].map((tab) => (
          <button 
            key={tab}
            className={`py-3 px-6 font-bold text-lg focus:outline-none transition-colors border-b-2 whitespace-nowrap capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'stock' ? 'Stock Report' : `Manage ${tab}`}
          </button>
        ))}
      </div>

      {activeTab === 'medicines' && (
        <div className="space-y-10">
          {/* SECTION 1: ADD MEDICINE */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
            <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
              <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Add New Medicine
            </h3>
            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="brand_name" value={addFormData.brand_name} onChange={handleAddChange} placeholder="Brand Name" required className="border p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
              <input name="generic_name" value={addFormData.generic_name} onChange={handleAddChange} placeholder="Generic Name" required className="border p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
              <input name="category" value={addFormData.category} onChange={handleAddChange} placeholder="Category" required className="border p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
              <input name="strength" value={addFormData.strength} onChange={handleAddChange} placeholder="Strength (e.g. 500mg)" required className="border p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
              <input name="price" type="number" step="0.01" value={addFormData.price} onChange={handleAddChange} placeholder="Price" required className="border p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
              <input name="stock_quantity" type="number" value={addFormData.stock_quantity} onChange={handleAddChange} placeholder="Initial Opening Stock" required className="border p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
              
              <label className="flex items-center gap-2 p-2.5 font-medium text-gray-700 md:col-span-3 bg-gray-50 rounded-lg">
                <input name="is_rx" type="checkbox" checked={addFormData.is_rx} onChange={handleAddChange} className="w-5 h-5 text-primary rounded border-gray-300" />
                Is Prescription Required (Rx)?
              </label>
              
              <button type="submit" className="md:col-span-3 bg-primary text-white p-3 rounded-lg font-bold hover:bg-sky-600 transition shadow-sm">
                Add Medicine to System
              </button>
            </form>
          </div>

          {/* SECTION 2: EDIT MEDICINE (Conditional) */}
          {editingId && (
            <div id="edit-medicine-section" className="bg-white p-6 rounded-xl shadow-lg border-2 border-orange-200 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-orange-600 flex items-center gap-2">
                  <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                  Edit Existing Medicine: {editFormData.brand_name}
                </h3>
                <button onClick={cancelEdit} className="text-sm font-bold text-gray-400 hover:text-red-500 transition underline">Cancel Editing</button>
              </div>
              <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 px-1">Brand Name</label>
                    <input name="brand_name" value={editFormData.brand_name} onChange={handleEditChange} placeholder="Brand Name" required className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 px-1">Generic Name</label>
                    <input name="generic_name" value={editFormData.generic_name} onChange={handleEditChange} placeholder="Generic Name" required className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 px-1">Category</label>
                    <input name="category" value={editFormData.category} onChange={handleEditChange} placeholder="Category" required className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 px-1">Price</label>
                    <input name="price" type="number" step="0.01" value={editFormData.price} onChange={handleEditChange} placeholder="Price" required className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                </div>
                
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 px-1 text-blue-600">Today's Added Quantity</label>
                    <input name="today_added" type="number" value={editFormData.today_added} onChange={handleEditChange} placeholder="Today's Added" className="w-full border border-blue-200 bg-blue-50/50 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 px-1 text-green-600">Today's Returns</label>
                    <input name="today_returns" type="number" value={editFormData.today_returns} onChange={handleEditChange} placeholder="Today's Returns" className="w-full border border-green-200 bg-green-50/50 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold" />
                </div>

                <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-gray-50 rounded-xl border border-dashed">
                    <div className="text-center">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold">Today's Opening</span>
                        <span className="text-lg font-black text-gray-600">{editFormData.opening_stock || 0}</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold text-red-400">Today's Sales</span>
                        <span className="text-lg font-black text-red-600">-{editFormData.total_sales_quantity || 0}</span>
                    </div>
                    <div className="text-center bg-white rounded-lg shadow-inner py-1">
                        <span className="block text-[10px] text-primary uppercase font-bold">Estimated Closing</span>
                        <span className="text-lg font-black text-primary">
                            {(parseInt(editFormData.opening_stock) || 0) + (parseInt(editFormData.today_added) || 0) + (parseInt(editFormData.today_returns) || 0) - (parseInt(editFormData.total_sales_quantity) || 0)}
                        </span>
                    </div>
                    <div className="text-center">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold">Stored Closing</span>
                        <span className="text-lg font-black text-gray-900 underline">{editFormData.closing_stock || 0}</span>
                    </div>
                </div>

                <button type="submit" className="md:col-span-3 bg-orange-500 text-white p-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-md mt-2 flex items-center justify-center gap-2">
                  Apply Updates to {editFormData.brand_name}
                </button>
              </form>
            </div>
          )}

          {/* SECTION 3: EXISTING MEDICINES TABLE */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center justify-between">
                <span>Existing Medicines (Total: {medicines.length})</span>
                <span className="text-xs font-normal text-gray-400">Scroll right to see all logs</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                    <th className="p-3 font-bold rounded-tl-lg">ID</th>
                    <th className="p-3 font-bold">Brand Name</th>
                    <th className="p-3 font-bold text-center">Opening</th>
                    <th className="p-3 font-bold text-center text-blue-600">Added</th>
                    <th className="p-3 font-bold text-center text-red-600">Sales</th>
                    <th className="p-3 font-bold text-center text-green-600">Returns</th>
                    <th className="p-3 font-bold text-center">Closing</th>
                    <th className="p-3 font-bold rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {medicines.map((m) => (
                    <tr key={m.id} className={`border-b border-gray-100 hover:bg-blue-50/30 transition text-sm ${editingId === m.id ? 'bg-orange-50/50' : ''}`}>
                      <td className="p-3 text-gray-400">#{m.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-gray-900">{m.brand_name}</div>
                        <div className="text-xs text-gray-500">{m.generic_name}</div>
                        {m.is_rx && <span className="text-[10px] bg-red-50 text-red-600 font-black px-1.5 py-0.5 rounded uppercase mt-1 inline-block">Rx Required</span>}
                      </td>
                      <td className="p-3 text-center font-bold text-gray-500">{m.today_opening}</td>
                      <td className="p-3 text-center font-bold text-blue-700">
                        {m.today_added > 0 ? `+${m.today_added}` : m.today_added}
                      </td>
                      <td className="p-3 text-center font-bold text-red-600">
                        {m.today_sales > 0 ? `-${m.today_sales}` : m.today_sales}
                      </td>
                      <td className="p-3 text-center font-bold text-green-600">
                        {m.today_returns > 0 ? `+${m.today_returns}` : m.today_returns}
                      </td>
                      <td className="p-3 text-center">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-black">
                          {m.today_closing}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEditAction(m)} className={`p-2 rounded-lg transition font-bold ${editingId === m.id ? 'bg-orange-500 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`} title="Edit">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(m.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                            Delete
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
      )}

      {activeTab === 'prescriptions' && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-4">Uploaded Prescriptions (Total: {prescriptions.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                  <th className="p-3 rounded-tl-lg w-16">ID</th>
                  <th className="p-3">Prescription Image</th>
                  <th className="p-3 w-40">Status</th>
                  <th className="p-3 rounded-tr-lg w-32">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {prescriptions.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition border-b">
                    <td className="p-3 text-gray-400">#{p.id}</td>
                    <td className="p-3">
                      <a href={`/api/prescriptions/view/${p.id}`} target="_blank" rel="noreferrer" className="block w-32 h-32 border rounded-lg overflow-hidden bg-gray-100 hover:opacity-80 transition">
                         <img 
                          src={`/api/prescriptions/view/${p.id}`} 
                          alt="Rx" 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Prescription"; }}
                         />
                      </a>
                    </td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button onClick={() => handleDeleteRx(p.id)} className="text-red-500 hover:text-red-700 font-bold bg-red-50 px-3 py-1.5 rounded transition">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Customer Orders (Total: {orders.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                  <th className="p-3 rounded-tl-lg">Inv #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Total</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 rounded-tr-lg text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 italic">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-blue-50/30 transition text-sm">
                    <td className="p-3 font-bold text-gray-700">{o.invoice_number}</td>
                    <td className="p-3">
                      <div className="font-bold text-gray-900">{o.customer_name}</div>
                      <div className="text-xs text-gray-500">{o.phone_number}</div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-medium">{o.payment_mode}</span>
                    </td>
                    <td className="p-3 font-black text-gray-900">৳{o.total_cost}</td>
                    <td className="p-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Link to={`/admin/invoice/${o.invoice_number}`} className="bg-primary text-white text-xs px-4 py-2 rounded-lg font-bold hover:bg-sky-600 transition shadow-sm inline-block">
                        View Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'stock' && <AdminStockReport />}
    </div>
  );
}
