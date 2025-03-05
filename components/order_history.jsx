'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { client, urlFor } from '../lib/client';
import { useStateContext } from '../context/StateContext';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useStateContext();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const query = `*[_type == "order" && user._ref == $userId] | order(orderDate desc){
        _id,
        orderItems[]{product->{_id, name, image, price}, quantity},
        totalAmount,
        orderDate,
        status
      }`;
      const result = await client.fetch(query, { userId: user._id });
      // Filter out any invalid orders
      const validOrders = result.filter(order => order && order._id);
      setOrders(validOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [fetchOrders, user]);

  useEffect(() => {
    if (user) {
      const refreshInterval = setInterval(() => {
        fetchOrders();
      }, 30000);
      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="order-history-container">
        <h2>Order History</h2>
        <div className="no-orders">
          <p>Please sign in to view your order history</p>
        </div>
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
      <div className="order-history-header">
        <h2>Your Order History</h2>
        <button 
          className="refresh-button" 
          onClick={fetchOrders} 
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Orders'}
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven&apos;t placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => order && order._id ? (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-date">
                  <span>Ordered on:</span> {formatDate(order.orderDate)}
                </div>
                <div className="order-status">
                  <p>Status: {order.status || 'Processing'}</p>
                </div>
              </div>
              
              <div className="order-items">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      {item.product.image && (
                        <Image 
                          src={urlFor(item.product.image[0])}
                          alt={item.product.name}
                          width={100}
                          height={100}
                          className="order-product-image"
                        />
                      )}
                    </div>
                    <div className="item-details">
                      <h4>{item.product.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: KSH {item.product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-total">
                <h4>Total Amount: KSH {order.totalAmount}</h4>
              </div>
            </div>
          ) : null)}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;