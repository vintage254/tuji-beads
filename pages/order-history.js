import React from 'react';
import { OrderHistory } from '../components';
import { useStateContext } from '../context/StateContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const OrderHistoryPage = () => {
  const { user } = useStateContext();
  const router = useRouter();

  // Redirect to home if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="order-history-page">
      <OrderHistory />
    </div>
  );
};

export default OrderHistoryPage;
