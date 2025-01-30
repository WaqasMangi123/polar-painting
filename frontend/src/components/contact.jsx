import React, { useState, useEffect } from 'react';
import './contact.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const ContactHeader = () => {
  const images = ['contact1.jpg', 'contact2.jpg', 'contact3.jpg']; // Replace with your actual image paths
  const [currentImage, setCurrentImage] = useState(0);

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
        const response = await fetch('http://localhost:5000/api/contact/contact', {
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

  return (
    <>
      <section id="contact-block2" className="contact-block2 visible">
        {/* Contact Information Container */}
        <div className="contact-info-container">
          <h3>Contact Information</h3>

          {/* Container for all contact info boxes */}
          <div className="contact-info-box-container">
            {/* Phone Number Box */}
            <div className="contact-info-box">
              <div className="contact-item">
                <FaPhoneAlt style={{ fontSize: '2rem', marginRight: '10px' }} />
                <strong>Phone Number:</strong>
              </div>
              <div className="contact-item">(647) 366-3737</div>
            </div>

            {/* Email Address Box */}
            <div className="contact-info-box">
              <div className="contact-item">
                <FaEnvelope style={{ fontSize: '2rem', marginRight: '10px' }} />
                <strong>Email Address:</strong>
              </div>
              <div className="contact-item">
                <a href="mailto:info@polarpainting.ca">info@polarpainting.ca</a>
              </div>
            </div>

            {/* Office Address Box */}
            <div className="contact-info-box">
              <div className="contact-item">
                <FaMapMarkerAlt style={{ fontSize: '2rem', marginRight: '10px' }} />
                <strong>Office Address:</strong>
              </div>
              <div className="contact-item">4141 Yonge St, North York, ON M2P 2A6</div>
            </div>

            {/* Business Hours Box */}
            <div className="contact-info-box">
              <div className="contact-item">
                <FaClock style={{ fontSize: '2rem', marginRight: '10px' }} />
                <strong>Business Hours:</strong>
              </div>
              <div className="contact-item">Mon - Sun: 7 AM - 11 PM</div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
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

          {/* Map Section */}
          <div className="map-container">
            <div className="contact-info-map">
              <h3>Find Us Here</h3>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.733697627487!2d-79.3559506247435!3d43.84900867911542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4d4ad3f169041%3A0xef4e86d3f5c5c8c3!2s10-210%20Cochrane%20Dr%2C%20Markham%2C%20ON%20L3R%208E6%2C%20Canada!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca&zoom=1"
                width="100%"
                height="300"
                allowFullScreen
                loading="lazy"
                title="Map Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Social Media Links Section */}
        <div className="social-media-links text-center mt-16 px-4">
          <h3 className="text-4xl font-bold text-white mb-8">Follow Us</h3>
          <ul className="flex flex-wrap justify-center gap-4 p-0 list-none">
            <li className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 p-5 bg-black bg-opacity-60 rounded-lg shadow-lg flex justify-center">
              <a
                href="hhttps://www.facebook.com/profile.php?id=61572386971975"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-decoration-none text-blue-600"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                  alt="Facebook Logo"
                  className="w-8 h-8 mr-2"
                />
                Facebook
              </a>
            </li>
            <li className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 p-5 bg-black bg-opacity-60 rounded-lg shadow-lg flex justify-center">
              <a
                href="https://www.instagram.com/polarpainting.ca?igsh=cXhqMXhvMGp0dzd6&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-decoration-none text-pink-500"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733558.png"
                  alt="Instagram Logo"
                  className="w-8 h-8 mr-2"
                />
                Instagram
              </a>
            </li>
            <li className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 p-5 bg-black bg-opacity-60 rounded-lg shadow-lg flex justify-center">
              <a
                href="https://x.com/polarpainting_?t=lDHdzi5pptrf6oTBKaqVCw&s=09"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-decoration-none text-blue-400"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                  alt="Twitter Logo"
                  className="w-8 h-8 mr-2"
                />
                Twitter
              </a>
            </li>
            <li className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 p-5 bg-black bg-opacity-60 rounded-lg shadow-lg flex justify-center">
              <a
                href="https://youtube.com/@polarpainting?si=SNI_0hn15VNSxJ0b"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-decoration-none text-red-600"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733646.png"
                  alt="YouTube Logo"
                  className="w-8 h-8 mr-2"
                />
                YouTube
              </a>
            </li>
            <li className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 p-5 bg-black bg-opacity-60 rounded-lg shadow-lg flex justify-center">
              <a
                href="https://www.tiktok.com/@polarpainting.ca?_t=ZM-8tTShg0zK0U&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-decoration-none text-white"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3046/3046126.png"
                  alt="TikTok Logo"
                  className="w-8 h-8 mr-2"
                />
                TikTok
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default ContactHeader;