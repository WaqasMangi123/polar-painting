import React, { useState } from 'react';
import './costestimator.css';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaDoorOpen, 
  FaFilePdf, 
  FaCheckSquare, 
  FaArrowLeft, 
  FaBuilding, 
  FaPlus, 
  FaMinus 
} from 'react-icons/fa';

const CostEstimator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectType, setProjectType] = useState("");
  const [numFloors, setNumFloors] = useState(1);
  const [numRooms, setNumRooms] = useState(1);
  const [floorsData, setFloorsData] = useState([{ sqft: "", ceilingHeight: "", addOns: [], doorQuantity: 0 }]);
  const [roomsData, setRoomsData] = useState([{ sqft: "", ceilingHeight: "", addOns: [], doorQuantity: 0 }]);
  const [estimate, setEstimate] = useState(0);
  const [detailedBreakdown, setDetailedBreakdown] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    postalCode: '',
  });
  const [emailStatus, setEmailStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions

  const validateContactInfo = () => {
    const { name, email, phone, postalCode } = contactInfo;

    if (!name || !email || !phone || !postalCode) {
      setEmailStatus('All fields are required.');
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setEmailStatus('Invalid email format.');
      return false;
    }

    if (phone.length < 10 || phone.length > 15 || isNaN(phone)) {
      setEmailStatus('Phone number must be between 10-15 digits.');
      return false;
    }

    setEmailStatus(''); // Clear any existing errors
    return true;
  };

  const handleFormSubmit = async () => {
    if (!validateContactInfo()) return; // Validate contactInfo before proceeding

    setIsSubmitting(true); // Disable button during submission
    setEmailStatus(''); // Clear previous status messages

    try {
      console.log('Submitting form with data:', {
        name: contactInfo.name,
        email: contactInfo.email,
        phone: contactInfo.phone,
        postalCode: contactInfo.postalCode,
        estimate: estimate.toFixed(2),
      });

      const response = await axios.post('http://localhost:5000/api/estimatoremail/send-estimate', {
        name: contactInfo.name,
        email: contactInfo.email,
        phone: contactInfo.phone,
        postalCode: contactInfo.postalCode,
        estimate: estimate.toFixed(2),
      });

      if (response.status === 200) {
        setEmailStatus('Email sent successfully! Check your inbox.');
      } else {
        setEmailStatus('Error sending email. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred. Please try again.';
      setEmailStatus(errorMessage);
      console.error('Error while submitting form:', error.response?.data || error.message);
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };
  
  const handleInputChange = (e, index, type) => {
    const { name, value } = e.target;
    const updatedData = type === "floor" ? [...floorsData] : [...roomsData];
    updatedData[index] = {
      ...updatedData[index],
      [name]: value === "" ? "" : parseFloat(value) || 0,
    };
    if (type === "floor") setFloorsData(updatedData);
    else setRoomsData(updatedData);
  };

  const handleAddOnChange = (e, index, type, addOn) => {
    const updatedData = type === "floor" ? [...floorsData] : [...roomsData];
    const addOns = updatedData[index].addOns || [];
    if (e.target.checked) {
      addOns.push(addOn);
    } else {
      const addOnIndex = addOns.indexOf(addOn);
      if (addOnIndex > -1) addOns.splice(addOnIndex, 1);
    }
    updatedData[index].addOns = [...addOns];
    if (type === "floor") setFloorsData(updatedData);
    else setRoomsData(updatedData);
  };

  const handleDoorQuantityChange = (e, index, type) => {
    const updatedData = type === "floor" ? [...floorsData] : [...roomsData];
    updatedData[index].doorQuantity = Math.max(parseInt(e.target.value) || 0, 0);
    if (type === "floor") setFloorsData(updatedData);
    else setRoomsData(updatedData);
  };

  const handleNumberChange = (value, type) => {
    const newNumber = parseInt(value) || 1;

    if (type === "floor") {
      const newFloorsData = [...floorsData];
      while (newFloorsData.length < newNumber) {
        newFloorsData.push({ sqft: "", ceilingHeight: "", addOns: [], doorQuantity: 0 });
      }
      while (newFloorsData.length > newNumber) {
        newFloorsData.pop();
      }
      setNumFloors(newNumber);
      setFloorsData(newFloorsData);
    } else {
      const newRoomsData = [...roomsData];
      while (newRoomsData.length < newNumber) {
        newRoomsData.push({ sqft: "", ceilingHeight: "", addOns: [], doorQuantity: 0 });
      }
      while (newRoomsData.length > newNumber) {
        newRoomsData.pop();
      }
      setNumRooms(newNumber);
      setRoomsData(newRoomsData);
    }
  };

  const validateInputs = (data) => {
    for (const entry of data) {
      if (
        !entry.sqft ||
        entry.sqft < 50 ||
        entry.sqft > 5000 ||
        !entry.ceilingHeight ||
        entry.ceilingHeight < 7 ||
        entry.ceilingHeight > 23
      ) {
        setErrorMessage(
          "Please enter valid values. Square footage must be between 50 and 5000, and ceiling height must be between 7 and 23."
        );
        return false;
      }
    }
    setErrorMessage("");
    return true;
  };

  const generateEstimate = () => {
    const data = projectType === "wholeHouse" ? floorsData : roomsData;
    if (!validateInputs(data)) return;

    let totalEstimate = 0;
    const breakdown = [];
    data.forEach((item, index) => {
      const wallCost = 7.2 * (Math.sqrt(item.sqft) * item.ceilingHeight);
      const ceilingCost = item.addOns.includes("Ceiling") ? item.sqft * 1.02 : 0;
      const doorCost = (item.doorQuantity || 0) * 65;
      const baseboardCost = item.addOns.includes("Baseboards") ? 1.02 * (Math.sqrt(item.sqft) * 4) : 0;
      const crownMouldingCost = item.addOns.includes("Crown Moulding") ? 2.03 * (Math.sqrt(item.sqft) * 4) : 0;

      const addOnCost = doorCost + ceilingCost + baseboardCost + crownMouldingCost;
      const totalCost = wallCost + addOnCost;

      totalEstimate += totalCost;

      breakdown.push({
        index: index + 1,
        sqft: item.sqft,
        ceilingHeight: item.ceilingHeight,
        addOns: item.addOns,
        doorQuantity: item.doorQuantity,
        wallCost,
        ceilingCost,
        baseboardCost,
        crownMouldingCost,
        doorCost,
        totalCost,
      });
    });

    setEstimate(totalEstimate);
    setDetailedBreakdown(breakdown);
    setCurrentStep(4);
  };




  const generatePDF = () => {
    const doc = new jsPDF();

    // Background Section with Two-Color Shading
    doc.setFillColor(34, 45, 50); // Dark blue
    doc.rect(0, 0, 70, 297, "F"); // Left-side shading
    doc.setFillColor(240, 248, 255); // Light blue
    doc.rect(70, 0, 140, 297, "F"); // Right-side shading

    // Logo on the Left
    const logoPath = "/logo2.png"; // Replace with the actual logo path
    doc.addImage(logoPath, "PNG", 10, 10, 50, 40); // Increased logo height

    // Header Text on the Lighter Area
    const headerStartY = 15; // Starting point for header
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Black text for heading
    doc.setFont("helvetica", "bold");
    doc.text("POLAR PAINTING ESTIMATE", 85, headerStartY);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black text for subheading
    doc.setFont("helvetica", "normal");
    doc.text("SEE TERMS AND CONDITIONS AND PRIVACY POLICY", 85, headerStartY + 10);

    // Contact Info Below the Subheading
    const infoText = [
        "(647) 366-3737",
        "info@polarpainting.ca",
        "www.polarpainting.ca",
    ];

    infoText.forEach((line, index) => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(line, 85, headerStartY + 20 + index * 7);
    });

    // Generate Separate Tables for Each Room/Floor/Storey
    const data = projectType === "wholeHouse" ? floorsData : roomsData;
    let startY = 75;

    data.forEach((item, index) => {
        // Heading for Each Table
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255); // White text color
        doc.setFont("helvetica", "bold");
        doc.text(`Storey ${index + 1}`, 15, startY);

        const breakdownHeader = [
            ["#", "Sq Ft", "Ceiling Ht", "Wall Cost", "Ceiling Cost", "Door Cost", "Baseboard Cost", "Crown Moulding", "Total"]
        ];

        const wallCost = 7.2 * (Math.sqrt(item.sqft) * item.ceilingHeight);
        const ceilingCost = item.addOns.includes("Ceiling") ? item.sqft * 1.02 : 0;
        const doorCost = (item.doorQuantity || 0) * 65;
        const baseboardCost = item.addOns.includes("Baseboards") ? 1.02 * (Math.sqrt(item.sqft) * 4) : 0;
        const crownMouldingCost = item.addOns.includes("Crown Moulding") ? 2.03 * (Math.sqrt(item.sqft) * 4) : 0;

        const totalCost = wallCost + ceilingCost + doorCost + baseboardCost + crownMouldingCost;

        const breakdownData = [
            [
                `#${index + 1}`,
                item.sqft || "-",
                item.ceilingHeight || "-",
                `$${wallCost.toFixed(2)}`,
                ceilingCost ? `$${ceilingCost.toFixed(2)}` : "-",
                doorCost ? `$${doorCost.toFixed(2)}` : "-",
                baseboardCost ? `$${baseboardCost.toFixed(2)}` : "-",
                crownMouldingCost ? `$${crownMouldingCost.toFixed(2)}` : "-",
                `$${totalCost.toFixed(2)}`,
            ]
        ];

        doc.autoTable({
            head: breakdownHeader,
            body: breakdownData,
            startY: startY + 5,
            margin: { left: 15, right: 15 },
            tableWidth: 180,
            theme: "grid",
            styles: {
                fillColor: [255, 255, 255],
                textColor: [60, 60, 60],
                halign: "center",
                valign: "middle",
            },
            headStyles: {
                fillColor: [34, 45, 50],
                textColor: [255, 255, 255],
                fontStyle: "bold",
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240],
            },
            tableLineWidth: 0.5,
            tableLineColor: [255, 255, 255],
        });

        // Update startY for the next table
        startY = doc.lastAutoTable.finalY + 10;
    });

    // Footer with Total Estimate
    const totalEstimate = data.reduce((sum, item) => {
        const wallCost = 7.2 * (Math.sqrt(item.sqft) * item.ceilingHeight);
        const ceilingCost = item.addOns.includes("Ceiling") ? item.sqft * 1.02 : 0;
        const doorCost = (item.doorQuantity || 0) * 65;
        const baseboardCost = item.addOns.includes("Baseboards") ? 1.02 * (Math.sqrt(item.sqft) * 4) : 0;
        const crownMouldingCost = item.addOns.includes("Crown Moulding") ? 2.03 * (Math.sqrt(item.sqft) * 4) : 0;

        return sum + wallCost + ceilingCost + doorCost + baseboardCost + crownMouldingCost;
    }, 0);

    doc.setFillColor(34, 45, 50); // Dark blue background
    doc.rect(15, startY, 180, 10, "F");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255); // White text for Total Estimate
    doc.setFont("helvetica", "bold");
    doc.text(`Total Estimate: $${totalEstimate.toFixed(2)}`, 20, startY + 7);

    // Move to Second Page for Terms and Conditions
    doc.addPage();

    // Terms & Conditions with Enhanced Background
    doc.setFillColor(34, 45, 50); // Dark blue
    doc.rect(0, 0, 70, 297, "F"); // Left-side shading
    doc.setFillColor(240, 248, 255); // Light blue
    doc.rect(70, 0, 140, 297, "F"); // Right-side shading


    doc.setFontSize(20);
    doc.setTextColor(34, 45, 50);
    doc.setFont("helvetica", "bold");
    doc.text("Perfect Prep", 105, 20, { align: "center" });

    // Styled Container for Terms
    doc.setFillColor(255, 255, 255); // White container background
    doc.rect(10, 30, 190, 250, "F"); // Container dimensions

    // Styled Terms in Rows (Two Columns)
    const termsText = [
        { title: "Covering All Furniture", description: "We protect furniture by covering it with durable materials like plastic sheets or drop cloths, safeguarding your belongings from paint splatter and dust." },
        { title: "Removing Wall Sockets and Switch Covers", description: "Switch covers are removed to ensure even paint coverage and a seamless finish." },
        { title: "Taping as Required", description: "Painter's tape is applied to edges, trims, and ceilings to ensure sharp, professional lines." },
        { title: "Sanding the Wall and Applying Primer", description: "Walls are sanded for smoothness, followed by a primer coat for improved adhesion and a long-lasting finish." },
        { title: "Applying Two Coats of Paint", description: "Two coats of paint ensure even color coverage and a vibrant, durable finish." },
        { title: "Sanding and Painting Doors", description: "Doors and door frames are sanded and painted for a polished and consistent appearance." },
        { title: "Cleaning After Completion", description: "All tools and materials are removed, and the workspace is cleaned thoroughly." },
        { title: "Ensuring Satisfaction", description: "We conduct a walkthrough to ensure everything meets your expectations." },
        { title: "Safety Measures", description: "Our team adheres to safety protocols to ensure a secure work environment for everyone." },
        { title: "Eco-Friendly Practices", description: "We use eco-friendly materials and practices to minimize environmental impact." },
        { title: "Transparent Pricing", description: "Our pricing is clear and transparent, with no hidden costs." },
        { title: "Timely Completion", description: "We work efficiently to complete your project within the agreed timeline." }
    ];

    let yPosition = 45;
    for (let i = 0; i < termsText.length; i += 2) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(34, 45, 50);
        doc.text(termsText[i].title, 20, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(termsText[i].description, 20, yPosition + 5, { maxWidth: 80 });

        if (termsText[i + 1]) {
            doc.setFont("helvetica", "bold");
            doc.text(termsText[i + 1].title, 110, yPosition);
            doc.setFont("helvetica", "normal");
            doc.text(termsText[i + 1].description, 110, yPosition + 5, { maxWidth: 80 });
        }

        yPosition += 30; // Adjust space between rows
    }




    // Move to Third Page for Detailed Terms and Conditions
doc.addPage();

// Enhanced Background for the Third Page
doc.setFillColor(34, 45, 50); // Dark blue background
doc.rect(0, 0, 210, 297, "F");

// Title for the Page
doc.setFontSize(20);
doc.setTextColor(255, 255, 255); // White text
doc.setFont("helvetica", "bold");
doc.text("Terms and Conditions", 105, 20, { align: "center" });

// White Container for Terms Content
doc.setFillColor(255, 255, 255); // White background for container
doc.rect(10, 30, 190, 250, "F"); // Container dimensions

// Text for Terms and Conditions
const termsContent = [
    "Welcome to Polar Painting. By accessing or using our services, you agree to the following terms and conditions. Please read them carefully, as they outline your rights and obligations and protect both you and our business from liabilities.",
    "",
    "1. General Overview",
    "1.1. These terms and conditions govern all transactions, agreements, and interactions between Polar Painting (referred to as “we,” “us,” or “our”) and our clients (“you” or “your”).",
    "1.2. By booking a service or using our website, you agree to these terms and conditions.",
    "1.3. These terms are subject to change without prior notice. Updated terms will be posted on our website.",
    "",
    "2. Services Provided",
    "2.1. Polar Painting offers residential painting, commercial painting, cabinet painting, condo/apartment painting, office painting, and wallpaper installation/removal services.",
    "2.2. All services are provided as per the agreed-upon scope of work during consultation.",
    "2.3. All surfaces must be prepared, repaired, primed, or cleaned as instructed, and must be completed by the customer’s preferred contractor before painting begins.",
    "",
    "3. Interior Home Calculator Disclaimer",
    "3.1. The pricing generated by the interior home calculator on our website is a rough estimate and is not final.",
    "3.2. Final pricing is subject to an in-person measurement and consultation to ensure the most accurate quote based on your property’s specific needs.",
    "3.3. The final price may be higher or lower than the estimate generated by the calculator.",
    "3.4. Pricing generated by the calculator, acknowledged on the website, is not binding.",
    "",
    "4. Pricing and Payment",
    "4.1. A 50% deposit of the estimated total is required upon booking. This deposit secures your project in our schedule and covers initial material costs.",
    "4.2. The remaining 50% is due upon project completion.",
    "4.3. Payment can be made via debit card, VISA credit card, Mastercard credit card, and American Express. We do not accept cash or e-transfers to ensure secure and traceable transactions for both parties.",
    "4.4. All quotes are valid for 30 days granted that the condition of the project is the same as when quoted.",
    "4.5. Additional costs under unforeseen circumstances (e.g., repairs, additional prep work) will be communicated and approved before proceeding.",
];

// Starting Position for the Text
let textStartY = 40;

// Font and Style for Content
doc.setFontSize(12);
doc.setTextColor(34, 45, 50); // Dark text for content
doc.setFont("helvetica", "normal");

// Split Text into Lines and Add to PDF
termsContent.forEach((line) => {
    const splitLine = doc.splitTextToSize(line, 180); // Split long lines to fit container width
    doc.text(splitLine, 15, textStartY);
    textStartY += 7 * splitLine.length; // Adjust Y position for each line
});



// Move to Fourth Page for Additional Terms and Conditions
doc.addPage();

// Enhanced Background for the Fourth Page
doc.setFillColor(34, 45, 50); // Dark blue background
doc.rect(0, 0, 210, 297, "F");

// Title for the Page
doc.setFontSize(20);
doc.setTextColor(255, 255, 255); // White text
doc.setFont("helvetica", "bold");
doc.text("Additional Terms and Conditions", 105, 20, { align: "center" });

// White Container for Terms Content
doc.setFillColor(255, 255, 255); // White background for container
doc.rect(10, 30, 190, 250, "F"); // Container dimensions

// Additional Terms and Conditions Content
const additionalTerms = [
    "5. Cancellations and Refunds",
    "5.1. Cancellations made within 7 days of the scheduled project start date will forfeit the deposit.",
    "5.2. Refunds are not available for services already rendered or materials purchased.",
    "5.3. Changes to the project timeline must be communicated in writing and are subject to availability.",
    "",
    "6. Liability and Limitations",
    "6.1. Polar Painting is not responsible for pre-existing issues, such as structural damage, mold, or defects, which may affect the quality of our work.",
    "6.2. We are not liable for damage caused by delays due to weather, supplier issues, or other factors beyond our control.",
    "6.3. It is the customer’s responsibility to remove furniture from the room or place all furniture in the middle of the room, giving the painters a minimum of 4 feet of space from the wall. Additional charges may be applied if this is not done.",
    "6.4. Polar Painting is insured, and all our employees are covered. However, liability is limited to the cost of the service provided.",
    "",
    "7. Warranty",
    "7.1. We provide a 12-month warranty on all painting services, covering workmanship issues (e.g., peeling, blistering, or cracks due to poor application).",
    "7.2. The warranty does not cover:",
    "    - Damage caused by external factors (e.g., water leaks, structural movement, or improper wall care and normal wear and tear).",
    "    - Areas that were not cleaned or repaired prior to painting.",
    "7.3. Warranty claims must be submitted in writing within the warranty period.",
    "",
    "8. Colour Selection and Final Approval",
    "8.1. The final paint selection form is due no later than 72 hours before the scheduled date for the project.",
    "8.2. We offer colour consultation services to assist in selecting the perfect shade.",
    "",
    "9. Surface Preparation",
    "9.1. Proper surface preparation includes sanding, priming, degreasing, and taping, as necessary for professional results.",
    "9.2. Any additional hidden defects revealed during prep work (e.g., cracks, rot) will be brought to your attention and may require additional costs.",
];

// Starting Position for the Text
let additionalTextStartY = 40;

// Font and Style for Content
doc.setFontSize(12);
doc.setTextColor(34, 45, 50); // Dark text for content
doc.setFont("helvetica", "normal");

// Split Text into Lines and Add to PDF
additionalTerms.forEach((line) => {
    const splitLine = doc.splitTextToSize(line, 180); // Split long lines to fit container width
    doc.text(splitLine, 15, additionalTextStartY);
    additionalTextStartY += 7 * splitLine.length; // Adjust Y position for each line
});



// Move to Fifth Page for Privacy Policy
doc.addPage();

// Enhanced Background for the Fifth Page
doc.setFillColor(34, 45, 50); // Dark blue background
doc.rect(0, 0, 210, 297, "F");

// Title for the Page
doc.setFontSize(20);
doc.setTextColor(255, 255, 255); // White text
doc.setFont("helvetica", "bold");
doc.text("Privacy Policy", 105, 20, { align: "center" });

// White Container for Privacy Policy Content
doc.setFillColor(255, 255, 255); // White background for container
doc.rect(10, 30, 190, 250, "F"); // Container dimensions

// Privacy Policy Content
const privacyPolicy = [
    "At Polar Painting, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you interact with us or use our website. By accessing our services, you agree to the terms outlined here.",
    "",
    "1. Information We Collect",
    "1.1. Personal Information: We may collect personal information that you provide, such as your name, email address, phone number, and address, when you:",
    "  - Request a quote or consultation.",
    "  - Use our interior home calculator.",
    "  - Fill out our contact form.",
    "  - Communicate with us via email or phone.",
    "1.2. Non-Personal Information: We collect non-personal data such as:",
    "  - IP address.",
    "  - Browser type and version.",
    "  - Device information.",
    "  - Pages visited on our website.",
    "",
    "1.3. Payment Information: For payment processing, we collect billing information through secure third-party platforms. We do not store your payment details.",
    "",
    "2. How We Use Your Information",
    "2.1. To provide and improve our services, including generating accurate quotes, scheduling projects, and offering personalized recommendations.",
    "2.2. To send promotional emails or updates about our services (you can opt out anytime).",
    "2.3. To analyze website performance and improve user experience.",
    "2.4. To comply with legal obligations or resolve disputes.",
    "",
    "3. How We Protect Your Information",
    "3.1. We implement industry-standard security measures to safeguard your personal data from unauthorized access, use, or disclosure.",
    "3.2. Personal information is only shared with authorized employees and third-party service providers who require it for legitimate business purposes.",
    "3.3. Despite our efforts, no online data transmission is entirely secure. By using our services, you acknowledge and accept this risk.",
];

// Starting Position for the Text
let privacyStartY = 40;

// Font and Style for Content
doc.setFontSize(12);
doc.setTextColor(34, 45, 50); // Dark text for content
doc.setFont("helvetica", "normal");

// Split Text into Lines and Add to PDF
privacyPolicy.forEach((line) => {
    const splitLine = doc.splitTextToSize(line, 180); // Split long lines to fit container width
    doc.text(splitLine, 15, privacyStartY);
    privacyStartY += 7 * splitLine.length; // Adjust Y position for each line
});



// Define the starting position for the text
let privacyPolicyStartY = 45; // New variable name to avoid conflicts

// Move to Sixth Page for More Privacy Policy Details
doc.addPage();

// Enhanced Background for the Sixth Page
doc.setFillColor(34, 45, 50); // Dark blue background
doc.rect(0, 0, 210, 297, "F");

// Title for the Page
doc.setFontSize(20);
doc.setTextColor(255, 255, 255); // White text
doc.setFont("helvetica", "bold");
doc.text("Privacy Policy (Continued)", 105, 20, { align: "center" });

// White Container for Additional Privacy Policy Content
doc.setFillColor(255, 255, 255); // White background for container
doc.rect(10, 30, 190, 250, "F"); // Container dimensions

// Additional Privacy Policy Content
const additionalPrivacyPolicy = [
    "4. Cookies and Tracking Technologies",
    "4.1. Our website uses cookies to enhance your browsing experience and analyze website traffic. Cookies may:",
    "  - Remember your preferences.",
    "  - Collect data about site usage.",
    "4.2. You can manage or disable cookies through your browser settings. However, this may affect website functionality.",
    "",
    "5. Third-Party Services",
    "5.1. We may share your information with trusted third-party providers for:",
    "  - Payment processing.",
    "  - Email marketing.",
    "  - Website analytics (e.g., Google Analytics).",
    "5.2. These providers are obligated to protect your information and use it solely for the purposes specified by Polar Painting.",
    "",
    "6. Data Retention",
    "6.1. We retain personal information only as long as necessary to fulfill the purposes outlined in this policy or as required by law.",
    "6.2. Non-personal data may be retained indefinitely for analytical purposes.",
    "",
    "7. Your Rights",
    "7.1. You have the right to:",
    "  - Access the personal data we hold about you.",
    "  - Request corrections to inaccurate information.",
    "  - Opt-out of marketing communications.",
    "  - Request deletion of your personal data, subject to legal and contractual obligations.",
    "7.2. To exercise these rights, contact us at info@polarpainting.ca.",
];

// Font and Style for Content
doc.setFontSize(12);
doc.setTextColor(34, 45, 50); // Dark text for content
doc.setFont("helvetica", "normal");

// Split Text into Lines and Add to PDF
additionalPrivacyPolicy.forEach((line) => {
    const splitLine = doc.splitTextToSize(line, 180); // Split long lines to fit container width
    doc.text(splitLine, 15, privacyPolicyStartY); // Use the renamed variable
    privacyPolicyStartY += 7 * splitLine.length; // Adjust Y position for each line
});


    // Footer with QR Code
    const qrCodePath = "/qrcoe.png"; // Replace with your QR code path
    doc.addImage(qrCodePath, "PNG", 160, 270, 25, 25);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for choosing Polar Painting. Visit us at www.polarpainting.com.", 15, 290);

    // Save PDF
    doc.save("Polar_Painting_Estimate_Report.pdf");
};















