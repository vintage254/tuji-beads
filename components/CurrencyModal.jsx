'use client';

import React, { useEffect } from 'react';
import { useStateContext } from '../context/StateContext';

const CurrencyModal = () => {
  const { setCurrency, showCurrencyModal, setShowCurrencyModal, isLoadingExchangeRate } = useStateContext();

  useEffect(() => {
    // Prevent scrolling when modal is open
    if (showCurrencyModal && typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [showCurrencyModal]);

  const handleCurrencySelect = (selectedCurrency) => {
    setCurrency(selectedCurrency);
    localStorage.setItem('currencySelected', 'true');
    setShowCurrencyModal(false);
  };

  if (!showCurrencyModal) return null;

  return (
    <div className="currency-modal-overlay">
      <div className="currency-modal">
        <h2>Select Your Preferred Currency</h2>
        <p>Please select the currency you would like to use for browsing our products:</p>
        
        <div className="currency-options">
          <button 
            className="currency-option" 
            onClick={() => handleCurrencySelect('KSH')}
            disabled={isLoadingExchangeRate}
          >
            <span className="currency-symbol">KSh</span>
            <span className="currency-name">Kenyan Shilling (KSH) - Default</span>
          </button>
          
          <button 
            className="currency-option" 
            onClick={() => handleCurrencySelect('USD')}
            disabled={isLoadingExchangeRate}
          >
            <span className="currency-symbol">$</span>
            <span className="currency-name">US Dollar (USD)</span>
            {isLoadingExchangeRate && <span className="loading-indicator">Updating rates...</span>}
          </button>
        </div>
      </div>

      <style jsx>{`
        .currency-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1100;
        }
        
        .currency-modal {
          background-color: white;
          border-radius: 8px;
          padding: 30px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .currency-modal h2 {
          font-size: 24px;
          margin-bottom: 15px;
          color: #333;
          text-align: center;
        }
        
        .currency-modal p {
          font-size: 16px;
          margin-bottom: 25px;
          color: #666;
          text-align: center;
        }
        
        .currency-options {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .currency-option {
          display: flex;
          align-items: center;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: none;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        
        .currency-option:hover {
          background-color: #f9f9f9;
          border-color: #ccc;
        }
        
        .currency-option:disabled {
          opacity: 0.7;
          cursor: wait;
        }
        
        .currency-symbol {
          font-size: 20px;
          font-weight: bold;
          margin-right: 15px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f0f0;
          border-radius: 50%;
        }
        
        .currency-name {
          font-size: 16px;
        }
        
        .loading-indicator {
          position: absolute;
          right: 15px;
          font-size: 12px;
          color: #f02d34;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        
        @media (max-width: 768px) {
          .currency-modal {
            padding: 20px;
          }
          
          .currency-modal h2 {
            font-size: 20px;
          }
          
          .currency-option {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default CurrencyModal;
