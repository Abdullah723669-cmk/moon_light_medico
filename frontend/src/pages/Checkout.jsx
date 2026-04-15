import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    address: '',
    payment_mode: 'COD'
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const subTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customer_name: user.name || '',
        phone_number: user.phone || '',
        address: user.address || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const items = cart.map(item => ({
        medicine_id: item.id,
        quantity: item.quantity
      }));

      const response = await fetch('/api/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          total_cost: subTotal,
          discount_amount: 0,
          delivery_charge: 0,
          items: items
        })
      });

      if (response.ok) {
        const data = await response.json();
        setOrderNumber(data.order_number);
        setOrderPlaced(true);
        clearCart();
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error connecting to server. Is the backend running?");
    }
  };

  // Order success screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Order Submitted!</h2>
          <p className="text-gray-500 mb-2">Your order <span className="font-bold text-primary">{orderNumber}</span> has been received.</p>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Our pharmacy team will review and process your order shortly. You will receive your invoice once the order is confirmed.
          </p>
          <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-sky-600 transition shadow-md">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-600 transition shadow-md">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-10">
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="customer_name">Full Name</label>
                <input 
                  id="customer_name" 
                  name="customer_name" 
                  type="text" 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={formData.customer_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="phone_number">Phone Number</label>
                <input 
                  id="phone_number" 
                  name="phone_number" 
                  type="text" 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="address">Delivery Address</label>
                <textarea 
                  id="address" 
                  name="address" 
                  required 
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <input 
                  id="payment_cod" 
                  name="payment_mode" 
                  type="radio" 
                  value="COD"
                  checked={formData.payment_mode === 'COD'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300" 
                />
                <label htmlFor="payment_cod" className="ml-3 block text-sm font-medium text-gray-700">
                  Cash on Delivery (COD)
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  id="payment_mobile" 
                  name="payment_mode" 
                  type="radio" 
                  value="Mobile Banking"
                  checked={formData.payment_mode === 'Mobile Banking'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300" 
                />
                <label htmlFor="payment_mobile" className="ml-3 block text-sm font-medium text-gray-700">
                  Mobile Banking (bKash / Nagad / Rocket)
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center text-gray-600">
                <span className="font-medium">Items</span>
                <span className="font-bold">{cart.length} item(s)</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-primary">৳{subTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">* Discount and delivery charge will be applied by the pharmacy during order processing.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/cart" className="flex-1 bg-gray-100 text-gray-800 text-center py-3 rounded-lg font-bold hover:bg-gray-200 transition">
              Back to Cart
            </Link>
            <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-sky-600 transition shadow-md">
              Submit Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
