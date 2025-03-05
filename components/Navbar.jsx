import React from 'react';
import Link from 'next/link';
import { AiOutlineShopping, AiOutlineUser } from 'react-icons/ai';
import { Cart } from './';
import { useStateContext } from '../context/StateContext';
import { useRouter } from 'next/router';

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities, user, logout } = useStateContext();
  const router = useRouter();

  const handleAuthClick = () => {
    if (user) {
      logout();
      router.push('/');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href="/">Tuji Beads</Link>
      </p>

      <div className="navbar-right">
        {user && (
          <Link href="/order-history" className="order-history-link">
            Order History
          </Link>
        )}
        
        <button 
          type="button" 
          className="auth-btn"
          onClick={handleAuthClick}
        >
          <AiOutlineUser />
          <span className="auth-text">
            {user ? 'Logout' : 'Login'}
          </span>
        </button>

        <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
          <AiOutlineShopping />
          <span className="cart-item-qty">{totalQuantities}</span>
        </button>

        {showCart && <Cart />}
      </div>
    </div>
  );
};

export default Navbar;