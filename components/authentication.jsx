'use client';

import React, { useState } from 'react';
import { client } from '../lib/client';
import { useRouter } from 'next/router';
import { useStateContext } from '../context/StateContext';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { toast } from 'react-hot-toast';

const Authentication = ({ setShowAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useStateContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const query = `*[_type == "user" && email == $email][0]`;
      const params = { email };
      
      const user = await client.fetch(query, params);
      
      if (!user) {
        setError('User not found');
        return;
      }

      if (user.password !== password) {
        setError('Invalid password');
        return;
      }

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Login successful!');
      setShowAuth(false);
      router.push('/');
    } catch (err) {
      console.error('Authentication error:', err);
      setError('An error occurred during authentication');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <button type='button' className='auth-close-btn' onClick={() => setShowAuth(false)}>
          ×
        </button>
        
        <form onSubmit={handleLogin} className="auth-form">
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <label htmlFor="email">
              <AiOutlineMail />
              <span>Email</span>
            </label>
            <input 
              type="email" 
              id="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <AiOutlineLock />
              <span>Password</span>
            </label>
            <input 
              type="password" 
              id="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Authentication;