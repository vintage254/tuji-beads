import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      const storedEmail = localStorage.getItem('userEmail');
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
        }
      }
      
      // Store email for easier access
      if (storedEmail) {
        if (!user) {
          // If we have email but no user object, create a minimal one
          setUser({ email: storedEmail });
        }
      }
      
      // Get session ID from cookie
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      
      if (cookies['user_session']) {
        setSessionId(cookies['user_session']);
        console.log('Session ID retrieved from cookie:', cookies['user_session']);
      } else {
        console.log('No session ID found in cookies');
      }
      
      // Initialize cart from localStorage if available
      const storedCartItems = localStorage.getItem('cartItems');
      if (storedCartItems) {
        try {
          const parsedCartItems = JSON.parse(storedCartItems);
          setCartItems(parsedCartItems);
          
          // Calculate total price and quantities
          const totalPrice = parsedCartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
          }, 0);
          
          const totalQuantities = parsedCartItems.reduce((total, item) => {
            return total + item.quantity;
          }, 0);
          
          setTotalPrice(totalPrice);
          setTotalQuantities(totalQuantities);
        } catch (error) {
          console.error('Error parsing stored cart items:', error);
          localStorage.removeItem('cartItems');
        }
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies to be sent/received
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store user in state and localStorage
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Store email for easier access
      localStorage.setItem('userEmail', data.user.email);
      
      // Store session ID
      if (data.sessionId) {
        setSessionId(data.sessionId);
        console.log('Session established');
      } else {
        console.log('No session ID received from login response');
      }

      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include', // Important for cookies to be sent/received
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store user in state and localStorage
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Store email for easier access
      localStorage.setItem('userEmail', userData.email);
      
      // Store session ID
      if (data.sessionId) {
        setSessionId(data.sessionId);
        console.log('Session established after registration');
      } else {
        console.warn('No session ID received from registration response');
      }

      return data.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    // Attempt to invalidate session on the server
    try {
      if (sessionId) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Continue with client-side logout regardless of server response
    }
    
    // Clear client-side state
    setUser(null);
    setSessionId(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    
    // Clear cookies
    document.cookie = 'user_session=; Max-Age=0; path=/; domain=' + window.location.hostname;
    document.cookie = 'user_email=; Max-Age=0; path=/; domain=' + window.location.hostname;
    
    // Clear cart
    setCartItems([]);
    setTotalPrice(0);
    setTotalQuantities(0);
    localStorage.removeItem('cartItems');
    
    toast.success('Logged out successfully');
  };

  const isAuthenticated = () => {
    // Check for user and valid session
    const hasUser = !!user;
    const hasSessionCookie = typeof window !== 'undefined' && document.cookie.includes('user_session=');
    const hasSessionState = !!sessionId;
    
    const isAuth = hasUser && (hasSessionState || hasSessionCookie);
    console.log('Authentication check:', { hasUser, hasSessionCookie, hasSessionState, isAuth });
    return isAuth;
  };

  const authenticatedFetch = async (url, options = {}) => {
    // Get user email from state or localStorage
    let userEmail = user?.email;
    if (!userEmail && typeof window !== 'undefined') {
      userEmail = localStorage.getItem('userEmail');
    }

    // Prepare headers with user email if available
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (userEmail) {
      headers['X-User-Email'] = userEmail;
    }
    
    // Check if we have a session ID
    const currentSessionId = sessionId || (typeof window !== 'undefined' && 
      document.cookie.split(';').find(c => c.trim().startsWith('user_session='))?.split('=')[1]);
    
    if (currentSessionId) {
      console.log('Session ID available for request');
    } else {
      console.warn('No session ID available for authenticated request');
    }

    console.log('Making authenticated request to:', url);

    try {
      // Include credentials to send cookies (session ID)
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include' // Important for cookies to be sent
      });
      
      // Handle authentication errors
      if (response.status === 401) {
        console.error('Authentication failed with status 401');
        
        // Clear user data on auth failure
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          localStorage.removeItem('userEmail');
          setUser(null);
          setSessionId(null);
        }
        
        throw new Error('Authentication failed. Please sign in again.');
      }
      
      return response;
    } catch (error) {
      console.error('Error in authenticatedFetch:', error);
      throw error;
    }
  };

  let foundProduct;

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find((item) => item._id === product._id);
    
    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
    
    if(checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if(cartProduct._id === product._id) return {
          ...cartProduct,
          quantity: cartProduct.quantity + quantity
        }
        return cartProduct;
      });

      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }
    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
    setCartItems(newCartItems);
  };

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    const newCartItems = cartItems.filter((item) => item._id !== id);

    if(value === 'inc') {
      setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]);
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1);
    } else if(value === 'dec') {
      if (foundProduct.quantity > 1) {
        setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1);
      }
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if(prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        showAuth,
        setShowAuth,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
        user,
        setUser,
        login,
        register,
        logout,
        isAuthenticated,
        authenticatedFetch,
        sessionId
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default StateContext;

export const useStateContext = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useStateContext must be used within a StateContext.Provider');
  }
  return context;
};