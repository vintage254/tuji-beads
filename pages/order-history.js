import React, { useEffect, useState } from 'react';
import { useStateContext } from '../context/StateContext';
import { client } from '../lib/client';
import { useRouter } from 'next/router';

const OrderHistory = () => {
  const { user } = useStateContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const query = `*[_type == "order" && user._ref == $userId] | order(orderDate desc)`;
        const orders = await client.fetch(query, { userId: user._id });
        setOrders(orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="order-history-container">
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-item">
              <div className="order-header">
                <h3>Order #{order._id.substring(0, 8)}</h3>
                <span className="order-date">
                  {new Date(order.orderDate).toLocaleDateString()}
                </span>
              </div>
              <div className="order-details">
                <p>Status: <span className="status">{order.status}</span></p>
                <p>Total: Ksh {order.totalPrice}</p>
              </div>
              <div className="order-products">
                {order.products?.map((product) => (
                  <div key={product._key} className="product-item">
                    <span>{product.name}</span>
                    <span>x{product.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
