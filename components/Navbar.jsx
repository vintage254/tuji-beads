'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineShopping, AiOutlineUser, AiOutlineLogout, AiOutlineMenu, AiOutlineClose, AiOutlineLogin } from 'react-icons/ai';
import { BsSun, BsMoon } from 'react-icons/bs';
import { FaExchangeAlt } from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';
import { Cart, Authentication } from './';
import { useStateContext } from '../context/StateContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { showCart, setShowCart, showAuth, setShowAuth, totalQuantities, user, logout, theme, toggleTheme, currency, setCurrency, isLoadingExchangeRate } = useStateContext();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  
  // Initialize window width on client side only
  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);
  
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
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    console.log('Mobile menu state changed:', mobileMenuOpen);
    
    // Apply body scroll lock when menu is open
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
  }, [mobileMenuOpen]);
  
  const handleSignIn = () => {
    setShowAuth(true);
    setMobileMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Function to handle currency change
  const handleCurrencyChange = () => {
    const newCurrency = currency === 'KSH' ? 'USD' : 'KSH';
    setCurrency(newCurrency);
  };

  return (
    <>
      <div className={`navbar-container ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <Link href="/">
            <Image src="/logo.png" alt="Beads Charm Collection Logo" width={120} height={60} quality={100} />
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
                backgroundColor: theme === 'dark' ? '#e0e0e0' : '#333',
                marginBottom: '5px',
                borderRadius: '2px'
              }}></span>
              <span style={{
                display: 'block',
                width: '24px',
                height: '3px',
                backgroundColor: theme === 'dark' ? '#e0e0e0' : '#333',
                marginBottom: '5px',
                borderRadius: '2px'
              }}></span>
              <span style={{
                display: 'block',
                width: '24px',
                height: '3px',
                backgroundColor: theme === 'dark' ? '#e0e0e0' : '#333',
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
            {/* Theme Toggle Button */}
            <button 
              type="button" 
              className="theme-toggle-button" 
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'dark' ? (
                <FiSun style={{ color: '#e0e0e0' }} />
              ) : (
                <FiMoon style={{ color: '#333' }} />
              )}
            </button>
            
            {/* Currency Display */}
            <button 
              type="button" 
              className="currency-toggle-button" 
              onClick={handleCurrencyChange}
              disabled={isLoadingExchangeRate}
            >
              <span style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }}>
                {currency === 'USD' ? '$' : 'KSh'}
              </span>
              {isLoadingExchangeRate && <span className="loading-dot"></span>}
            </button>
            
            {user ? (
              <div className="user-menu">
                <span className="user-name">
                  <AiOutlineUser style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }} />
                  <span className="user-name-text" style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }}>
                    {user.name || user.email}
                  </span>
                </span>
                <button 
                  type="button" 
                  className="logout-button" 
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                >
                  <AiOutlineLogout style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }} />
                  <span style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }}>Logout</span>
                </button>
              </div>
            ) : (
              <button type="button" className="auth-button" onClick={handleSignIn}>
                <AiOutlineUser style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }} />
                <span style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }}>Sign In</span>
              </button>
            )}
            <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
              <AiOutlineShopping style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }} />
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
            {/* Cart Icon for Mobile */}
            <button 
              type="button" 
              className="cart-icon-mobile" 
              onClick={() => setShowCart(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <AiOutlineShopping size={25} style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }} />
              {totalQuantities > 0 && (
                <span className="cart-item-qty" style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#f02d34',
                  color: 'white',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {totalQuantities}
                </span>
              )}
            </button>
          </div>
        )}
        
        {/* Mobile Navigation Menu */}
        {isMobile && (
          <div 
            className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`} 
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              backgroundColor: theme === 'dark' ? '#1e1e24' : 'rgba(255, 255, 255, 0.98)',
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
                  <Image src="/logo.png" alt="Beads Charm Collection Logo" width={100} height={50} quality={100} />
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
                  <AiOutlineClose size={24} style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }} />
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
                    color: theme === 'dark' ? '#e0e0e0' : '#333',
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
                    color: theme === 'dark' ? '#e0e0e0' : '#333',
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
                    color: theme === 'dark' ? '#e0e0e0' : '#333',
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
                      color: theme === 'dark' ? '#e0e0e0' : '#333',
                      textDecoration: 'none',
                      padding: '10px 0',
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    Order History
                  </Link>
                )}
              </div>
              
              <div className="mobile-nav-buttons" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                marginTop: '30px'
              }}>
                {/* Theme Toggle Button for Mobile */}
                <button 
                  type="button" 
                  className="mobile-theme-toggle" 
                  onClick={toggleTheme}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'none',
                    border: 'none',
                    fontSize: '16px',
                    color: theme === 'dark' ? '#e0e0e0' : '#333',
                    cursor: 'pointer',
                    padding: '10px 0'
                  }}
                >
                  {theme === 'dark' ? (
                    <>
                      <FiSun style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }} />
                      <span>Light Theme</span>
                    </>
                  ) : (
                    <>
                      <FiMoon style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }} />
                      <span>Dark Theme</span>
                    </>
                  )}
                </button>
                
                {/* Currency Toggle Button for Mobile */}
                <button 
                  type="button" 
                  className="mobile-currency-toggle" 
                  onClick={handleCurrencyChange}
                  disabled={isLoadingExchangeRate}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'none',
                    border: 'none',
                    fontSize: '16px',
                    color: theme === 'dark' ? '#e0e0e0' : '#333',
                    cursor: 'pointer',
                    padding: '10px 0'
                  }}
                >
                  <FaExchangeAlt style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }} />
                  <span>
                    {currency === 'USD' ? 'Switch to KSh' : 'Switch to $'}
                  </span>
                  {isLoadingExchangeRate && <span className="loading-dot"></span>}
                </button>
                
                {/* User Menu for Mobile */}
                {user ? (
                  <>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '16px',
                      color: theme === 'dark' ? '#e0e0e0' : '#333'
                    }}>
                      <span className="user-name-mobile">
                        <AiOutlineUser style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }} />
                        <span style={{ marginLeft: '5px' }}>{user.name || user.email}</span>
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        router.push('/');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '16px',
                        color: theme === 'dark' ? '#e0e0e0' : '#333',
                        cursor: 'pointer',
                        padding: '10px 0'
                      }}
                    >
                      <AiOutlineLogout style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleSignIn}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'none',
                      border: 'none',
                      fontSize: '16px',
                      color: theme === 'dark' ? '#e0e0e0' : '#333',
                      cursor: 'pointer',
                      padding: '10px 0'
                    }}
                  >
                    <AiOutlineUser style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }} />
                    <span>Sign In</span>
                  </button>
                )}
                
                {/* Cart Button for Mobile */}
                <button 
                  type="button" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowCart(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'none',
                    border: 'none',
                    fontSize: '16px',
                    color: theme === 'dark' ? '#e0e0e0' : '#333',
                    cursor: 'pointer',
                    padding: '10px 0'
                  }}
                >
                  <AiOutlineShopping style={{ color: theme === 'dark' ? '#e0e0e0' : '#333' }} />
                  <span>Cart ({totalQuantities || 0})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Cart Component */}
      {showCart && <Cart />}
      
      {/* Authentication Component */}
      {showAuth && <Authentication />}
    </>
  );
};

export default Navbar;