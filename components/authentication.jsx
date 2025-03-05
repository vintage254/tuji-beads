'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStateContext } from '../context/StateContext';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { toast } from 'react-hot-toast';

const Authentication = ({ setShowAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useStateContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(), 
          password 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Login successful!');
      setShowAuth(false);
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <button 
          type='button' 
          className='auth-close-btn' 
          onClick={() => setShowAuth(false)}
          disabled={isLoading}
        >
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Authentication;