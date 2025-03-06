import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiRefreshCw } from 'react-icons/fi';
import { useStateContext } from '../context/StateContext';

const OrderHistoryFallback = ({ error, onRetry }) => {
  const router = useRouter();
  const { setShowAuth } = useStateContext();
  
  // Handle sign in button click
  const handleSignIn = () => {
    setShowAuth(true);
    // After sign in, the user should be redirected back to the order history page
    localStorage.setItem('redirectAfterAuth', '/order-history');
  };
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
          {error || "We're currently having trouble loading your order history."}
        </p>
        
        <p style={{ 
          fontSize: '16px', 
          marginBottom: '30px',
          color: '#555'
        }}>
          {error && error.includes('log in') 
            ? 'Please sign in to view your order history.' 
            : 'Please try again or contact our customer support if the issue persists.'}
        </p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          {onRetry && (
            <button 
              onClick={onRetry}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '10px 20px',
                backgroundColor: '#4a4a4a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              <FiRefreshCw />
              Try Again
            </button>
          )}
          
          {error && (error.includes('log in') || error.includes('authentication')) ? (
            <button
              onClick={handleSignIn}
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryFallback;
