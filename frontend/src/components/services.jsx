import React, { useState, useEffect } from "react";
import "./services.css";

const Services = () => {
  const [quoteData, setQuoteData] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    service: "Residential Painting",
    date: "",
  });

  useEffect(() => {
    const container = document.querySelector(".services-container");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            container.classList.add("active");
          } else {
            container.classList.remove("active");
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

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
       const response = await fetch("http://localhost:5000/api/quote/quote", { // Update URL to /api/quote/quote
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
    <div className="services-page">
      {/* Intro Section */}
      <section className="services-intro-block">
        <div
          className="services-bg"
          style={{ backgroundImage: `url('/services.jpg')` }}
        ></div>
        <div className="services-content">
          <h1 className="services-heading">Our Services</h1>
          <p className="services-subtext">
            Whether you're looking to refresh your space or create a new look,
            our team can help with a range of painting services.
          </p>
        </div>
      </section>

      <div className="services-section">
  <div className="services-container">
    <h2 className="services-title">Explore Our Services</h2>
    <p className="services-description">
      Discover our comprehensive range of services tailored to meet your needs.
    </p>
    {[
      {
        img: "/interiorpainting.jpeg",
        title: "Interior Painting",
        description: [
          "Transform your interiors with our professional interior painting services. We specialize in vibrant, flawless finishes that enhance your living spaces. From bedrooms to living rooms, our expert Toronto painters ensure your home reflects your unique style and personality.",
          "Using eco-friendly paints and premium materials, we deliver exceptional results for every project. Whether it’s a single room or your entire home, our attention to detail and skilled craftsmanship creates a fresh, welcoming atmosphere you’ll love for years to come.",
        ],
      },
      {
        img: "/exteriorpainting.jpg",
        title: "Exterior Painting",
        description: [
          "Revitalize your home’s curb appeal with our exterior painting services in Toronto. We use durable, weather-resistant paints to protect your property while creating a stunning, long-lasting finish. Trust our team to enhance your home’s beauty and value with expert precision.",
          "From facades to decks, our exterior painting solutions are designed to withstand the elements and keep your home looking its best. Our experienced painters prioritize quality, ensuring every surface is flawlessly coated for a polished, professional result you can be proud of.",
        ],
      },
      {
        img: "/cabinetpainting.webp",
        title: "Cabinet Painting",
        description: [
          "Breathe new life into your kitchen or bathroom with our cabinet painting services. We specialize in refinishing cabinets to give them a fresh, modern look. Using high-quality materials, we deliver durable, smooth finishes that transform your space without costly replacements.",
          "Our team of Toronto cabinet refinishing experts ensures precise application for a professional-grade finish. Whether you want a bold new color or a classic refresh, we provide custom solutions tailored to your style and budget, enhancing your cabinets’ durability and appeal.",
        ],
      },
      {
        img: "/commercialpainting.jpg",
        title: "Commercial Painting",
        description: [
          "Elevate your business with our commercial painting services in Toronto. From offices to retail spaces, we create professional, inviting environments that leave lasting impressions. Our skilled painters deliver efficient, high-quality results tailored to your unique needs.",
          "Using premium materials and innovative techniques, we ensure your commercial property reflects your brand’s image. Our team works around your schedule to minimize disruptions, delivering flawless finishes that enhance your space’s functionality and visual appeal.",
        ],
      },
      {
        img: "/condopainting.jpg",
        title: "Condo Painting",
        description: [
          "Our condo painting services offer quick, hassle-free solutions for modern living spaces. Whether it’s a refresh or a complete makeover, our Toronto painters specialize in transforming condos with precision and care, ensuring vibrant, polished results for every project.",
          "We provide tailored condo painting packages to fit your style and budget. From sleek interiors to accent walls, our expert team ensures seamless finishes that enhance your living experience. Trust us for reliable, affordable painting solutions in Toronto’s condos.",
        ],
      },
      {
        img: "/wallpaperinstallation.webp",
        title: "Wallpaper Installation",
        description: [
          "Add elegance and personality to your walls with our professional wallpaper installation services in Toronto. We handle everything from intricate patterns to bold designs, ensuring seamless application and a flawless finish that transforms your space into something extraordinary.",
          "Our team also offers wallpaper removal and repainting services, providing a fresh start for your walls. Whether it’s a feature wall or an entire room, we combine expert craftsmanship with high-quality materials to deliver results that exceed your expectations.",
        ],
      },
    ].map((service, index) => (
      <div
        className={`services-row ${
          index % 2 === 0 ? "row-normal" : "row-reverse"
        }`}
        key={index}
      >
        <div className="service-image-wrapper">
          <img
            src={service.img}
            alt={service.title}
            className="service-image"
          />
        </div>
        <div className="service-content">
          <h3 className="service-title">{service.title}</h3>
          {service.description.map((desc, descIndex) => (
            <p key={descIndex} className="service-description">
              {desc}
            </p>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>



      {/* Quote Section */}
      <div
        className="quote-block"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="quote-overlay"></div>
        <div className="quote-content">
          <h2 className="quote-title">Get a Free Quote</h2>
          <p className="quote-subtitle">
            Ready to bring your vision to life? Contact us today for a free quote
            and let’s get started!
          </p>
        </div>
        <form className="quote-form" onSubmit={handleSubmit}>
          {[{ name: "name", type: "text", placeholder: "Name" },
            { name: "email", type: "email", placeholder: "Email" },
            { name: "phone", type: "text", placeholder: "Phone" },
            { name: "zip", type: "text", placeholder: "ZIP Code" }].map((field, index) => (
            <input
              key={index}
              type={field.type}
              placeholder={field.placeholder}
              className="quote-input"
              name={field.name}
              value={quoteData[field.name]}
              onChange={handleChange}
              required
            />
          ))}
          <select
            className="quote-input"
            name="service"
            value={quoteData.service}
            onChange={handleChange}
            required
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
            required
          />
          <button type="submit" className="quote-btn">
            🚀 GET FREE QUOTE
          </button>
        </form>
      </div>
    </div>
  );
};

export default Services;
