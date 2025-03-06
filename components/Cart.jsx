'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';
import Image from 'next/image';

import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';

const Cart = () => {
  const cartRef = React.useRef();
  const router = useRouter();
  const pathname = usePathname();
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove, setCartItems, setTotalPrice, setTotalQuantities, authenticatedFetch, isAuthenticated } = useStateContext();

  const { user, setShowAuth } = useStateContext();

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    
    // Check if user is logged in
    if (!user || !isAuthenticated()) {
      console.log('Authentication check failed during checkout:', { user, authenticated: isAuthenticated() });
      toast.error('Please sign in to place an order');
      setShowCart(false);
      setShowAuth(true);
      return;
    }
    
    // Double-check we have the necessary user information
    if (!user.email) {
      console.error('User object missing email during checkout');
      toast.error('User information incomplete. Please sign in again.');
      setShowCart(false);
      setShowAuth(true);
      return;
    }
    
    try {
      // Show loading toast
      const loadingToast = toast.loading('Processing your order...');
      
      // Save cart to localStorage before attempting order
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      console.log('Placing order for user:', user.email);
      
      // Create order through API route using authenticatedFetch
      const response = await authenticatedFetch('/api/orders/create', {
        method: 'POST',
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: totalPrice,
          // Include both user ID and email for more robust identification
          userId: user._id,
          email: user.email
        })
      });
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        console.error('Order creation failed with status:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
        
        // Handle specific error cases
        if (response.status === 401) {
          toast.error('Your session has expired. Please sign in again.');
          setShowCart(false);
          setShowAuth(true);
          return;
        }
        
        throw new Error(errorData.error || errorData.message || 'Failed to create order');
      }

      const result = await response.json();
      console.log('Order creation response:', result);
      
      // Check if order was created successfully
      if (result.success) {
        // Clear cart
        setCartItems([]);
        setTotalPrice(0);
        setTotalQuantities(0);
        localStorage.removeItem('cartItems');
        
        // Show success message with order ID
        toast.success(`Order #${result.order._id} placed successfully! We will contact you shortly.`);
        
        // Close cart and redirect to order history page after a short delay
        setShowCart(false);
        
        // Wait a moment before redirecting to ensure state is updated
        setTimeout(() => {
          router.push('/order-history');
        }, 500);
      } else {
        throw new Error(result.error || 'Failed to create order');
      }
      
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Handle different error scenarios
      if (error.message.includes('Authentication failed') || error.message.includes('session')) {
        toast.error('Authentication error. Please sign in again.');
        setShowCart(false);
        setShowAuth(true);
      } else if (error.message.includes('network') || error.message.includes('connection')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(error.message || 'Failed to place order. Please try again.');
      }
      
      // Restore cart from localStorage if available
      try {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart && cartItems.length === 0) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          
          // Recalculate totals
          const totalPrice = parsedCart.reduce((total, item) => total + (item.price * item.quantity), 0);
          const totalQuantities = parsedCart.reduce((total, item) => total + item.quantity, 0);
          
          setTotalPrice(totalPrice);
          setTotalQuantities(totalQuantities);
          
          console.log('Restored cart from localStorage after order failure');
        }
      } catch (restoreError) {
        console.error('Failed to restore cart from localStorage:', restoreError);
      }
    }
  };

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button type='button' className='cart-heading' onClick={() => setShowCart(false)}>
          <AiOutlineLeft />
          <span className='heading'>Your cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>

        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping cart is empty</h3>
            <p>You haven&apos;t added any items to your cart yet!</p>
            <p>Don&apos;t forget to check out our latest products.</p>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
          {cartItems.length >= 1 && cartItems.map((item) => (
            <div className="product" key={item._id}>
              <Image 
                src={urlFor(item?.image[0])} 
                alt={item?.name}
                width={150}
                height={150}
                className="cart-product-image"
              />
              <div className="item-desc">
                <div className="flex top">
                  <h5>{item.name}</h5>
                  <h4>KSH {item.price}</h4>
                </div>
                <div className="flex bottom">
                  <div>
                    <p className="quantity-desc">
                      <span className="minus" onClick={() => toggleCartItemQuantity(item._id, 'dec')}>
                        <AiOutlineMinus />
                      </span>
                      <span className="num">{item.quantity}</span>
                      <span className="plus" onClick={() => toggleCartItemQuantity(item._id, 'inc')}>
                        <AiOutlinePlus />
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="remove-item"
                    onClick={() => onRemove(item)}
                  >
                    <TiDeleteOutline />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>KSH {totalPrice}</h3>
            </div>
            <div className="payment-container">
              <button 
                type="button" 
                className="payment-button order-button" 
                onClick={handleOrder}
              >
                <span>Make Order</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;