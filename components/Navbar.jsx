import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineShopping } from 'react-icons/ai';
import { useStateContext } from '../context/StateContext';

const Navbar = () => {
  const { totalQuantities } = useStateContext();
  
  return (
    <div className="navbar-container">
      <div className="logo">
        <Link href="/">
          <Image src="/logo.png" alt="Beads Charm Logo" width={120} height={60} quality={100} layout="intrinsic" />
        </Link>
      </div>
      <div className="nav-links">
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
        </div>
      </div>
      <button type="button" className="cart-icon" onClick="">
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities || 0}</span>
      </button>
    </div>
  )
}

export default Navbar