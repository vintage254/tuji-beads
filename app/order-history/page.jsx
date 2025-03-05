'use client';

import React from 'react';
import Link from 'next/link';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export default function OrderHistoryPlaceholder() {
  return (
    <div style={{ 
      padding: '50px 20px', 
      textAlign: 'center',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>Order History</h1>
      <p>This feature is currently being updated.</p>
      <p>Please check back soon or contact support if you need to view your order history.</p>
      <Link href="/">
        <button style={{
          padding: '10px 20px',
          background: '#f02d34',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}>
          Return to Home
        </button>
      </Link>
    </div>
  );
}
