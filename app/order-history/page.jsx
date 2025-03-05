'use client';

import React, { useState, useEffect } from 'react';
import { OrderHistory } from '../../components';
import { Toaster } from 'react-hot-toast';
import { useStateContext } from '../../context/StateContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Providers from '../../components/Providers';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

// Simple client-only component
const OrderHistoryPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);
    
    // Check authentication on the client side only
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast.error('Please login to view your order history');
        router.push('/');
        return false;
      }
      return true;
    };
    
    if (isClient) {
      const isAuthenticated = checkAuth();
      setIsLoading(!isAuthenticated);
    }
  }, [isClient, router]);

  // Show loading state until client-side code confirms authentication
  if (!isClient || isLoading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }

  // Get user ID from localStorage directly to avoid serialization issues
  const getUserId = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user._id;
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const userId = getUserId();

  return (
    <div className="order-history-page">
      <h1>Your Order History</h1>
      <Toaster />
      <div className="order-history-container">
        {userId ? (
          <OrderHistory userId={userId} />
        ) : (
          <p>Unable to load user information. Please try logging in again.</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
