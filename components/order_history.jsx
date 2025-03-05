'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '../lib/client';
import toast from 'react-hot-toast';

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Safely format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  // Safely get image URL
  const getImageUrl = (image) => {
    try {
      if (!image) return '/placeholder.png';
      return urlFor(image);
    } catch (error) {
      console.error('Error generating image URL:', error);
      return '/placeholder.png';
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setLoading(false);
        setError('User ID is required');
        return;
      }

      try {
        setLoading(true);
        
        // Try to get token from multiple sources
        let authToken;
        
        // First try localStorage
        if (typeof window !== 'undefined') {
          authToken = localStorage.getItem('token');
        }
        
        // If not in localStorage, try cookies
        if (!authToken) {
          const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          }, {});
          
          // Check for auth_token cookie
          if (cookies['auth_token']) {
            authToken = cookies['auth_token'];
          }
        }
        
        // Prepare headers with token if available
        const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
        console.log('Using auth token:', !!authToken);
        
        const response = await fetch(`/api/orders?userId=${userId}`, { headers });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message || 'Failed to fetch orders');
        setLoading(false);
        toast.error('Failed to load order history');
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="empty-orders">
        <h2>You haven&apos;t placed any orders yet</h2>
        <Link href="/">
          <button type="button" className="btn">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <h3>Order #{order._id.substring(0, 8)}</h3>
            <p>Placed on: {formatDate(order._createdAt)}</p>
            <p className="order-status">Status: {order.status || 'Processing'}</p>
          </div>
          
          <div className="order-items">
            {order.orderItems && order.orderItems.map((item, index) => (
              <div key={`${order._id}-item-${index}`} className="order-item">
                <div className="item-image">
                  {item.product && item.product.image && (
                    <Image
                      src={getImageUrl(item.product.image[0])}
                      alt={item.product.name || 'Product image'}
                      width={80}
                      height={80}
                    />
                  )}
                </div>
                <div className="item-details">
                  <h4>{item.product?.name || 'Product'}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: KSH {item.price || item.product?.price || 0}</p>
                </div>
                {item.product && item.product._id && (
                  <Link href={`/product/${item.product._id}`}>
                    <button className="view-product">View Product</button>
                  </Link>
                )}
              </div>
            ))}
          </div>
          
          <div className="order-footer">
            <p className="order-total">Total: KSH {order.totalAmount || 'N/A'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;