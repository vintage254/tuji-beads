'use client';

import React from 'react';
import Head from 'next/head';
import '../styles/theme-overrides.css';

import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import CurrencyModal from './CurrencyModal';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Head>
        <title>Beads Charm Collection</title>
      </Head>
      <header>
        <Navbar />
      </header>
      <main className="main-container">
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
      <WhatsAppButton />
      <CurrencyModal />
    </div>
  )
}

export default Layout