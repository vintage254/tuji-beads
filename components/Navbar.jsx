'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineShopping, AiOutlineUser, AiOutlineLogout, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FaDollarSign } from 'react-icons/fa';
import { TbCurrencyShekel } from 'react-icons/tb';
import { Cart, Authentication } from './';
import { useStateContext } from '../context/StateContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { showCart, setShowCart, showAuth, setShowAuth, totalQuantities, user, logout, currency, handleCurrencyChange } = useStateContext();
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
  
  useEffect(() => {
    console.log('Mobile menu state changed:', mobileMenuOpen);
    
    // Apply body scroll lock when menu is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    }
  }, [mobileMenuOpen]);
  
  const handleSignIn = () => {
    setShowAuth(true);
    setMobileMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    console.log('Toggling mobile menu, current state:', mobileMenuOpen);
    console.log('Mobile menu element:', document.querySelector('.mobile-nav'));
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent body scrolling when menu is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = !mobileMenuOpen ? 'hidden' : '';
      console.log('Mobile menu toggled, new state:', !mobileMenuOpen);
      
      // Force a repaint to ensure the menu is visible
      setTimeout(() => {
        const mobileNav = document.querySelector('.mobile-nav');
        if (mobileNav) {
          console.log('Mobile nav after toggle:', mobileNav.className);
          console.log('Mobile nav style:', mobileNav.style.transform);
        }
      }, 100);
    }
  };
  
  // Currency toggle button component
  const CurrencyToggle = ({ isMobile }) => (
    <button 
      type="button" 
      className={isMobile ? "currency-toggle-mobile" : "currency-toggle"}
      onClick={handleCurrencyChange}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        background: 'none',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: isMobile ? '16px' : '14px',
        color: '#333',
        cursor: 'pointer',
        padding: isMobile ? '10px 0' : '5px 10px'
      }}
    >
      {currency === 'KSH' ? (
        <>
          <TbCurrencyShekel size={isMobile ? 18 : 16} />
          <span>KSH</span>
        </>
      ) : (
        <>
          <FaDollarSign size={isMobile ? 18 : 16} />
          <span>USD</span>
        </>
      )}
    </button>
  );
  
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
          <div className="mobile-menu-toggle" style={{ 
            position: 'absolute', 
            right: '15px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <button 
              onClick={toggleMobileMenu} 
              aria-label="Toggle menu" 
              className="hamburger-button"
              style={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '24px',
                height: '18px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                zIndex: 1001
              }}
            >
              <span style={{
                display: 'block',
                width: '24px',
                height: '3px',
                backgroundColor: '#333',
                marginBottom: '5px',
                borderRadius: '2px'
              }}></span>
              <span style={{
                display: 'block',
                width: '24px',
                height: '3px',
                backgroundColor: '#333',
                marginBottom: '5px',
                borderRadius: '2px'
              }}></span>
              <span style={{
                display: 'block',
                width: '24px',
                height: '3px',
                backgroundColor: '#333',
                borderRadius: '2px'
              }}></span>
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
            <CurrencyToggle isMobile={false} />
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
        
        {/* Mobile Cart Icon - only show on mobile when menu is closed */}
        {isMobile && (
          <div className="mobile-nav-controls" style={{
            position: 'absolute',
            right: '60px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
              <AiOutlineShopping />
              <span className="cart-item-qty">{totalQuantities || 0}</span>
            </button>
          </div>
        )}
        
        {/* Mobile Navigation Menu */}
        <div 
          className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`} 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            zIndex: 1000,
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            boxShadow: mobileMenuOpen ? '0 0 10px rgba(0,0,0,0.1)' : 'none',
            overflow: 'auto'
          }}
        >
          <div className="mobile-nav-content" style={{ width: '100%' }}>
            <div className="mobile-nav-header" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <div className="mobile-logo">
                <Image src="/logo.png" alt="Beads Charm Logo" width={100} height={50} quality={100} />
              </div>
              <button 
                onClick={toggleMobileMenu} 
                aria-label="Close menu" 
                className="mobile-close-btn"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '24px'
                }}
              >
                <AiOutlineClose size={24} />
              </button>
            </div>
            <div className="mobile-nav-links" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '18px',
                  color: '#333',
                  textDecoration: 'none',
                  padding: '10px 0',
                  borderBottom: '1px solid #eee'
                }}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '18px',
                  color: '#333',
                  textDecoration: 'none',
                  padding: '10px 0',
                  borderBottom: '1px solid #eee'
                }}
              >
                Products
              </Link>
              <Link 
                href="/about" 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '18px',
                  color: '#333',
                  textDecoration: 'none',
                  padding: '10px 0',
                  borderBottom: '1px solid #eee'
                }}
              >
                About Us
              </Link>
              {user && (
                <Link 
                  href="/order-history" 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: '18px',
                    color: '#333',
                    textDecoration: 'none',
                    padding: '10px 0',
                    borderBottom: '1px solid #eee'
                  }}
                >
                  Order History
                </Link>
              )}
              
              {/* Currency Toggle in Mobile Menu */}
              <div style={{
                padding: '10px 0',
                borderBottom: '1px solid #eee'
              }}>
                <CurrencyToggle isMobile={true} />
              </div>
              
              <div className="mobile-nav-buttons" style={{
                marginTop: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {user ? (
                  <>
                    <div className="user-menu-mobile" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '16px',
                      color: '#333'
                    }}>
                      <span className="user-name-mobile">
                        <AiOutlineUser />
                        <span style={{ marginLeft: '5px' }}>{user.name || user.email}</span>
                      </span>
                    </div>
                    <button 
                      type="button" 
                      className="logout-button-mobile"
                      onClick={() => {
                        logout();
                        router.push('/');
                        setMobileMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '16px',
                        color: '#333',
                        cursor: 'pointer',
                        padding: '10px 0'
                      }}
                    >
                      <AiOutlineLogout />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button 
                    type="button" 
                    className="auth-button-mobile"
                    onClick={handleSignIn}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'none',
                      border: 'none',
                      fontSize: '16px',
                      color: '#333',
                      cursor: 'pointer',
                      padding: '10px 0'
                    }}
                  >
                    <AiOutlineUser />
                    <span>Sign In</span>
                  </button>
                )}
                <button 
                  type="button" 
                  className="cart-icon-mobile"
                  onClick={() => {
                    setShowCart(true);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'none',
                    border: 'none',
                    fontSize: '16px',
                    color: '#333',
                    cursor: 'pointer',
                    padding: '10px 0'
                  }}
                >
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
        
        /* Mobile Nav Styles */
        .mobile-nav {
          visibility: ${mobileMenuOpen ? 'visible' : 'hidden'};
          opacity: ${mobileMenuOpen ? '1' : '0'};
          transition: visibility 0.3s, opacity 0.3s, transform 0.3s;
        }
        
        .mobile-nav.open {
          visibility: visible;
          opacity: 1;
        }
        
        /* Navbar Container Styles */
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background-color: #fff;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          position: relative;
          z-index: 100;
          transition: all 0.3s ease;
        }
        
        .navbar-container.scrolled {
          padding: 5px 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        /* Desktop Nav Styles */
        .desktop-nav {
          display: flex;
          align-items: center;
        }
        
        .nav-links a {
          margin-right: 20px;
          color: #324d67;
          font-size: 16px;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .nav-links a:hover {
          color: #f02d34;
        }
        
        .nav-buttons {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .auth-button, .logout-button {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #324d67;
        }
        
        .auth-button:hover, .logout-button:hover {
          color: #f02d34;
        }
        
        .user-menu {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .user-name {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          color: #324d67;
        }
        
        .cart-icon {
          font-size: 25px;
          color: gray;
          cursor: pointer;
          position: relative;
          transition: transform .4s ease;
          border: none;
          background-color: transparent;
        }
        
        .cart-icon:hover {
          transform: scale(1.1,1.1);
        }
        
        .cart-item-qty {
          position: absolute;
          right: -8px;
          top: -8px;
          font-size: 12px;
          color: #eee;
          background-color: #f02d34;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          text-align: center;
          font-weight: 600;
        }
        
        /* Currency Toggle Styles */
        .currency-toggle, .currency-toggle-mobile {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 5px 10px;
          font-size: 14px;
          color: #324d67;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .currency-toggle:hover, .currency-toggle-mobile:hover {
          border-color: #f02d34;
          color: #f02d34;
        }
        
        .currency-toggle-mobile {
          width: 100%;
          justify-content: center;
          padding: 8px;
          font-size: 16px;
        }
      `}</style>
    </>
  );
};

export default Navbar;