'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/">
        <button type="button" className="btn">
          Return to Home
        </button>
      </Link>
    </div>
  );
}
