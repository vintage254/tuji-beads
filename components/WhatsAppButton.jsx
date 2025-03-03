import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const phoneNumber = '0748322954'; // Replace with your actual WhatsApp number
  const message = 'Hello! I have a question about Beads Charm products.';
  
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="whatsapp-button" onClick={handleWhatsAppClick}>
      <FaWhatsapp size={24} />
      <span>Chat with us</span>
    </div>
  );
};

export default WhatsAppButton;