'use client';

import React from 'react';
import { StateContext } from '../context/StateContext';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
  return (
    <StateContext>
      <Toaster />
      {children}
    </StateContext>
  );
}
