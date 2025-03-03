import React from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';

import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';

const Cart = () => {
  const cartRef = React.useRef();
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove, setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();

  const handleOrder = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    
    // Construct order message for WhatsApp
    const orderItems = cartItems.map(item => 
      `${item.name} (${item.quantity} x KSH ${item.price})`
    ).join('\n');
    
    const orderMessage = `Hello! I would like to place an order:\n\n${orderItems}\n\nTotal: KSH ${totalPrice}`;
    
    // Clear cart
    setCartItems([]);
    setTotalPrice(0);
    setTotalQuantities(0);
    
    // Show success message
    toast.success('Order placed successfully!');
    
    // Close cart
    setTimeout(() => {
      setShowCart(false);
      
      // Open WhatsApp with pre-filled message after a short delay
      setTimeout(() => {
        const phoneNumber = '0748322954'; // Same as in WhatsAppButton
        const encodedMessage = encodeURIComponent(orderMessage);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
      }, 500);
    }, 1000);
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