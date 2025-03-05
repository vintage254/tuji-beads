import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Show button after a delay for a nice entrance effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleWhatsAppClick = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254712345678'; // Fallback number
    const message = "Hello! I'm interested in your beaded products.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div 
      className={`whatsapp-button-container ${isVisible ? 'visible' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button 
        className={`whatsapp-button modern ${isHovered ? 'hovered' : ''}`}
        onClick={handleWhatsAppClick}
        aria-label="Contact on WhatsApp"
      >
        <div className="whatsapp-button-content">
          <FaWhatsapp className="whatsapp-icon" />
          <span className="whatsapp-text">Chat with us</span>
        </div>
        
        <div className="whatsapp-pulse"></div>
      </button>
    </div>
  );
};

export default WhatsAppButton;