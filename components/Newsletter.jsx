'use client';

import React, { useState } from 'react';
import { AiOutlineMail, AiOutlineCheck } from 'react-icons/ai';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      return;
    }
    
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail('');
      
      // Reset the success message after 5 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }, 1000);
  };

  return (
    <div className="newsletter-container">
      <div className="newsletter-content">
        <div className="newsletter-icon">
          <AiOutlineMail />
        </div>
        <h2>Subscribe to Our Newsletter</h2>
        <p>Stay updated with our latest products, promotions, and beading tips</p>
        
        {subscribed ? (
          <div className="subscription-success">
            <AiOutlineCheck />
            <span>Thank you for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className={loading ? 'loading' : ''}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Newsletter;
