import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context/StateContext';
import { FaDollarSign } from 'react-icons/fa';
import { TbCurrencyShekel } from 'react-icons/tb';

const CurrencyPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { handleCurrencyChange, currency, setCurrency } = useStateContext();

  useEffect(() => {
    // Check if the user has already selected a currency
    const hasSelectedCurrency = localStorage.getItem('hasSelectedCurrency');
    
    if (!hasSelectedCurrency) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const selectCurrency = (selectedCurrency) => {
    // Set the selected currency
    setCurrency(selectedCurrency);
    
    // Save the selection to localStorage
    localStorage.setItem('currency', selectedCurrency);
    localStorage.setItem('hasSelectedCurrency', 'true');
    
    // Close the popup
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="currency-popup-overlay">
      <div className="currency-popup-card">
        <h3>Select Your Preferred Currency</h3>
        <div className="currency-buttons">
          <button 
            className="currency-button"
            onClick={() => selectCurrency('KSH')}
          >
            <TbCurrencyShekel size={20} />
            <span>KSH</span>
          </button>
          <button 
            className="currency-button"
            onClick={() => selectCurrency('USD')}
          >
            <FaDollarSign size={20} />
            <span>USD</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .currency-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .currency-popup-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 20px;
          width: 300px;
          text-align: center;
        }
        
        h3 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 18px;
          color: #333;
        }
        
        .currency-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
        }
        
        .currency-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 20px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 16px;
        }
        
        .currency-button:hover {
          border-color: #f02d34;
          color: #f02d34;
        }
      `}</style>
    </div>
  );
};

export default CurrencyPopup;
