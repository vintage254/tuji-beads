'use client';

import React, { useState } from 'react';
import { authClient } from '../lib/client';
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
      const query = `*[_type == "user" && email == $email][0] {
        _id,
        _type,
        name,
        email,
        password
      }`;
      const params = { email: email.trim() };
      
      const user = await authClient.fetch(query, params);
      
      if (!user) {
        setError('User not found');
        return;
      }

      if (user.password !== password) {
        setError('Invalid password');
        return;
      }

      // Remove password before storing
      const { password: _, ...userWithoutPassword } = user;
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success('Login successful!');
      setShowAuth(false);
      router.refresh(); // Refresh the current route
    } catch (err) {
      console.error('Authentication error:', err);
      setError('An error occurred during authentication. Please try again.');
      toast.error('Authentication failed');
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