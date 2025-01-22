import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./home.css";
import Footer from "./footer";
import Navbar from "./navbar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaCouch, FaPlug, FaPaintRoller, FaDoorOpen, FaTape, FaBrush } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const Home = () => {
  const [quoteData, setQuoteData] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    service: "Residential Painting",
    date: "",
  });

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    pauseOnHover: true,
    lazyLoad: "ondemand",
    accessibility: true,
  };

  const sliderImages = [
    "/backgroundhomepage.jpg",
    "/backgroundhomepage2.jpg",
    "/backgroundhomepage3.jpg",
    "/backgroundhomepage4.jpg",
    "/backgroundhomepage5.jpg",
  ];

  useEffect(() => {
    const targets = document.querySelectorAll(
      ".quote-block, .block-3, .block-4, .block-5"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          } else {
            entry.target.classList.remove("active");
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the block is visible
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect(); // Clean up the observer on component unmount
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuoteData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validate the date input to ensure it's not in the past
  const handleDateChange = (e) => {
    const today = new Date().toISOString().split("T")[0];
    if (e.target.value < today) {
      e.target.setCustomValidity("Please select a future date.");
    } else {
      e.target.setCustomValidity("");
    }
    handleChange(e);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!quoteData.name || !quoteData.email || !quoteData.phone || !quoteData.zip || !quoteData.date) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("https://polar-painting-backend.onrender.com/api/quote/quote", { // Update URL to /api/quote/quote
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quoteData), // Sending the form data
      });

      if (response.ok) {
        alert("Your quote has been sent!");
        setQuoteData({ name: "", email: "", phone: "", zip: "", service: "Residential Painting", date: "" }); // Reset the form
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error sending form data:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />

     {/* Hero Section */}
<div className="hero-slider">
  <Slider {...sliderSettings} aria-label="Hero Image Slider">
    {sliderImages.map((image, index) => (
      <div key={index} className="slider-item">
        <img
          src={image}
          alt={`Background slide ${index + 1}`}
          className="slider-image"
        />
      </div>
    ))}
  </Slider>
  <div className="overlay">
    <div className="content">
      <h1 className="hero-title">Toronto's Best Professional Painting Services</h1>
      <p className="hero-subtitle">
        Reliable Painters for all Residential and Commercial Projects
      </p>
      <div className="buttons">
        <button className="btn-primary" aria-label="Get Started">
          Get Started
        </button>
        <Link to="/costestimator">
          <button className="btn-secondary" aria-label="Get Quote">
            Get Quote
          </button>
        </Link>
      </div>
    </div>
  </div>
</div>


      {/* Quote Block with Image Background */}
      <div
        className="quote-block"
        data-animate="true"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="quote-overlay"></div>

        {/* Content */}
        <div className="quote-content">
          <h2 className="quote-title">Get a Free Quote</h2>
          <p className="quote-subtitle">
          Affordable, Professional Painting Services Toronto Residents Rely On
          </p>
        </div>

        {/* Form */}
        <form className="quote-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="quote-input"
            name="name"
            value={quoteData.name}
            onChange={handleChange}
            required
            aria-label="Your full name"
          />
          <input
            type="email"
            placeholder="Email"
            className="quote-input"
            name="email"
            value={quoteData.email}
            onChange={handleChange}
            required
            aria-label="Your email address"
          />
          <input
            type="text"
            placeholder="Phone"
            className="quote-input"
            name="phone"
            value={quoteData.phone}
            onChange={handleChange}
            required
            aria-label="Your phone number"
          />
          <input
            type="text"
            placeholder="Postal Code"
            className="quote-input"
            name="zip"
            value={quoteData.zip}
            onChange={handleChange}
            required
            aria-label="Your ZIP code"
          />
          <select
            className="quote-input"
            name="service"
            value={quoteData.service}
            onChange={handleChange}
            required
            aria-label="Select the type of service"
          >
            <option value="Residential Painting">Residential Painting</option>
            <option value="Commercial Painting">Commercial Painting</option>
            <option value="Interior Painting">Interior Painting</option>
            <option value="Exterior Painting">Exterior Painting</option>
          </select>
          <input
            type="date"
            className="quote-input"
            name="date"
            value={quoteData.date}
            onChange={handleDateChange}
            min={new Date().toISOString().split("T")[0]} // Ensures the date is not in the past
            required
            aria-label="Select a preferred date for the service"
          />
          <button type="submit" className="quote-btn">
            🚀 GET FREE QUOTE
          </button>
        </form>
      </div>

    {/* Block 3 */}
<div className="block-3">
  <div className="block-3-content">
    <h2 className="block-3-title">
      Transform Your Space with Professional Home Painting Services in Toronto
    </h2>
    <p className="block-3-description">
      Elevate your home's aesthetic with our professional home painting services in Toronto.
      From interiors to exteriors, we deliver precision and style. Trust our Toronto painting
      experts for eco-friendly materials, skilled painters, and exceptional results.
    </p>
    <div className="block-3-icons">
      <div className="block-3-icon">
        <i className="fas fa-paint-roller"></i>
        <h4>Experienced Painters</h4>
        <p>
          Our team of Toronto painters brings years of expertise, guaranteeing smooth finishes
          and lasting results for your home or business.
        </p>
      </div>
      <div className="block-3-icon">
        <i className="fas fa-brush"></i>
        <h4>Quality over Quantity</h4>
        <p>
          We emphasize delivering exceptional craftsmanship, focusing on detail to ensure
          every painting project exceeds expectations.
        </p>
      </div>
    </div>
    {/* ABOUT US Button with Link */}
    <Link to="/about">
      <button className="block-3-btn">ABOUT US</button>
    </Link>
  </div>
  <div className="block-3-image">
    <img src="/block3.webp" alt="Professional Home Painting" />
  </div>
</div>

      {/* Block 4 - Our Services */}
      <div className="block-4">
        <h2 className="block-4-title">Our Services</h2>
        <p className="block-4-subtitle">
        We provide comprehensive painting solutions, including interior, exterior, cabinet, and
condo painting, plus wallpaper installation. Choose our Toronto painters for unmatched
quality and affordable rates.
        </p>
        <div className="block-4-cards">
          <div className="service-card">
            <img src="/interiorpainting.jpeg" alt="Interior Painting" />
            <h3>Interior Painting</h3>
            <p> Luxury Interior Painting Services in Toronto for Vibrant, Stylish Homes</p>
          </div>
          <div className="service-card">
            <img src="/exteriorpainting.jpg" alt="Exterior Painting" />
            <h3>Exterior Painting</h3>
            <p> Durable, Affordable Exterior Painting Services for Toronto Homes</p>
          </div>
          <div className="service-card">
            <img src="/cabinetpainting.webp" alt="Cabinet Painting" />
            <h3>Cabinet Painting</h3>
            <p> Toronto Cabinet Refinishing Experts for Kitchens and Bathrooms</p>
          </div>
          <div className="service-card">
            <img src="/commercialpainting.jpg" alt="Commercial Painting" />
            <h3>Commercial Painting</h3>
            <p> Affordable, High-Quality Commercial Painting Services in Toronto</p>
          </div>
          <div className="service-card">
            <img src="/condopainting.jpg" alt="Condo Painting" />
            <h3>Condo Painting</h3>
            <p> Quick Turnaround Condo Painting by Expert Toronto Painters</p>
          </div>
          <div className="service-card">
            <img src="/wallpaperinstallation.webp" alt="Wallpaper Installation" />
            <h3>Wallpaper Installation</h3>
            <p> Seamless Wallpaper Installation & Painting Services Toronto Loves</p>
          </div>
        </div>
      </div>

    {/* Block 5 - Professional Home Painting */}
<div className="block-5">
  <div className="block-5-container">
    {/* Image Section */}
    <div className="block-5-image">
      <img src="/block5.jpg" alt="Professional Painting Services" />
    </div>

    {/* Content Section */}
    <div className="block-5-content">
      <h2 className="block-5-title">
        Professional Home Painting Services: Transform Your Home Inside and Out
      </h2>
      <p className="block-5-description">
     Transform interiors and exteriors with affordable painting services Toronto residents’
trust. Our professional painters deliver eco-friendly solutions, vibrant finishes, and
unparalleled precision for every project.
      </p>

      {/* Features Section */}
      <div className="block-5-features">
        <div className="feature">
          <i className="fas fa-paint-roller"></i>
          <div>
            <h4>Skilled Painters</h4>
            <p>Toronto Painting Experts with Precision and Style</p>
          </div>
        </div>
        <div className="feature">
          <i className="fas fa-leaf"></i>
          <div>
            <h4>Eco-Friendly Painting</h4>
            <p>: Best Eco-Friendly Painting Contractors Toronto Has to Offer</p>
          </div>
        </div>
        <div className="feature">
          <i className="fas fa-tools"></i>
          <div>
            <h4>High-Quality Materials</h4>
            <p>Premium Paints and Materials for Durable, Stunning Results</p>
          </div>
        </div>
        <div className="feature">
          <i className="fas fa-check-circle"></i>
          <div>
            <h4>Attention to Detail</h4>
            <p>Meticulous Toronto Painters Focused on Every Detail.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


    



<div className="prep-block-container">
  <h1 className="block-title">Polar Painting's Perfect Prep</h1>
  <div className="prep-block">
    <div className="prep-item">
      <FaCouch className="icon" />
      <h2>Covering All Furniture</h2>
      <p>
        We protect all furniture by covering it with durable materials to
        safeguard your belongings while maintaining a clean workspace.
      </p>
    </div>
    <div className="prep-item">
      <FaPlug className="icon" />
      <h2>Removing Wall Socket Covers</h2>
      <p>
        Wall socket and switch covers are removed to ensure even paint
        coverage, preventing accidental drips for a seamless finish.
      </p>
    </div>
    <div className="prep-item">
      <FaPaintRoller className="icon" />
      <h2>Sanding & Applying Primer</h2>
      <p>
        Walls are sanded to smooth imperfections and coated with primer for
        better adhesion and a flawless finish.
      </p>
    </div>
    <div className="prep-item">
      <FaDoorOpen className="icon" />
      <h2>Sanding & Painting Doors</h2>
      <p>
        Doors and frames are sanded and repainted to restore their
        appearance, adding protection and style.
      </p>
    </div>
    <div className="prep-item">
      <FaTape className="icon" />
      <h2>Taping as Required</h2>
      <p>
        Painter's tape is applied for sharp, professional lines, ensuring a clean and precise finish.
      </p>
    </div>
    <div className="prep-item">
      <FaBrush className="icon" />
      <h2>Applying Two Coats of Paint</h2>
      <p>
        Two coats of paint ensure even coverage and vibrant color, giving a durable and beautiful result.
      </p>
    </div>
  </div>
  <div className="learn-more-container">
    <a href="/termsandcondition" className="learn-more-button">
      Learn More
    </a>
  </div>
</div>


<div className="block-8">
  {/* Background Image */}
  <div className="block-8-background">
    <img src="https://images.pexels.com/photos/6764289/pexels-photo-6764289.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Background" className="block-8-bg-image" />
  </div>

  {/* Overlay */}
  <div className="block-8-overlay"></div>

  {/* Content */}
  <div className="block-8-content">
    <h2 className="block-8-title">Contact Us for a Free Quote Today!</h2>
    <p className="block-8-description">
   Discover Why We’re the Best Painters in Toronto for All Your Painting Needs
    </p>

    {/* Divider */}
    <div className="block-8-divider"></div>

    {/* Contact Information */}
    <div className="block-8-contact">
      <button className="block-8-phone">
        <i className="fas fa-phone-alt"></i> (647) 366-3737
      </button>
      <div className="block-8-links">
        <span>
          <i className="fas fa-envelope"></i> info@polarpainting.ca
        </span>
        <span>
          <i className="fas fa-paper-plane"></i> Contact Us
        </span>
      </div>
    </div>
  </div>
</div>





    </div>
  );
};

export default Home;