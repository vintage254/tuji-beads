'use client';

import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context/StateContext';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingBag, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import { urlFor } from '../lib/client';
import { toast } from 'react-hot-toast';

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { authenticatedFetch } = useStateContext();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        // Use authenticated fetch to get orders
        const response = await authenticatedFetch(`/api/orders?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
        toast.error('Failed to load your orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, authenticatedFetch]);

  if (loading) {
    return (
      <div className="order-history-loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="no-orders">
        <FaShoppingBag size={50} />
        <h3>No orders yet</h3>
        <p>You haven&apos;t placed any orders yet.</p>
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
        <div className="order-card" key={order._id}>
          <div className="order-header">
            <div className="order-id">
              <h3>Order #{order._id.substring(0, 8)}</h3>
            </div>
            <div className="order-date">
              <FaCalendarAlt />
              <span>{new Date(order._createdAt).toLocaleDateString()}</span>
            </div>
            <div className="order-total">
              <FaMoneyBillWave />
              <span>${order.totalAmount}</span>
            </div>
          </div>
          
          <div className="order-items">
            {order.orderItems && order.orderItems.map((item, index) => (
              <div className="order-item" key={`${order._id}-${index}`}>
                <div className="item-image">
                  {item.product?.image && (
                    <Image
                      src={urlFor(item.product.image[0]).url()}
                      alt={item.product.name}
                      width={80}
                      height={80}
                    />
                  )}
                </div>
                <div className="item-details">
                  <h4>{item.product?.name || 'Product'}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price}</p>
                </div>
                <div className="item-actions">
                  {item.product?.slug?.current && (
                    <Link href={`/product/${item.product.slug.current}`}>
                      <button className="view-product-btn">View Product</button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-footer">
            <div className="order-status">
              <span className={`status-badge ${order.status}`}>
                {order.status || 'Processing'}
              </span>
            </div>
            <div className="order-actions">
              <button className="btn">Track Order</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;