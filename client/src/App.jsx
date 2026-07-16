import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Catalogue from './pages/Catalogue.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Account from './pages/Account.jsx';
import Docs from './pages/Docs.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Admin from './pages/Admin.jsx';

// Admin-only guard. While auth is resolving we render nothing to avoid a flash.
function RequireAdmin({ children }) {
  const { isAdmin, ready } = useAuth();
  if (!ready) return null;
  return isAdmin ? children : <Navigate to="/account" replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div style={{ background: '#f4f6f8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/product/:sku" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Account />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}
