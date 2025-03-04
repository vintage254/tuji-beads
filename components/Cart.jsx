import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';

import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';

const Cart = () => {
  const cartRef = React.useRef();
  const router = useRouter();
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove, setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();

  const { user, setShowAuth } = useStateContext();

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    
    // Check if user is logged in
    if (!user) {
      toast.error('Please sign in to place an order');
      setShowCart(false);
      // Redirect to auth page with return URL
      router.push({
        pathname: '/auth',
        query: { returnUrl: router.asPath }
      });
      return;
    }
    
    try {
      // Create order in Sanity
      const orderItems = cartItems.map(item => ({
        product: {
          _type: 'reference',
          _ref: item._id
        },
        quantity: item.quantity,
        price: item.price
      }));
      
      const orderDoc = {
        _type: 'order',
        user: {
          _type: 'reference',
          _ref: user._id
        },
        orderItems,
        totalAmount: totalPrice,
        status: 'pending',
        orderDate: new Date().toISOString()
      };
      
      // Create order in Sanity
      const createdOrder = await client.create(orderDoc);
      
      // Send email notification to admin
      try {
        // In a real app, you would use a server-side API for this
        // For demonstration, we'll simulate an email notification
        console.log(`Order notification email would be sent to: derricknjuguna414@gmail.com`);
        console.log(`Order details: ${JSON.stringify({
          orderId: createdOrder._id,
          customer: {
            name: user.name,
            email: user.email,
            phone: user.phoneNumber
          },
          items: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: totalPrice,
          orderDate: new Date().toISOString()
        })}`);
        
        // In a production environment, you would use a service like SendGrid, Mailgun, etc.
        // Example with SendGrid would be:
        // await fetch('/api/send-order-email', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     to: 'derricknjuguna414@gmail.com',
        //     subject: `New Order from ${user.name}`,
        //     orderDetails: { ... }
        //   })
        // });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Continue with order process even if email fails
      }
      
      // Construct order message for WhatsApp
      const orderItemsText = cartItems.map(item => 
        `${item.name} (${item.quantity} x KSH ${item.price})`
      ).join('\n');
      
      const orderMessage = `Hello! I would like to place an order:\n\n${orderItemsText}\n\nTotal: KSH ${totalPrice}`;
      
      // Clear cart
      setCartItems([]);
      setTotalPrice(0);
      setTotalQuantities(0);
      
      // Show success message
      toast.success('Order placed successfully! We will contact you shortly.');
      
      // Close cart and redirect to home page
      setTimeout(() => {
        setShowCart(false);
        
        // Open WhatsApp with pre-filled message after a short delay
        setTimeout(() => {
          const phoneNumber = '0748322954'; // Same as in WhatsAppButton
          const encodedMessage = encodeURIComponent(orderMessage);
          window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
          window.location.href = '/';
        }, 500);
      }, 1000);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
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
              <img src={urlFor(item?.image[0])} className="cart-product-image" />
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
              <p className="order-note">We'll contact you via WhatsApp to confirm your order</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart