import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Section */}
      <div className="footer-top">
        {/* Column 1: Logo and About */}
        <div className="footer-column">
          <div className="footer-logo">
            <img src="/logo2.png" alt="Polar Painting Logo" />
          </div>
          <p className="footer-about">
            Delivering premium painting services with customized solutions for
            every space.
          </p>
          <p>
            <a href="tel:+4162387373" className="footer-phone">
              Call Us: (647) 366-3737
            </a>
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
          <h3 className="footer-subtitle">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/adminlogin">Admin</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/faq">FAQs</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/costestimator">Estimator</Link> {/* New Quick Link Added */}
            </li>
          </ul>
        </div>

        {/* Column 3: Our Services */}
        <div className="footer-column">
          <h3 className="footer-subtitle">Our Services</h3>
          <ul className="footer-links">
            <li>
              <Link to="/services">Interior Painting</Link>
            </li>
            <li>
              <Link to="/services">Exterior Painting</Link>
            </li>
            <li>
              <Link to="/services">Cabinet Painting</Link>
            </li>
            <li>
              <Link to="/services">Commercial Painting</Link>
            </li>
            <li>
              <Link to="/services">Condo Painting</Link>
            </li>
            <li>
              <Link to="/services">Wallpaper Installation</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Get in Touch */}
        <div className="footer-column">
          <h3 className="footer-subtitle">Contact Information</h3>
          <ul className="footer-contact">
            <li>
              <i className="fas fa-map-marker-alt"></i> 4141 Yonge St, North York, ON M2P 2A6
            </li>
            <li>
              <i className="fas fa-envelope"></i>{" "}
              <a href="mailto:info@polarpainting.ca">
                info@polarpainting.ca
              </a>
            </li>
            <li>
              <i className="fas fa-phone-alt"></i>{" "}
              <a href="tel:+14162387373">(647) 366-3737</a>
            </li>
            <li>
              <i className="fas fa-clock"></i> Mon - Sun: 7 AM - 11 PM
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>
            &copy; {new Date().getFullYear()} Polar Painting. All rights
            reserved.
          </p>
          <div className="footer-policies">
            <Link to="/termsandcondition">Terms & Conditions</Link> |{" "}
            <Link to="/termsandcondition">Privacy Policy</Link>
          </div>
          <p>
            Powered by{" "}
            <a
              href="https://techprimesolution.com"
              target="_blank"
              rel="noreferrer"
            >
              TechPrimeSolution
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;