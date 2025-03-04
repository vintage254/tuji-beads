import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlinePhone } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import { client } from '../lib/client';
import { useStateContext } from '../context/StateContext';

const Authentication = ({ setShowAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const router = useRouter();
  const { setUser } = useStateContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login logic
      const query = `*[_type == "user" && email == $email][0]`;
      const user = await client.fetch(query, { email: formData.email });
      
      if (!user) {
        toast.error('User not found');
        return;
      }
      
      // In a real app, you would hash and compare passwords
      // This is a simplified version for demonstration
      if (user.password !== formData.password) {
        toast.error('Invalid password');
        return;
      }
      
      // Login successful
      setUser(user);
      toast.success('Login successful!');
      setShowAuth(false);
    } else {
      // Register logic
      const query = `*[_type == "user" && email == $email][0]`;
      const existingUser = await client.fetch(query, { email: formData.email });
      
      if (existingUser) {
        toast.error('Email already registered');
        return;
      }
      
      // Create new user
      const doc = {
        _type: 'user',
        name: formData.name,
        email: formData.email,
        password: formData.password, // In a real app, you would hash this
        phoneNumber: formData.phoneNumber
      };
      
      const result = await client.create(doc);
      
      if (result) {
        // Registration successful
        setUser(result);
        toast.success('Registration successful!');
        setShowAuth(false);
      } else {
        toast.error('Registration failed');
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <button type='button' className='auth-close-btn' onClick={() => setShowAuth(false)}>
          ×
        </button>
        
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">
                <AiOutlineUser />
                <span>Name</span>
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required={!isLogin} 
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">
              <AiOutlineMail />
              <span>Email</span>
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
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
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="phoneNumber">
                <AiOutlinePhone />
                <span>Phone Number</span>
              </label>
              <input 
                type="tel" 
                id="phoneNumber" 
                name="phoneNumber" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                required={!isLogin} 
              />
            </div>
          )}
          
          <button type="submit" className="auth-button">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        
        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Authentication;