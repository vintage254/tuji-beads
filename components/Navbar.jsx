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
  const [scrolled, setScrolled] = useState(false);
  const isMobile = windowWidth <= 768;
  
  // Handle window resize and scroll
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      handleResize(); // Initialize on mount
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
  const handleSignIn = () => {
    setShowAuth(true);
    setMobileMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent body scrolling when menu is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = !mobileMenuOpen ? 'hidden' : '';
    }
  };
  
  return (
    <>
      <div className={`navbar-container ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <Link href="/">
            <Image src="/logo.png" alt="Beads Charm Logo" width={120} height={60} quality={100} />
          </Link>
        </div>
        
        {/* Mobile menu toggle button - only show on mobile */}
        {isMobile && (
          <div className="mobile-menu-toggle">
            <button 
              onClick={toggleMobileMenu} 
              aria-label="Toggle menu" 
              className="hamburger-button"
            >
              <div className={`hamburger-icon ${mobileMenuOpen ? 'open' : ''}`}>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </div>
            </button>
          </div>
        )}
        
        {/* Desktop Navigation Links - only show on desktop */}
        {!isMobile && (
          <div className="nav-links desktop-nav">
            <div style={{ display: 'flex', gap: '15px' }}>
              <Link href="/">Home</Link>
              <Link href="/products">Products</Link>
              <Link href="/about">About Us</Link>
              {user && (
                <Link href="/order-history">Order History</Link>
              )}
            </div>
          </div>
        )}
        
        {/* Desktop Nav Buttons - only show on desktop */}
        {!isMobile && (
          <div className="nav-buttons desktop-nav">
            {user ? (
              <div className="user-menu">
                <span className="user-name">
                  <AiOutlineUser />
                  <span className="user-name-text">{user.name || user.email}</span>
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
        )}
        
        {/* Mobile Cart Icon and Menu Toggle - only show on mobile when menu is closed */}
        {isMobile && !mobileMenuOpen && (
          <div className="mobile-nav-controls">
            <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
              <AiOutlineShopping />
              <span className="cart-item-qty">{totalQuantities || 0}</span>
            </button>
            <button 
              onClick={toggleMobileMenu} 
              aria-label="Toggle menu" 
              className="mobile-menu-btn"
            >
              <AiOutlineMenu size={24} />
            </button>
          </div>
        )}
        
        {/* Mobile Navigation Menu */}
        <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-content">
            <div className="mobile-nav-header">
              <div className="mobile-logo">
                <Image src="/logo.png" alt="Beads Charm Logo" width={100} height={50} quality={100} />
              </div>
              <button onClick={toggleMobileMenu} aria-label="Close menu" className="mobile-close-btn">
                <AiOutlineClose size={24} />
              </button>
            </div>
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
                        <span>{user.name || user.email}</span>
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
      </div>

      {showCart && <Cart />}
      {showAuth && <Authentication setShowAuth={setShowAuth} />}

      <style jsx global>{`
        /* Hamburger Menu Styles */
        .hamburger-button {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          z-index: 1000;
        }
        
        .hamburger-icon {
          width: 24px;
          height: 18px;
          position: relative;
          transform: rotate(0deg);
          transition: .5s ease-in-out;
        }
        
        .hamburger-line {
          display: block;
          position: absolute;
          height: 3px;
          width: 100%;
          background: #333;
          border-radius: 3px;
          opacity: 1;
          left: 0;
          transform: rotate(0deg);
          transition: .25s ease-in-out;
        }
        
        .hamburger-icon .hamburger-line:nth-child(1) {
          top: 0px;
        }
        
        .hamburger-icon .hamburger-line:nth-child(2) {
          top: 8px;
        }
        
        .hamburger-icon .hamburger-line:nth-child(3) {
          top: 16px;
        }
        
        .hamburger-icon.open .hamburger-line:nth-child(1) {
          top: 8px;
          transform: rotate(135deg);
        }
        
        .hamburger-icon.open .hamburger-line:nth-child(2) {
          opacity: 0;
          left: -60px;
        }
        
        .hamburger-icon.open .hamburger-line:nth-child(3) {
          top: 8px;
          transform: rotate(-135deg);
        }
        
        /* Mobile Navigation Styles */
        .mobile-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-color: rgba(255, 255, 255, 0.98);
          z-index: 999;
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
          overflow-y: auto;
        }
        
        .mobile-nav.open {
          transform: translateX(0);
        }
        
        .mobile-nav-content {
          padding: 20px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .mobile-nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        
        .mobile-close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #333;
        }
        
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .mobile-nav-links a {
          font-size: 18px;
          color: #333;
          text-decoration: none;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
          transition: color 0.2s;
        }
        
        .mobile-nav-links a:hover {
          color: #666;
        }
        
        .mobile-nav-buttons {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .mobile-nav-buttons button {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          font-size: 16px;
          color: #333;
          cursor: pointer;
          padding: 10px 0;
        }
        
        .user-name-mobile {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          color: #333;
        }
      `}</style>
    </>
  )
}

export default Navbar;