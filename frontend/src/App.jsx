import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Admin from './pages/Admin';
import AdminRoute from './components/AdminRoute';
import UploadRx from './pages/UploadRx';
import FastDelivery from './pages/FastDelivery';
import Blog from './pages/Blog';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import ReturnPolicy from './pages/ReturnPolicy';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import AdminInvoice from './pages/AdminInvoice';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/upload-rx" element={<UploadRx />} />
              <Route path="/delivery" element={<FastDelivery />} />
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/admin/invoice/:invoice_number" element={<AdminRoute><AdminInvoice /></AdminRoute>} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/policy" element={<ReturnPolicy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/invoice/:invoice_number" element={<Invoice />} />
            </Routes>
          </main>
        </div>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
