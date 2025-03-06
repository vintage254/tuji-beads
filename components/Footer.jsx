import React from 'react';
import { AiFillInstagram, AiFillFacebook } from 'react-icons/ai';

const Footer = () => {
  // Detect if we're on a large screen
  const [isLargeScreen, setIsLargeScreen] = React.useState(false);

  React.useEffect(() => {
    // Check screen size on mount and resize
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1440);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Render different footer based on screen size
  return isLargeScreen ? (
    // Large screen footer (no container for image)
    <div className="footer-container-large">
      <div className="footer-content">
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
      </div>
      
      <style jsx>{`
        .footer-container-large {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 30px 10px;
          background-color: #f5f5f5;
          margin-top: 20px;
        }
        
        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 1400px;
          width: 100%;
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
      `}</style>
    </div>
  ) : (
    // Regular footer for smaller screens
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
          background-color: #f5f5f5;
          margin-top: 20px;
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
  );
};

export default Footer