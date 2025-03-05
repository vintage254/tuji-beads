'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import OrderHistory with no SSR
const OrderHistory = dynamic(
  () => import('../../components/order_history'),
  { ssr: false }
);

export default function OrderHistoryPage() {
  return <OrderHistory />;
}
