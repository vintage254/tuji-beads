'use client';

import React, { useState, useEffect } from 'react';
import { OrderHistory } from '../../components';
import { Toaster } from 'react-hot-toast';
import { StateContext } from '../../context/StateContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const OrderHistoryPage = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle client-side rendering only
  if (!isClient) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <StateContext>
      <OrderHistoryContent router={router} />
    </StateContext>
  );
};

// Separate component that uses context
const OrderHistoryContent = ({ router }) => {
  const { user, isAuthenticated } = useStateContext();
  
  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isAuthenticated()) {
      toast.error('Please login to view your order history');
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated()) {
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

export default OrderHistoryPage;
