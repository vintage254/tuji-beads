'use client';

import React, { useState, useEffect } from 'react';
import { OrderHistory } from '../../components';
import { Toaster } from 'react-hot-toast';
import { useStateContext } from '../../context/StateContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Providers from '../../components/Providers';

// Set this page to be dynamically rendered
export const dynamic = 'force-dynamic';

// Wrapper component that uses context
const OrderHistoryContent = () => {
  const [isClient, setIsClient] = useState(false);
  const { user, isAuthenticated } = useStateContext();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    // Redirect to home if not authenticated
    if (isClient && !isAuthenticated()) {
      toast.error('Please login to view your order history');
      router.push('/');
    }
  }, [isClient, isAuthenticated, router]);

  if (!isClient || !isAuthenticated()) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <h1>Your Order History</h1>
      <Toaster />
      <div className="order-history-container">
        <OrderHistory userId={user?._id} />
      </div>
    </div>
  );
};

// Main page component that wraps the content with providers
const OrderHistoryPage = () => {
  return (
    <Providers>
      <OrderHistoryContent />
    </Providers>
  );
};

export default OrderHistoryPage;