const renderStep = () => {
  switch (currentStep) {
    case 1:
      return (
        <div className="step-container">
          <h2>Step 1: Choose Project Type</h2>
          <div className="project-type-selection">
            <button
              className="selection-button"
              onClick={() => {
                setProjectType("wholeHouse");
                setCurrentStep(2);
              }}
            >
              <img
                src="/condo.png"
                alt="Whole House"
                style={{ marginRight: "10px", width: "40px" }}
              />{" "}
              Whole House
            </button>
            <button
              className="selection-button"
              onClick={() => {
                setProjectType("specificRooms");
                setCurrentStep(2);
              }}
            >
              <img
                src="/CONDO SPECIFIC.png"
                alt="Specific Rooms"
                style={{ marginRight: "10px", width: "40px" }}
              />{" "}
              Specific Room(s)
            </button>
          </div>
        </div>
      );
    case 2:
      return (
        <div className="step-container">
          <h2>
            {projectType === "wholeHouse"
              ? "How many storeys does your house have?"
              : "How many rooms would you like to have painted?"}
          </h2>
          <div className="number-selection">
            {projectType === "wholeHouse" ? (
              <>
                {[
                  { num: 1, img: "/singlestory.png" },
                  { num: 2, img: "/twostorey.png" },
                  { num: 3, img: "/threestorey.png" },
                  { num: 4, img: "/fourstorey.png" },
                ].map(({ num, img }) => (
                  <button
                    key={num}
                    className={`number-button ${numFloors === num ? "active" : ""}`}
                    onClick={() => handleNumberChange(num, "floor")}
                  >
                    <img
                      src={img}
                      alt={`${num} Storey`}
                      style={{ width: "60px", height: "60px" }}
                    />
                    <div>{`${num} Storey${num > 1 ? "s" : ""}`}</div>
                  </button>
                ))}
              </>
            ) : (
              <>
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    className={`number-button ${numRooms === num ? "active" : ""}`}
                    onClick={() => handleNumberChange(num, "room")}
                  >
                    {Array.from({ length: num }).map((_, index) => (
                      <img
                        key={index}
                        src="/door.png"
                        alt="Door"
                        style={{ width: "30px", margin: "0 5px" }}
                      />
                    ))}
                    {`${num} Room${num > 1 ? "s" : ""}`}
                  </button>
                ))}
                <button
                  className="number-button"
                  onClick={() => handleNumberChange(numRooms + 1, "room")}
                >
                  <img src="/door.png" alt="Add More" style={{ width: "30px" }} /> Add More
                </button>
              </>
            )}
          </div>
          <div className="navigation-buttons">
            <button
              className="cta-button back-button"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </button>
            <button className="cta-button" onClick={() => setCurrentStep(3)}>
              Next
            </button>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="step-container">
          <h2>Step 3: Enter Details</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {(projectType === "wholeHouse" ? floorsData : roomsData).map((item, index) => (
            <div key={index} className="data-input">
              <h3>{projectType === "wholeHouse" ? `Storey ${index + 1}` : `Room ${index + 1}`}</h3>
              <div className="form-section">
                <div className="left-section">
                  <label>
                    Square Feet (50-5000):
                    <input
                      type="number"
                      name="sqft"
                      value={item.sqft || ""}
                      onChange={(e) =>
                        handleInputChange(e, index, projectType === "wholeHouse" ? "floor" : "room")
                      }
                    />
                  </label>
                  <label>
                    Ceiling Height (7-23 ft):
                    <input
                      type="number"
                      name="ceilingHeight"
                      value={item.ceilingHeight || ""}
                      onChange={(e) =>
                        handleInputChange(e, index, projectType === "wholeHouse" ? "floor" : "room")
                      }
                    />
                  </label>
                </div>
                <div className="right-section">
                  <h4>Add-Ons:</h4>
                  <label className="add-on-label">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleAddOnChange(
                          e,
                          index,
                          projectType === "wholeHouse" ? "floor" : "room",
                          "Ceiling"
                        )
                      }
                    />
                    Ceiling
                  </label>
                  <label className="add-on-label">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleAddOnChange(
                          e,
                          index,
                          projectType === "wholeHouse" ? "floor" : "room",
                          "Door"
                        )
                      }
                    />
                    Door(s)
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          handleDoorQuantityChange(
                            { target: { value: Math.max((item.doorQuantity || 1) - 1, 0) } },
                            index,
                            projectType === "wholeHouse" ? "floor" : "room"
                          )
                        }
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.doorQuantity || 1}
                        onChange={(e) =>
                          handleDoorQuantityChange(
                            e,
                            index,
                            projectType === "wholeHouse" ? "floor" : "room"
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          handleDoorQuantityChange(
                            { target: { value: (item.doorQuantity || 0) + 1 } },
                            index,
                            projectType === "wholeHouse" ? "floor" : "room"
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </label>
                  <label className="add-on-label">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleAddOnChange(
                          e,
                          index,
                          projectType === "wholeHouse" ? "floor" : "room",
                          "Baseboards"
                        )
                      }
                    />
                    Baseboards
                  </label>
                  <label className="add-on-label">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleAddOnChange(
                          e,
                          index,
                          projectType === "wholeHouse" ? "floor" : "room",
                          "Crown Moulding"
                        )
                      }
                    />
                    Crown Moulding
                  </label>
                </div>
              </div>
            </div>
          ))}
          <div className="navigation-buttons">
            <button
              className="cta-button back-button"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </button>
            <button className="cta-button" onClick={generateEstimate}>
              Calculate Estimate
            </button>
          </div>
        </div>
      );
      case 4:
        return (
          <div className="step-container">
            <h2>Step 4: Estimate</h2>
            <h3>Total Estimate: ${estimate.toFixed(2)}</h3>
            <button className="cta-button" onClick={generatePDF}>
              Download PDF
            </button>
      
            <h4>Fill out your contact info to receive a personalized quote via email:</h4>
            <form
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleFormSubmit();
              }}
            >
              <div className="form-inputs">
                <input
                  type="text"
                  placeholder="Name"
                  value={contactInfo.name}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, name: e.target.value.trim() })
                  }
                  required
                  className={`form-input ${!contactInfo.name && 'input-error'}`}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={contactInfo.email}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, email: e.target.value.trim() })
                  }
                  required
                  className={`form-input ${
                    contactInfo.email &&
                    (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email))
                      ? 'input-error'
                      : ''
                  }`}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={contactInfo.phone}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, phone: e.target.value.trim() })
                  }
                  required
                  className={`form-input ${
                    contactInfo.phone &&
                    (!/^\d{10,15}$/.test(contactInfo.phone))
                      ? 'input-error'
                      : ''
                  }`}
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={contactInfo.postalCode}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, postalCode: e.target.value.trim() })
                  }
                  required
                  className={`form-input ${!contactInfo.postalCode && 'input-error'}`}
                />
              </div>
              <button
                type="submit"
                className="cta-button"
                disabled={
                  !contactInfo.name ||
                  !contactInfo.email ||
                  !contactInfo.phone ||
                  !contactInfo.postalCode ||
                  isSubmitting
                }
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
      
            {/* Email Status Message */}
            {emailStatus && (
              <p
                className={`email-status ${
                  emailStatus.includes('successfully') ? 'success' : 'error'
                }`}
              >
                {emailStatus}
              </p>
            )}
          </div>
        );
      

    default:
      return null;
  }
};



  return (
    <div className="cost-estimator">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Estimate Your Interior Painting Cost</h1> {/* Updated H1 */}
          <h2>Get a no-commitment estimate in just a few steps</h2> {/* New H2 */}
          <button
            className="cta-button-large" /* Updated class for a larger button */
            onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
          >
            Get Started
          </button>
        </div>
      </section>

      <section className="form-section">
        {renderStep()}
        <div className="contact-us">
          <h3>Need help? <Link to="/contact">Contact Us</Link></h3>
        </div>
      </section>
    </div>

  );
};

export default CostEstimator;
