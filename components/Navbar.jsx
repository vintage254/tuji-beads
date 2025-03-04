import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineShopping, AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';
import { useStateContext } from '../context/StateContext';
import { Cart, Authentication } from './';

const Navbar = () => {
  const { showCart, setShowCart, showAuth, setShowAuth, totalQuantities, user, logout } = useStateContext();
  
  return (
    <>
      <div className="navbar-container">
        <div className="logo">
          <Link href="/">
            <Image src="/logo.png" alt="Beads Charm Logo" width={120} height={60} quality={100} layout="intrinsic" />
          </Link>
        </div>
        <div className="nav-links">
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/about">About Us</Link>
            {user && (
              <Link href="/order-history">Order History</Link>
            )}
          </div>
        </div>
        <div className="nav-buttons">
          {user ? (
            <div className="user-menu">
              <span className="user-name">
                <AiOutlineUser />
                {user.name}
              </span>
              <button type="button" className="logout-button" onClick={logout}>
                <AiOutlineLogout />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button type="button" className="auth-button" onClick={() => setShowAuth(true)}>
              <AiOutlineUser />
              <span>Sign In</span>
            </button>
          )}
          <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
            <AiOutlineShopping />
            <span className="cart-item-qty">{totalQuantities || 0}</span>
          </button>
        </div>
      </div>
      {showCart && <Cart />}
      {showAuth && <Authentication setShowAuth={setShowAuth} />}
    </>
  )
}

export default Navbar