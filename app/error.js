'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Router Error:', error);
  }, [error]);

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        Something went wrong!
      </h1>
      <p style={{ fontSize: '16px', marginBottom: '30px' }}>
        We apologize for the inconvenience. Please try refreshing the page or navigating back to the home page.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4a4a4a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
        <a 
          href="/" 
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#4a4a4a',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
