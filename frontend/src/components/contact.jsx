import React, { useState, useEffect, useRef } from 'react';
import './contact.css';

const ContactHeader = () => {
  const images = ['contact1.jpg', 'contact2.jpg', 'contact3.jpg']; // Replace with your actual image paths
  const [currentImage, setCurrentImage] = useState(0);
  const block2Ref = useRef(null);
  const [block2Visible, setBlock2Visible] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  // Validate form data
  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required.';
    if (!formData.email) {
      errors.email = 'Email is required.';
    } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,7}$/i.test(formData.email)) {
      errors.email = 'Invalid email format.';
    }
    if (!formData.phone) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      errors.phone = 'Phone number must be 10-15 digits.';
    }
    if (!formData.subject) errors.subject = 'Subject is required.';
    if (!formData.message) errors.message = 'Message is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmissionStatus(null); // Reset submission status before sending request

      try {
        const response = await fetch('https://polar-painting-backend.onrender.com/api/contact/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
          setSubmissionStatus('success');
          setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } else {
          setSubmissionStatus('error');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmissionStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Change background image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Intersection Observer to handle block visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBlock2Visible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (block2Ref.current) {
      observer.observe(block2Ref.current);
    }

    return () => {
      if (block2Ref.current) {
        observer.unobserve(block2Ref.current);
      }
    };
  }, []);

  return (
    <>
      

      <section
        id="contact-block2"
        ref={block2Ref}
        className={`contact-block2 ${block2Visible ? 'visible' : ''}`}
      >
        <div className="contact-form-map-container">
          <div className="contact-form-container">
            <div className="contact-form-section">
              <h3>Contact Us</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {formErrors.name && <p className="error-text">{formErrors.name}</p>}
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {formErrors.email && <p className="error-text">{formErrors.email}</p>}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Your Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {formErrors.phone && <p className="error-text">{formErrors.phone}</p>}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                  {formErrors.subject && <p className="error-text">{formErrors.subject}</p>}
                </div>
                <div className="form-group">
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Your Message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                  {formErrors.message && <p className="error-text">{formErrors.message}</p>}
                </div>
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {submissionStatus && (
                  <p className={`submission-status ${submissionStatus}`}>
                    {submissionStatus === 'success' ? 'Message Sent Successfully!' : 'Error Sending Message.'}
                  </p>
                )}
              </form>
            </div>
          </div>
        
      

          <div className="map-container">
            <div className="contact-info-map">
              <h3>Find Us Here</h3>
              
              <iframe 
 
 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.733697627487!2d-79.3559506247435!3d43.84900867911542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4d4ad3f169041%3A0xef4e86d3f5c5c8c3!2s10-210%20Cochrane%20Dr%2C%20Markham%2C%20ON%20L3R%208E6%2C%20Canada!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca&zoom=1" 
 width="100%" 
 height="300" 
 allowfullscreen 
 loading="lazy" 
 title="Map Location">
</iframe>

            </div>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="contact-details-container">
          <div className="contact-details">
            <div className="contact-info">
              <h3>Contact Information</h3>
              <p><strong>Phone Number:</strong> 416 238 7373</p>
              <p><strong>Email Address:</strong> <a href="mailto:info@polarpainting.ca">info@polarpainting.ca</a></p>
              <p><strong>Office Address:</strong> 2967 Dundas St W, Toronto, ON, M6P 1Z2</p>
              <p><strong>Business Hours:</strong> Mon - Sun: 7 AM - 11 PM</p>
            </div>

            {/* Social Media Links */}
            <div className="social-media-links" style={{ textAlign: "center" }}>
              <h3>Follow Us</h3>
              <ul
                style={{
                  display: "inline-block",
                  textAlign: "left",
                  padding: 0,
                  listStyleType: "none",
                }}
              >
                <li>
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      color: "#4267B2",
                      marginBottom: "10px",
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                      alt="Facebook Logo"
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "10px",
                      }}
                    />
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      color: "#E4405F",
                      marginBottom: "10px",
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/733/733558.png"
                      alt="Instagram Logo"
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "10px",
                      }}
                    />
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      color: "#0A66C2",
                      marginBottom: "10px",
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                      alt="LinkedIn Logo"
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "10px",
                      }}
                    />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      color: "#1DA1F2",
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                      alt="Twitter Logo"
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "10px",
                      }}
                    />
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactHeader;