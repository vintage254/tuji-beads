import React, { useState, useEffect } from 'react';
import { client, urlFor } from '../lib/client';
import { useStateContext } from '../context/StateContext';
import { toast } from 'react-hot-toast';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStateContext();

  useEffect(() => {
    if (user) {
      fetchOrders();
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
      <h2>Your Order History</h2>
      
      {loading ? (
        <div className="loading">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-date">
                  <span>Ordered on:</span> {formatDate(order.orderDate)}
                </div>
                <div className={`order-status ${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>
              
              <div className="order-items">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      {item.product.image && (
                        <img src={urlFor(item.product.image[0])} alt={item.product.name} />
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