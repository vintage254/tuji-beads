'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineShopping, AiOutlineUser, AiOutlineLogout, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { Cart, Authentication } from './';
import { useStateContext } from '../context/StateContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { showCart, setShowCart, showAuth, setShowAuth, totalQuantities, user, logout } = useStateContext();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  const handleSignIn = () => {
    setShowAuth(true);
    setMobileMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <>
      <div className="navbar-container">
        <div className="logo">
          <Link href="/">
            <Image src="/logo.png" alt="Beads Charm Logo" width={120} height={60} quality={100} />
          </Link>
        </div>
        
        {/* Mobile menu toggle button */}
        <div className="mobile-menu-toggle">
          <button onClick={toggleMobileMenu} aria-label="Toggle menu">
            {mobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
          </button>
        </div>
        
        {/* Desktop Navigation Links */}
        <div className={`nav-links desktop-nav`}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/about">About Us</Link>
            {user && (
              <Link href="/order-history">Order History</Link>
            )}
          </div>
        </div>
        
        {/* Desktop Nav Buttons */}
        <div className="nav-buttons desktop-nav">
          {user ? (
            <div className="user-menu">
              <span className="user-name">
                <AiOutlineUser />
                <span className="user-name-text">{user.name}</span>
              </span>
              <button type="button" className="logout-button" onClick={() => {
                logout();
                router.push('/');
              }}>
                <AiOutlineLogout />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button type="button" className="auth-button" onClick={handleSignIn}>
              <AiOutlineUser />
              <span>Sign In</span>
            </button>
          )}
          <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
            <AiOutlineShopping />
            <span className="cart-item-qty">{totalQuantities || 0}</span>
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-links">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)}>Products</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            {user && (
              <Link href="/order-history" onClick={() => setMobileMenuOpen(false)}>Order History</Link>
            )}
            
            <div className="mobile-nav-buttons">
              {user ? (
                <>
                  <div className="user-menu-mobile">
                    <span className="user-name-mobile">
                      <AiOutlineUser />
                      <span>{user.name}</span>
                    </span>
                  </div>
                  <button type="button" className="logout-button-mobile" onClick={() => {
                    logout();
                    router.push('/');
                    setMobileMenuOpen(false);
                  }}>
                    <AiOutlineLogout />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button type="button" className="auth-button-mobile" onClick={handleSignIn}>
                  <AiOutlineUser />
                  <span>Sign In</span>
                </button>
              )}
              <button type="button" className="cart-icon-mobile" onClick={() => {
                setShowCart(true);
                setMobileMenuOpen(false);
              }}>
                <AiOutlineShopping />
                <span>Cart ({totalQuantities || 0})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCart && <Cart />}
      {showAuth && <Authentication setShowAuth={setShowAuth} />}
    </>
  )
}

export default Navbar