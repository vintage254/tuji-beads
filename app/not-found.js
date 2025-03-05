'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto' 
    }}>
      <h1 style={{ 
        fontSize: '32px', 
        marginBottom: '20px',
        color: '#333' 
      }}>
        404 - Page Not Found
      </h1>
      <p style={{ 
        fontSize: '18px', 
        marginBottom: '30px',
        color: '#666' 
      }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" style={{
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#4a4a4a',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        transition: 'background-color 0.3s ease'
      }}>
        Return to Home
      </Link>
    </div>
  );
}
