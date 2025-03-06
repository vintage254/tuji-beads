// Simple script to test authentication flow
const fetch = require('node-fetch');

async function testAuth() {
  console.log('=== TUJI BEADS AUTHENTICATION TEST ===');
  
  try {
    // Step 1: Login to get session
    console.log('\n1. Attempting login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response status:', loginResponse.status);
    console.log('Login response headers:', Object.fromEntries([...loginResponse.headers]));
    console.log('Login response body:', JSON.stringify(loginData, null, 2));
    
    // Get cookies from response
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Cookies from login:', cookies);
    
    if (!cookies) {
      console.error('No cookies received from login!');
      return;
    }
    
    // Step 2: Test authentication status
    console.log('\n2. Testing authentication status...');
    const authTestResponse = await fetch('http://localhost:3000/api/auth/test', {
      headers: {
        Cookie: cookies
      }
    });
    
    const authTestData = await authTestResponse.json();
    console.log('Auth test response status:', authTestResponse.status);
    console.log('Auth test response body:', JSON.stringify(authTestData, null, 2));
    
    // Step 3: Try to create an order
    console.log('\n3. Attempting to create an order...');
    const orderResponse = await fetch('http://localhost:3000/api/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies
      },
      body: JSON.stringify({
        cartItems: [
          {
            _id: 'test-product-id',
            name: 'Test Product',
            price: 9.99,
            quantity: 1
          }
        ],
        totalPrice: 9.99,
        shippingDetails: {
          name: 'Test User',
          email: 'test@example.com',
          address: '123 Test St',
          city: 'Test City',
          country: 'Test Country',
          postalCode: '12345'
        }
      })
    });
    
    const orderData = await orderResponse.json();
    console.log('Order creation response status:', orderResponse.status);
    console.log('Order creation response body:', JSON.stringify(orderData, null, 2));
    
    // Step 4: Get user orders
    console.log('\n4. Fetching user orders...');
    const ordersResponse = await fetch('http://localhost:3000/api/orders?email=test@example.com', {
      headers: {
        Cookie: cookies
      }
    });
    
    const ordersData = await ordersResponse.json();
    console.log('Orders response status:', ordersResponse.status);
    console.log('Orders response body:', JSON.stringify(ordersData, null, 2));
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAuth();
