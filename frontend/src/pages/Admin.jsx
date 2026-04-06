import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('medicines');
  const [medicines, setMedicines] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [formData, setFormData] = useState({
    brand_name: '', generic_name: '', category: '', strength: '', is_rx: false, price: '', stock_quantity: '',
    stock_date: '', opening_stock: '', total_sales_quantity: '', closing_stock: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMedicines();
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    const res = await axios.get("/api/prescriptions/");
    setPrescriptions(res.data);
  };

  const fetchMedicines = async () => {
    const res = await axios.get("/api/medicines/");
    setMedicines(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enforce correct data formats to prevent backend validation errors
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock_quantity: parseInt(formData.stock_quantity, 10),
      opening_stock: formData.opening_stock === '' ? null : parseInt(formData.opening_stock, 10),
      total_sales_quantity: formData.total_sales_quantity === '' ? null : parseInt(formData.total_sales_quantity, 10),
      closing_stock: formData.closing_stock === '' ? null : parseInt(formData.closing_stock, 10),
    };

    if (payload.stock_date === '') {
      payload.stock_date = null;
    }

    try {
      if (editingId) {
        await axios.put(`/api/medicines/${editingId}`, payload);
        alert("Medicine updated successfully");
        setEditingId(null);
      } else {
        await axios.post("/api/medicines/", payload);
        alert("Medicine added successfully");
      }
      fetchMedicines();
      setFormData({ brand_name: '', generic_name: '', category: '', strength: '', is_rx: false, price: '', stock_quantity: '', stock_date: '', opening_stock: '', total_sales_quantity: '', closing_stock: '' });
    } catch (error) {
      console.error(error);
      alert("Error saving medicine");
    }
  };

  const handleEdit = (medicine) => {
    setEditingId(medicine.id);
    setFormData({
      brand_name: medicine.brand_name,
      generic_name: medicine.generic_name,
      category: medicine.category,
      strength: medicine.strength,
      is_rx: medicine.is_rx,
      price: medicine.price,
      stock_quantity: medicine.stock_quantity,
      stock_date: medicine.stock_date || '',
      opening_stock: medicine.opening_stock || '',
      total_sales_quantity: medicine.total_sales_quantity || '',
      closing_stock: medicine.closing_stock || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ brand_name: '', generic_name: '', category: '', strength: '', is_rx: false, price: '', stock_quantity: '', stock_date: '', opening_stock: '', total_sales_quantity: '', closing_stock: '' });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/medicines/${id}`);
      fetchMedicines();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRx = async (id) => {
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
      
      <div className="flex border-b mb-8 space-x-2">
        <button 
          className={`py-3 px-6 font-bold text-lg focus:outline-none transition-colors border-b-2 ${activeTab === 'medicines' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('medicines')}
        >
          Manage Medicines
        </button>
        <button 
          className={`py-3 px-6 font-bold text-lg focus:outline-none transition-colors border-b-2 ${activeTab === 'prescriptions' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('prescriptions')}
        >
          Manage Prescriptions
        </button>
      </div>

      {activeTab === 'medicines' && (
        <div>
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{editingId ? "Edit Medicine" : "Add New Medicine"}</h3>
          {editingId && (
            <button onClick={cancelEdit} type="button" className="text-sm text-gray-500 hover:text-gray-700 underline">Cancel Edit</button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="brand_name" value={formData.brand_name} onChange={handleChange} placeholder="Brand Name" required className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          <input name="generic_name" value={formData.generic_name} onChange={handleChange} placeholder="Generic Name" required className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          <input name="strength" value={formData.strength} onChange={handleChange} placeholder="Strength (e.g. 10mg)" required className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Price" required className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          <input name="stock_quantity" type="number" value={formData.stock_quantity} onChange={handleChange} placeholder="Stock Quantity" required className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          
          <input name="stock_date" type="date" value={formData.stock_date} onChange={handleChange} required className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          <input name="opening_stock" type="number" value={formData.opening_stock} onChange={handleChange} placeholder="Today's Opening Stock" className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          <input name="total_sales_quantity" type="number" value={formData.total_sales_quantity} onChange={handleChange} placeholder="Today's Total Sales" className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          <input name="closing_stock" type="number" value={formData.closing_stock} onChange={handleChange} placeholder="Today's Closing Stock" className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          
          <label className="flex items-center gap-2 p-2.5 font-medium text-gray-700 md:col-span-2">
            <input name="is_rx" type="checkbox" checked={formData.is_rx} onChange={handleChange} className="w-5 h-5 text-primary rounded border-gray-300" />
            Is Prescription Required (Rx)?
          </label>
          <div className="col-span-1 md:col-span-2 mt-2">
            <button type="submit" className="w-full bg-primary text-white p-3 rounded-lg font-bold hover:bg-sky-600 transition shadow-sm">
              {editingId ? "Update Medicine" : "Add Medicine"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-xl font-bold mb-4">Existing Medicines (Total: {medicines.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-600 text-sm uppercase">
                <th className="p-3 rounded-tl-lg">ID</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Generic</th>
                <th className="p-3">Type</th>
                <th className="p-3">Price</th>
                <th className="p-3 text-center">Open Qty</th>
                <th className="p-3 text-center">Sales</th>
                <th className="p-3 text-center">Close Qty</th>
                <th className="p-3 rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((m) => (
                <tr key={m.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition">
                  <td className="p-3 text-gray-500">{m.id}</td>
                  <td className="p-3 font-bold text-gray-900">{m.brand_name}</td>
                  <td className="p-3 text-sm text-gray-500">{m.generic_name}</td>
                  <td className="p-3">
                    {m.is_rx ? (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">Rx</span>
                    ) : (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">OTC</span>
                    )}
                  </td>
                  <td className="p-3">৳{m.price}</td>
                  <td className="p-3 text-center font-bold text-gray-700">{m.opening_stock || 0}</td>
                  <td className="p-3 text-center font-bold text-blue-600">{m.total_sales_quantity || 0}</td>
                  <td className="p-3 text-center font-bold text-gray-900">{m.closing_stock || 0}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleEdit(m)} className="text-indigo-500 hover:text-indigo-700 text-sm font-bold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded transition">Edit</button>
                    <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-700 text-sm font-bold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition">Delete</button>
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
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600 text-sm uppercase">
                  <th className="p-3 rounded-tl-lg w-16">ID</th>
                  <th className="p-3">File Path / Image</th>
                  <th className="p-3 w-32">Status</th>
                  <th className="p-3 rounded-tr-lg w-32">Action</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition">
                    <td className="p-3 text-gray-500">{p.id}</td>
                    <td className="p-3 font-medium text-gray-900">
                      <a 
                        href={`/${p.file_path.replace(/\\/g, '/')}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-primary hover:underline flex items-center gap-2"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        {p.file_path}
                      </a>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => handleDeleteRx(p.id)} className="text-red-500 hover:text-red-700 text-sm font-bold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition shadow-sm">Delete</button>
                    </td>
                  </tr>
                ))}
                {prescriptions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">No prescriptions uploaded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
