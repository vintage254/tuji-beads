import React from 'react';
import { AiFillInstagram, AiFillFacebook } from 'react-icons/ai';

const Footer = () => {
  return (
    <div className="footer-container">
      <p>2025 Beads Charm All rights reserved</p>
      <div className="icons">
        <a 
          href="https://www.instagram.com/beads_charm_collections/" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="social-icon"
        >
          <AiFillInstagram />
        </a>
        <a 
          href="https://www.facebook.com/beadscharm/" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="social-icon"
        >
          <AiFillFacebook />
        </a>
      </div>
      
      <style jsx>{`
        .footer-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px 10px;
          font-weight: 500;
          color: #324d67;
          text-align: center;
        }
        
        .icons {
          display: flex;
          gap: 20px;
          margin-top: 15px;
        }
        
        .social-icon {
          font-size: 30px;
          color: #324d67;
          transition: transform 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .social-icon:hover {
          transform: scale(1.2);
          color: #f02d34;
        }
        
        @media screen and (max-width: 768px) {
          .footer-container {
            padding: 20px 10px;
          }
          
          .social-icon {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  )
}

export default Footer