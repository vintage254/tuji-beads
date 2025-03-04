import React from 'react';
import Head from 'next/head';
import { SignUpInPage } from '../components';

const Auth = () => {
  return (
    <div>
      <Head>
        <title>Sign In | Tuji Beads</title>
        <meta name="description" content="Sign in to your Tuji Beads account" />
      </Head>
      <SignUpInPage />
    </div>
  );
};

export default Auth;
