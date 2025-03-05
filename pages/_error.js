import React from 'react';

function Error({ statusCode }) {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </h1>
      <p style={{ fontSize: '16px', marginBottom: '30px' }}>
        We apologize for the inconvenience. Please try refreshing the page or navigating back to the home page.
      </p>
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
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
