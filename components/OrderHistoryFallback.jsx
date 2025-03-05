import React from 'react';
import Link from 'next/link';

const OrderHistoryFallback = () => {
  return (
    <div style={{ 
      padding: '40px 20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '24px', 
        marginBottom: '20px',
        color: '#333'
      }}>
        Order History
      </h1>
      
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '30px',
        textAlign: 'center'
      }}>
        <p style={{ 
          fontSize: '16px', 
          marginBottom: '20px',
          color: '#555'
        }}>
          We're currently having trouble loading your order history.
        </p>
        
        <p style={{ 
          fontSize: '16px', 
          marginBottom: '30px',
          color: '#555'
        }}>
          Please try again later or contact our customer support if the issue persists.
        </p>
        
        <Link href="/" style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#4a4a4a',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '16px'
        }}>
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderHistoryFallback;
