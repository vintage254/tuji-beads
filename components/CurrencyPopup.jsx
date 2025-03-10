import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context/StateContext';
import { FaDollarSign } from 'react-icons/fa';
import { TbCurrencyShekel } from 'react-icons/tb';

const CurrencyPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { handleCurrencyChange, currency, setCurrency } = useStateContext();

  useEffect(() => {
    // Force the popup to show on initial load regardless of localStorage
    // This is for testing purposes - we'll remove this later
    setShowPopup(true);
    
    // Clear any existing currency selection for testing
    // localStorage.removeItem('hasSelectedCurrency');
    
    // Check if the user has already selected a currency
    // const hasSelectedCurrency = localStorage.getItem('hasSelectedCurrency');
    
    // if (!hasSelectedCurrency) {
    //   // Show popup after a short delay
    //   const timer = setTimeout(() => {
    //     setShowPopup(true);
    //   }, 1000);
      
    //   return () => clearTimeout(timer);
    // }
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
      <div className="currency-popup">
        <div className="currency-popup-header">
          <h2>Select Your Preferred Currency</h2>
          <p>Choose the currency you'd like to use while shopping</p>
        </div>
        <div className="currency-popup-options">
          <button 
            className={`currency-option ${currency === 'KSH' ? 'selected' : ''}`}
            onClick={() => selectCurrency('KSH')}
          >
            <TbCurrencyShekel size={24} />
            <span>Kenyan Shilling (KSh)</span>
          </button>
          <button 
            className={`currency-option ${currency === 'USD' ? 'selected' : ''}`}
            onClick={() => selectCurrency('USD')}
          >
            <FaDollarSign size={24} />
            <span>US Dollar ($)</span>
          </button>
        </div>
        <div className="currency-popup-footer">
          <p>You can change this later in the menu</p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyPopup;
