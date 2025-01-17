import React, { useState, useEffect, useRef } from "react";
import "./faq.css";

const FAQHeader = () => {
  const backgrounds = ["faq1.jpg", "faq2.jpg", "faq3.jpg"];
  const [currentBackground, setCurrentBackground] = useState(0);
  const faqRefs = useRef([]);
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const block3Ref = useRef(null);
  const [block3Visible, setBlock3Visible] = useState(false);

  const [quoteData, setQuoteData] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    service: "Residential Painting",
    date: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  // Intersection Observer for FAQ questions
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleQuestions((prev) => {
              if (!prev.includes(entry.target.dataset.index)) {
                return [...prev, entry.target.dataset.index];
              }
              return prev;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    faqRefs.current.forEach((faq) => {
      if (faq) observer.observe(faq);
    });

    return () => {
      faqRefs.current.forEach((faq) => {
        if (faq) observer.unobserve(faq);
      });
    };
  }, []);

  // Intersection Observer for Block 3
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBlock3Visible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (block3Ref.current) {
      observer.observe(block3Ref.current);
    }

    return () => {
      if (block3Ref.current) {
        observer.unobserve(block3Ref.current);
      }
    };
  }, []);

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What types of painting services do you offer?",
      answer:
        "We offer a wide range of painting services to meet all your needs. These include residential interior and exterior painting, commercial painting for businesses, cabinet refinishing, condo painting tailored to urban living spaces, and office painting designed to enhance professional environments. No matter the project, our experienced team provides quality craftsmanship and precision to ensure exceptional results every time.",
    },
    {
      question: "How do I get started with your painting services?",
      answer:
        "Getting started with Polar Painting is simple and convenient. You can call us directly to discuss your project and schedule a consultation or submit a contact form on our website with your details. Our team will respond promptly to guide you through the process, provide a free estimate, and ensure a seamless start to your painting project. We’re here to make the process as stress-free as possible from the very first step.",
    },
    {
      question: "How long does a typical painting project take?",
      answer:
        "The duration of a painting project depends on the size and scope of the work. Most residential or office projects can be completed within 1-3 days. For larger or more complex jobs, timelines may vary. We always provide an estimated completion time during your consultation and work efficiently without compromising quality, ensuring the best results within a reasonable timeframe.",
    },
    {
      question: "What types of paint do you use?",
      answer:
        "At Polar Painting, we exclusively use Benjamin Moore Regal paint for all projects. This high-quality paint offers superior coverage, durability, and a smooth, flawless finish. It’s an excellent choice for long-lasting beauty and easy maintenance. By using this premium product, we ensure every project reflects the quality our clients deserve.",
    },
    {
      question: "Can you help me choose the right colors?",
      answer:
        "Yes, we offer expert color consultations to help you select the perfect shades for your space. Our team provides personalized recommendations based on your style, lighting, and the mood you want to create. Whether you’re looking for bold accents or calming neutrals, we’ll guide you through the process to find colors that bring your vision to life.",
    },
    {
      question: "Are your painters insured?",
      answer:
        "Yes, both Polar Painting as a company and all our employees are fully insured. This ensures that your property and our team are protected throughout the painting process. Our commitment to safety and professionalism gives you peace of mind, knowing you’re working with a reliable and reputable painting service.",
    },
    {
      question: "What happens if I'm not satisfied with the work?",
      answer:
        "At Polar Painting, your satisfaction is our top priority. If you’re not happy with the results, we’ll address your concerns promptly and work to resolve the issue to your satisfaction. We stand behind our quality craftsmanship and will make necessary adjustments to ensure the final result meets your expectations.",
    },
    {
      question: "Do you provide warranties on your painting services?",
      answer:
        "Yes, we offer a 12-month warranty on all our painting services. This warranty covers workmanship and ensures your peace of mind. Some restrictions apply, so please review our terms and conditions for full details. Our goal is to provide long-lasting quality you can trust.",
    },
    {
      question: "Do you handle surface preparation before painting?",
      answer:
        "Absolutely. We take great pride in our preparation process to ensure the best final results. This includes sanding, cleaning, and degreasing surfaces as needed, as well as applying primer where necessary. By focusing on proper prep, we create a smooth foundation for flawless, durable finishes.",
    },
    {
      question: "What safety measures do you follow during projects?",
      answer:
        "Safety is a top priority at Polar Painting. We follow strict protocols to protect your property, our team, and the environment. This includes using eco-friendly paints, wearing protective equipment, ensuring proper ventilation, and adhering to safety regulations on ladders and scaffolding.",
    },
    {
      question: "Can you accommodate special schedules?",
      answer:
        "Yes, we’re flexible and can accommodate all scheduling needs. Whether you require last-minute painting services or prefer to book weeks or months in advance, we’ll work around your timeline. Our goal is to provide reliable service that fits seamlessly into your schedule.",
    },
    {
      question: "Do you require a deposit?",
      answer:
        "Yes, we require a 50% deposit of the final estimate total upon booking, with the remaining 50% due at the end of the project. The deposit secures your spot on our schedule, allows us to purchase necessary materials, and ensures commitment from both parties. This process helps us maintain efficiency and excellent service quality.",
    },
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
    <>
      {/* Header Section */}
      <div
        className="faq-header"
        style={{ backgroundImage: `url(${backgrounds[currentBackground]})` }}
      >
        <div className="faq-overlay">
          <h1 className="faq-title">FAQ</h1>
          <p className="faq-subtitle">Frequently Asked Questions</p>
        </div>
        <div className="faq-wave">
          <svg
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              d="M0,320L60,288C120,256,240,192,360,176C480,160,600,192,720,202.7C840,213,960,203,1080,176C1200,149,1320,107,1380,85.3L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* FAQ Block Section */}
      <div className="faq-block2-full">
        <div className="faq-block2">
          <h2 className="faq-block2-title">
            Have a query regarding our services? Check out our FAQs for answers!
          </h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div
                ref={(el) => (faqRefs.current[index] = el)}
                data-index={index}
                className={`faq-item ${
                  visibleQuestions.includes(index.toString())
                    ? "animate-faq"
                    : ""
                } ${activeIndex === index ? "active" : ""}`}
                key={index}
              >
                <div
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <span className="faq-icon">
                    {activeIndex === index ? "-" : "+"}
                  </span>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
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
    
    </>
  );
};

export default FAQHeader;
