'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamicImport from 'next/dynamic';
import { useStateContext } from '../../context/StateContext';
import { FiRefreshCw } from 'react-icons/fi';
import ClientLayout from '../../components/ClientLayout';
import Navbar from '../../components/Navbar';

// Import the fallback component
const OrderHistoryFallback = dynamicImport(() => import('../../components/OrderHistoryFallback'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
// Remove edge runtime to avoid issues with client components
// export const runtime = 'edge';

// Client-only component wrapper
function OrderHistoryClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { isAuthenticated, authenticatedFetch, currency, convertPrice } = useStateContext();

  // Display price according to selected currency
  const displayPrice = (price) => {
    if (currency === 'USD') {
      return `$${convertPrice(price).toFixed(2)}`;
    }
    return `KSh ${price.toFixed(2)}`;
  };

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return;

    const initializeOrderHistory = async () => {
      try {
        // Check authentication status
        if (!isAuthenticated()) {
          console.log('User is not authenticated, redirecting to login');
          setError('Please log in to view your order history');
          setIsLoading(false);
          return;
        }

        // Get user from context or localStorage
        const storedUser = localStorage.getItem('user');
        let userData = null;
        
        if (storedUser) {
          try {
            userData = JSON.parse(storedUser);
            console.log('User loaded from localStorage:', userData.email);
          } catch (parseError) {
            console.error('Error parsing stored user:', parseError);
          }
        }
        
        // If we don't have a full user object but have an email, create a minimal user object
        if (!userData || !userData.email) {
          const storedEmail = localStorage.getItem('userEmail');
          if (storedEmail) {
            userData = { email: storedEmail };
            console.log('Created minimal user object from email:', storedEmail);
          }
        }
        
        if (userData && userData.email) {
          setUser(userData);
          console.log('User set for order history:', userData);
          // Fetch orders
          await fetchOrders();
        } else {
          console.error('No user data found despite being authenticated');
          setError('User information is incomplete. Please try logging in again.');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error initializing order history:', err);
        setError('An error occurred while loading your order history');
        setIsLoading(false);
      }
    };

    initializeOrderHistory();
  }, []);

  const fetchOrders = async () => {
    try {
      if (!isAuthenticated()) {
        throw new Error('Authentication required');
      }

      console.log('Fetching orders for authenticated user');
      setIsLoading(true);
      
      // Use authenticatedFetch to ensure proper authentication handling
      const response = await authenticatedFetch('/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache busting parameter to prevent browser caching
        cache: 'no-store',
      });

      console.log('Orders API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response from orders API:', errorData);
        throw new Error(errorData.error || `Error fetching orders: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Received ${data.length} orders from API`);
      
      // Sort orders by date (newest first) in case the API doesn't
      const sortedOrders = [...data].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setOrders(sortedOrders);
      setError(null); // Clear any previous errors
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
      setIsLoading(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      // Check authentication again before refreshing
      if (!isAuthenticated()) {
        throw new Error('Authentication required');
      }
      
      await fetchOrders();
      // Reset error state in case previous errors are resolved
      setError(null);
      console.log('Orders refreshed successfully');
    } catch (err) {
      console.error('Error refreshing orders:', err);
      setError(err.message || 'Failed to refresh orders');
    } finally {
      setIsRefreshing(false);
    }
  };

  // If there's an error, show the fallback component
  if (error) {
    return <OrderHistoryFallback error={error} onRetry={handleRefresh} />;
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
      <div style={{
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Thank you for ordering with us!</h3>
        <p style={{ margin: '0' }}>An agent will contact you shortly regarding your order.</p>
      </div>
      
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Order History</h1>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 15px',
            backgroundColor: '#4a4a4a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            opacity: isRefreshing ? 0.7 : 1
          }}
        >
          <FiRefreshCw style={{ 
            animation: isRefreshing ? 'spin 1s linear infinite' : 'none' 
          }} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
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
              {order.status !== 'pending' && (
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
              )}
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
                    {displayPrice(item.product.price * item.quantity)}
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
                Total: {displayPrice(order.total)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Default export that doesn't directly use StateContext
export default function OrderHistoryPage() {
  return (
    <ClientLayout>
      <Navbar />
      <OrderHistoryClient />
    </ClientLayout>
  );
}
