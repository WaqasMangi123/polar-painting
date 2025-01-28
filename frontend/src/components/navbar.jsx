import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For React Router navigation
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track if the menu is open

  // Toggle the navbar menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <Link to="/">
          <img src="/logo2.png" alt="Company Logo" className="logo" />
        </Link>
      </div>

      {/* Hamburger Menu with Close Option */}
      <div className="navbar-toggle" onClick={toggleMenu}>
        {isMenuOpen ? (
          <div className="close-icon">&times;</div> // Close icon
        ) : (
          <>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <nav className={`navbar-links ${isMenuOpen ? 'show' : ''}`}>
        <ul>
          <li><Link to="/" className="nav-link" onClick={toggleMenu}>HOME</Link></li>
          <li><Link to="/about" className="nav-link" onClick={toggleMenu}>ABOUT</Link></li>
          <li><Link to="/services" className="nav-link" onClick={toggleMenu}>SERVICES</Link></li>
          <li><Link to="/faq" className="nav-link" onClick={toggleMenu}>FAQS</Link></li>
          <li><Link to="/blog" className="nav-link" onClick={toggleMenu}>BLOG</Link></li>
          <li><Link to="/contact" className="nav-link" onClick={toggleMenu}>CONTACT</Link></li>
        </ul>
      </nav>

      {/* Contact Section */}
      <div className="navbar-contact">
        <a href="tel:+4162387373" className="contact-button">
          <i className="fa fa-phone"></i> (647) 366-3737
        </a>
        <Link to="/costestimator" className="contact-button estimator-button">
          Estimator
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
