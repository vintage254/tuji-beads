'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamicImport from 'next/dynamic';

// Import the fallback component
const OrderHistoryFallback = dynamicImport(() => import('../../components/OrderHistoryFallback'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Simple client-only component
export default function OrderHistoryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return;

    try {
      // Get user from localStorage
      const storedUser = localStorage.getItem('user');
      const storedEmail = localStorage.getItem('userEmail');
      
      // Check for session cookie
      const hasCookie = document.cookie.includes('user_session=');
      
      if (!hasCookie) {
        setError('Please log in to view your order history');
        setIsLoading(false);
        return;
      }
      
      let userData = null;
      
      if (storedUser) {
        try {
          userData = JSON.parse(storedUser);
        } catch (parseError) {
          console.error('Error parsing stored user:', parseError);
        }
      }
      
      // If we don't have a full user object but have an email, create a minimal user object
      if (!userData && storedEmail) {
        userData = { email: storedEmail };
      }
      
      if (!userData) {
        setError('Please log in to view your order history');
        setIsLoading(false);
        return;
      }
      
      setUser(userData);

      // Fetch orders
      fetchOrders(userData);
    } catch (err) {
      console.error('Error initializing order history:', err);
      setError('An error occurred while loading your order history');
      setIsLoading(false);
    }
  }, []);

  const fetchOrders = async (user) => {
    try {
      if (!user) {
        throw new Error('Authentication required');
      }

      // Add user ID or email to query params
      const params = new URLSearchParams();
      if (user._id) {
        params.append('userId', user._id);
      } else if (user.email) {
        params.append('email', user.email);
      } else {
        throw new Error('User ID or email is required');
      }
      
      // Use credentials: 'include' to send cookies with the request
      const response = await fetch(`/api/orders?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending session cookies
      });

      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Simple sanitization to ensure data is serializable
      const sanitizedOrders = data.map(order => ({
        _id: order._id || 'unknown',
        orderNumber: order.orderNumber || 'unknown',
        createdAt: order.createdAt || new Date().toISOString(),
        status: order.status || 'processing',
        total: order.total || 0,
        items: (order.items || []).map(item => ({
          _id: item._id || 'unknown',
          product: {
            name: item.product?.name || 'Product name unavailable',
            price: item.product?.price || 0,
          },
          quantity: item.quantity || 1,
        })),
      }));

      setOrders(sanitizedOrders);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
      setIsLoading(false);
    }
  };

  // If there's an error, show the fallback component
  if (error) {
    return <OrderHistoryFallback />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div style={{ 
        padding: '40px 20px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <p style={{ fontSize: '16px' }}>Loading your order history...</p>
      </div>
    );
  }

  // No orders state
  if (orders.length === 0) {
    return (
      <div style={{ 
        padding: '40px 20px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Order History</h1>
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #ddd',
          borderRadius: '5px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            You haven't placed any orders yet.
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4a4a4a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  // Render orders
  return (
    <div style={{ 
      padding: '40px 20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Order History</h1>
      
      {orders.map((order) => (
        <div 
          key={order._id} 
          style={{
            marginBottom: '20px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            overflow: 'hidden'
          }}
        >
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderBottom: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
          }}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                Order #{order.orderNumber}
              </p>
              <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span style={{
                display: 'inline-block',
                padding: '5px 10px',
                backgroundColor: order.status === 'completed' ? '#d4edda' : '#fff3cd',
                color: order.status === 'completed' ? '#155724' : '#856404',
                borderRadius: '3px',
                fontSize: '14px'
              }}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
          
          <div style={{ padding: '15px' }}>
            {order.items.map((item, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: index < order.items.length - 1 ? '1px solid #eee' : 'none'
                }}
              >
                <div>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                    {item.product.name}
                  </p>
                  <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0', fontWeight: 'bold' }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            
            <div style={{
              marginTop: '15px',
              paddingTop: '15px',
              borderTop: '1px solid #ddd',
              textAlign: 'right'
            }}>
              <p style={{ 
                margin: '0', 
                fontSize: '18px', 
                fontWeight: 'bold' 
              }}>
                Total: ${order.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
