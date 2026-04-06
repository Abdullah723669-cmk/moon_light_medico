import { Link } from 'react-router-dom';
import { ShoppingCart, Stethoscope, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Stethoscope className="text-primary w-8 h-8" />
              <span className="font-bold text-2xl text-gray-900">Moon Light Medico</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="text-gray-600 hover:text-primary transition font-medium">About Us</Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary transition font-medium">Contact Us</Link>
            <Link to="/policy" className="text-gray-600 hover:text-primary transition font-medium">Policy</Link>
            <Link to="/blog" className="text-gray-600 hover:text-primary transition font-medium">Blog</Link>
            {user?.isAdmin && (
              <Link to="/admin" className="text-gray-600 hover:text-primary transition font-medium">Admin</Link>
            )}
            <Link to="/cart" className="relative cursor-pointer text-gray-600 hover:text-primary transition block">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  You are logged in
                </span>
                <button onClick={logout} className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition font-medium px-2 py-2">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-sky-600 transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
