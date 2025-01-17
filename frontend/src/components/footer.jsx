import React from "react";
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
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about-us">About Us</a>
            </li>
            <li>
              <a href="/services">Services</a>
            </li>
            <li>
              <a href="/contact-us">Contact Us</a>
            </li>
            <li>
              <a href="/faqs">FAQs</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
          </ul>
        </div>

        {/* Column 3: Our Services */}
        <div className="footer-column">
          <h3 className="footer-subtitle">Our Services</h3>
          <ul className="footer-links">
            <li>
              <a href="/services/interior-painting">Interior Painting</a>
            </li>
            <li>
              <a href="/services/exterior-painting">Exterior Painting</a>
            </li>
            <li>
              <a href="/services/cabinet-painting">Cabinet Painting</a>
            </li>
            <li>
              <a href="/services/commercial-painting">Commercial Painting</a>
            </li>
            <li>
              <a href="/services/condo-painting">Condo Painting</a>
            </li>
            <li>
              <a href="/services/wallpaper-installation">Wallpaper Installation</a>
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
            <a href="/terms-and-conditions">Terms & Conditions</a> |{" "}
            <a href="/privacy-policy">Privacy Policy</a>
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
