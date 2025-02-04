import React from "react";
import {
  FaFileContract,
  FaPaintBrush,
  FaCalculator,
  FaMoneyCheckAlt,
  FaUndoAlt,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaPalette,
  FaTools,
  FaClock,
  FaSmile,
  FaUserShield,
  FaCookieBite,
  FaServer,
  FaChild,
  FaEdit,
  FaEnvelope,
} from "react-icons/fa";
import "./termsandcondition.css";

const TermsAndCondition = () => {
  const termsAndConditions = [
    {
      title: "General Overview",
      description:
        "These terms and conditions govern all transactions, agreements, and interactions between Polar Painting and its clients. By booking a service or using our website, you agree to these terms and conditions. These terms are subject to change without prior notice. Updated terms will be posted on our website.",
      icon: <FaFileContract />,
    },
    {
      title: "Services Provided",
      description:
        "Polar Painting offers residential painting, commercial painting, cabinet painting, condo/apartment painting, office painting, and wallpaper installation/removal services. All services are provided as per the agreed-upon scope of work during consultation. Services do not include structural repair, plumbing, electrical, etc., and must be completed by the customer's preferred contractor before painting can begin.",
      icon: <FaPaintBrush />,
    },
    {
      title: "Interior Home Calculator Disclaimer",
      description:
        "The pricing generated by the interior home calculator on our website is a rough estimate and is not final. Final pricing is subject to an in-person measurement and consultation to ensure the most accurate quote based on your property’s specific needs.",
      icon: <FaCalculator />,
    },
    {
      title: "Pricing and Payment",
      description:
        "A 50% deposit of the estimated total is required upon booking. This deposit secures your project in our schedule and covers initial material costs. The remaining 50% is due upon project completion. Payment can be made via debit card, VISA credit card, Mastercard credit card, and American Express. We do not accept cash or e-transfer to ensure secure and traceable transactions for both parties.",
      icon: <FaMoneyCheckAlt />,
    },
    {
      title: "Cancellations and Refunds",
      description:
        "Cancellations made within 7 days of the scheduled project start date will forfeit the deposit. Refunds are not available for services already rendered or materials purchased. Changes to the project timeline must be communicated in writing and are subject to availability.",
      icon: <FaUndoAlt />,
    },
    {
      title: "Liability and Limitations",
      description:
        "Polar Painting is not responsible for pre-existing issues, such as structural damage, mold, or defective surfaces, that affect the quality of our work. We are not liable for damage caused by delays due to weather, supplier issues, or other factors beyond our control.",
      icon: <FaExclamationTriangle />,
    },
    {
      title: "Warranty",
      description:
        "We provide a 12-month warranty on all painting services, covering workmanship issues (e.g., peeling, blistering, or cracking due to poor application).",
      icon: <FaClipboardCheck />,
    },
    {
      title: "Colour Selection and Final Approval",
      description:
        "The final paint selection form is due no later than 72 hours before the scheduled date for the project. We offer colour consultation services to assist in selecting the perfect shade.",
      icon: <FaPalette />,
    },
    {
      title: "Surface Preparation",
      description:
        "We prioritize surface preparation, including sanding, priming, degreasing, and taping, as necessary for optimal results.",
      icon: <FaTools />,
    },
    {
      title: "Project Timelines",
      description:
        "Timelines provided are estimates and may vary based on project scope, weather conditions, or other unforeseen factors.",
      icon: <FaClock />,
    },
    {
      title: "Customer Satisfaction",
      description:
        "If you are not satisfied with the work, you must notify us within 3 days of project completion. We will address valid concerns promptly.",
      icon: <FaSmile />,
    },
  ];

  const privacyPolicy = [
    {
      title: "Information We Collect",
      description:
        "We may collect personal information such as your name, email address, phone number, and address when you interact with our website or services.",
      icon: <FaUserShield />,
    },
    {
      title: "How We Use Your Information",
      description:
        "Your information is used to provide and improve our services, communicate with you, and comply with legal obligations.",
      icon: <FaServer />,
    },
    {
      title: "Cookies and Tracking",
      description:
        "Our website uses cookies to enhance your browsing experience and analyze website traffic. You can manage cookie preferences through your browser settings.",
      icon: <FaCookieBite />,
    },
    {
      title: "Data Retention",
      description:
        "We retain personal information only as long as necessary to fulfill the purposes outlined in this policy or as required by law.",
      icon: <FaEdit />,
    },
    {
      title: "Third-Party Services",
      description:
        "We may share your information with trusted third-party providers for payment processing, email marketing, and website analytics.",
      icon: <FaServer />,
    },
    {
      title: "Your Rights",
      description:
        "You have the right to access, correct, or delete your personal data, and to opt-out of marketing communications.",
      icon: <FaEdit />,
    },
    {
      title: "Children’s Privacy",
      description:
        "Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children.",
      icon: <FaChild />,
    },
    {
      title: "Updates to This Policy",
      description:
        "We may update this Privacy Policy from time to time. Changes will be posted on our website with the updated date.",
      icon: <FaEdit />,
    },
    {
      title: "Contact Information",
      description:
        "For questions or concerns about this Privacy Policy or our data practices, contact us at: Phone: (416) 238-7373 Email: info@polarpainting.ca.",
      icon: <FaEnvelope />,
    },
  ];

  return (
    <div className="terms-page-container">
      {/* First Block */}
      <div className="terms-header-background"></div>
      <header className="terms-header-section">
        <h1 className="terms-title-text">Welcome to Polar Painting</h1>
        <p className="terms-subtitle-text">
          By accessing or using our services, you agree to the following terms
          and conditions. Please read them carefully to understand your rights
          and responsibilities.
        </p>
      </header>

      {/* Terms and Conditions Section */}
      <div className="section-container">
        <h2 className="section-title">Terms and Conditions</h2>
        <div className="section-points">
          {termsAndConditions.map((point, index) => (
            <div className="point" key={index}>
              <div className="point-icon">{point.icon}</div>
              <div>
                <h3 className="point-title">{point.title}</h3>
                <p className="point-description">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Policy Section */}
      <div className="section-container">
        <h2 className="section-title">Privacy Policy</h2>
        <div className="section-points">
          {privacyPolicy.map((point, index) => (
            <div className="point" key={index}>
              <div className="point-icon">{point.icon}</div>
              <div>
                <h3 className="point-title">{point.title}</h3>
                <p className="point-description">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsAndCondition;
