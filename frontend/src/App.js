import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './components/home';
import About from './components/about';
import Services from './components/services';
import FAQHeader from './components/faq';
import Contact from './components/contact';
import Blog from './components/blog';
import CostEstimator from './components/costestimator';  // Import the new page
import TermsAndCondition from './components/termsandcondition'; // Import the Terms and Conditions page

// Admin Components
import AdminLogin from './components/adminlogin';
import AdminPanel from './components/adminpanel';
import AdminBlog from './components/adminblog';

function App() {
  const location = useLocation();
  
  // Admin routes don't need the Navbar and Footer
  const isAdminRoute = location.pathname === '/adminlogin' || location.pathname === '/adminpanel' || location.pathname === '/adminblog';

  return (
    <div className="App">
      {/* Conditionally render Navbar and Footer based on route */}
      {!isAdminRoute && <Navbar />}  {/* Show Navbar for public routes */}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/faq" element={<FAQHeader />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/costestimator" element={<CostEstimator />} /> {/* Add Cost Estimator route */}
        <Route path="/termsandcondition" element={<TermsAndCondition />} /> {/* Add Terms and Conditions route */}
        
        {/* Admin Routes */}
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
        <Route path="/adminblog" element={<AdminBlog />} />
        
        {/* Catch-all Route */}
        <Route path="*" element={<Home />} />
      </Routes>

      {/* Show Footer for public routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
