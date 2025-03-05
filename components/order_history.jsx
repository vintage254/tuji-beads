'use client';

import React, { useState, useEffect } from 'react';
import { client, urlFor } from '../lib/client';
import { useStateContext } from '../context/StateContext';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStateContext();

  // Add a refreshInterval to periodically check for new orders
  useEffect(() => {
    if (user) {
      fetchOrders();
      
      // Set up an interval to refresh orders every 30 seconds
      const refreshInterval = setInterval(() => {
        fetchOrders();
      }, 30000);
      
      // Clean up the interval when component unmounts
      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const query = `*[_type == "order" && user._ref == $userId] | order(orderDate desc){
        _id,
        orderItems[]{product->{_id, name, image, price}, quantity},
        totalAmount,
        orderDate,
        status
      }`;
      
      const result = await client.fetch(query, { userId: user._id });
      setOrders(result);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
      
      {loading ? (
        <div className="loading">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven&apos;t placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-date">
                  <span>Ordered on:</span> {formatDate(order.orderDate)}
                </div>
                {/* Status display removed as requested */}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;