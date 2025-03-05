'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useStateContext } from '../context/StateContext';
import { client } from '../lib/client';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useStateContext();

  const fetchOrders = useCallback(async () => {
    if (!user || !user._id) {
      setLoading(false);
      setError('Please log in to view your orders');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const query = `*[_type == "order" && user._ref == $userId] | order(_createdAt desc) {
        _id,
        _createdAt,
        items,
        totalAmount,
        status
      }`;
      
      const result = await client.fetch(query, { userId: user._id });
      setOrders(result || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (!user) {
    return (
      <div className="not-logged-in">
        <h2>Please Log In</h2>
        <p>You need to be logged in to view your order history.</p>
        <Link href="/login">
          <button type="button" className="btn">
            Log In
          </button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="order-history-container">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found.</p>
          <Link href="/">
            <button type="button" className="btn">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => order && order._id && (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-date">
                  <p>Order Date: {new Date(order._createdAt).toLocaleDateString()}</p>
                </div>
                <div className="order-status">
                  <p>Status: {order.status || 'Processing'}</p>
                </div>
              </div>
              <div className="order-details">
                {order.items && order.items.map((item, index) => (
                  <div key={`${order._id}-${index}`} className="order-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: KSH {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-summary">
                <h4>Total Amount: KSH {order.totalAmount}</h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;