import React, { useEffect } from "react";
import "./about.css";
import Navbar from "./navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaPaintBrush,
  FaLeaf,
  FaHandshake,
  FaAward,
  FaUsers,
  FaClock,
} from "react-icons/fa";
const AboutUs = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
    });

    // Counter Animation
    const counters = document.querySelectorAll(".stat-number");
    const speed = 200;

    const startCounter = (counter) => {
      const target = +counter.getAttribute("data-target");
      const increment = target / speed;

      const updateCount = () => {
        const count = +counter.innerText.replace("+", "");
        if (count < target) {
          counter.innerText = `${Math.ceil(count + increment)}+`;
          setTimeout(updateCount, 10);
        } else {
          counter.innerText = `${target}+`;
        }
      };

      updateCount();
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    counters.forEach((counter) => observer.observe(counter));
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* About Us Section with Wave */}
      <section className="about-us-block">
        <div className="about-us-overlay" aria-hidden="true"></div>
        <div className="about-us-content" data-aos="fade-up">
          <h1 className="about-us-title">About Us</h1>
          <p className="about-us-subtitle">
            About Toronto’s Best Painting Company
          </p>
        </div>
        <div className="wave-shape" aria-hidden="true"></div>
      </section>

      {/* About Exqute Block */}
      <section className="about-exqute-block">
        <div className="about-exqute-container">
          <div className="about-exqute-text" data-aos="fade-left">
            <h2 className="about-exqute-title">Who We Are</h2>
            <h3 className="about-exqute-subtitle">About Polar Painting</h3>
            <p>
              Polar Painting is a trusted provider of residential and commercial
              painting services in Toronto. We specialize in transforming spaces
              with precision, care, and attention to detail. Our expert painters
              use premium materials and innovative techniques to deliver
              exceptional results that last for years to come.
            </p>
            <p>
              With a reputation for quality and reliability, Polar Painting has
              become a go-to choice for homeowners and businesses alike. We are
              proud to offer a wide range of services, including interior and
              exterior painting, cabinet refinishing, and wallpaper
              installation, tailored to meet the unique needs of every client.
            </p>
          </div>

          <div className="about-exqute-image" data-aos="fade-right">
            <img
              src="https://images.unsplash.com/photo-1533779283484-8ad4940aa3a8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Professional Painting Services"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision Block */}
      <section className="mission-vision-block" data-aos="fade-up">
        <h2 className="section-heading">Our Mission & Vision</h2>
        <div className="mission-vision-container">
          <div className="mission-block hover-block">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h3 className="block-title">Our Mission</h3>
              </div>
              <div className="flip-card-back">
                <p>
                  At Polar Painting, our mission is to provide exceptional
                  painting services that enhance the beauty, value, and comfort
                  of every space we touch. We strive to combine artistry,
                  innovation, and eco-friendly practices to deliver flawless
                  results. By focusing on customer satisfaction and long-term
                  relationships.
                </p>
              </div>
            </div>
          </div>

          <div className="vision-block hover-block">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h3 className="block-title">Our Vision</h3>
              </div>
              <div className="flip-card-back">
                <p>
                  Our vision is to become Toronto’s leading painting service
                  provider, known for quality, reliability, and sustainable
                  practices. We aim to set the standard in the industry by
                  delivering exceptional craftsmanship, leveraging advanced
                  techniques, and exceeding customer expectations. At Polar
                  Painting, we aspire to make every project a masterpiece that
                  inspires pride and joy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Block */}
      <section className="stats-block" data-aos="fade-up">
        <div className="stats-container">
          {/* Box 1 */}
          <div className="stat-item">
            <h3 className="stat-number" data-target="150">0+</h3>
            <p className="stat-label">Homes Painted</p>
            <div className="underline"></div>
          </div>
          {/* Box 2 */}
          <div className="stat-item">
            <h3 className="stat-number" data-target="100">0+</h3>
            <p className="stat-label">Offices Painted</p>
            <div className="underline"></div>
          </div>
          {/* Box 3 */}
          <div className="stat-item">
            <h3 className="stat-number" data-target="200">0+</h3>
            <p className="stat-label">Satisfied Customers</p>
            <div className="underline"></div>
          </div>
        </div>
      </section>

      {/* Our Values Block with Image Background */}
<section className="values-block" data-aos="fade-up">
<div className="values-section-container">
      <h1 className="section-title">Our Values</h1>
      <div className="values-grid">
        {/* Excellence */}
        <div className="value-card">
          <FaAward className="icon" />
          <h3>Excellence</h3>
          <h4>
            Committed to delivering exceptional craftsmanship and results on every painting
            project we undertake.
          </h4>
        </div>

        {/* Integrity */}
        <div className="value-card">
          <FaHandshake className="icon" />
          <h3>Integrity</h3>
          <h4>
            We uphold honesty, transparency, and professionalism in all interactions with clients
            and partners.
          </h4>
        </div>

        {/* Innovation */}
        <div className="value-card">
          <FaPaintBrush className="icon" />
          <h3>Innovation</h3>
          <h4>
            Embracing the latest tools, techniques, and trends to provide modern, efficient
            painting solutions.
          </h4>
        </div>

        {/* Sustainability */}
        <div className="value-card">
          <FaLeaf className="icon" />
          <h3>Sustainability</h3>
          <h4>
            Dedicated to using eco-friendly paints and materials to minimize environmental impact.
          </h4>
        </div>

        {/* Customer Focus */}
        <div className="value-card">
          <FaUsers className="icon" />
          <h3>Customer Focus</h3>
          <h4>
            Ensuring every project is tailored to the client’s needs, preferences, and expectations.
          </h4>
        </div>

        {/* Reliability */}
        <div className="value-card">
          <FaClock className="icon" />
          <h3>Reliability</h3>
          <h4>
            Trusted to deliver on time, within budget, and with exceptional attention to detail.
          </h4>
        </div>
      </div>
    </div>
</section>





<section className="satisfaction-block">
  {/* Video Background */}
  <div className="video-background">
    <video autoPlay muted loop>
      <source src="/satisfiedcustomer.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>

  {/* Text Content Container */}
  <div className="satisfaction-container">
    <h2 className="satisfaction-heading"> Why Choose Polar Painting</h2>
    <p className="satisfaction-description">
      At Northern Painting, your satisfaction is our top priority. We stand by
      the quality of our work, ensuring that every project meets the highest
      standards. From start to finish, we focus on delivering results that not
      only meet but exceed your expectations.
    </p>
    <p className="satisfaction-description">
      We offer a satisfaction guarantee on all our services, from interior and
      exterior home painting to wallpaper installation and kitchen cabinet
      painting. If you’re not completely satisfied with the outcome, we will
      work with you until you are, because your home deserves nothing less.
    </p>
    {/* Contact Button */}
    <div className="satisfaction-cta">
      
      <a href="/contact" className="cta-button contact-us">
        Contact Us
      </a>
    </div>
  </div>
</section>


    </>
  );
};

export default AboutUs;
