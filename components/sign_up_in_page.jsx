import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlinePhone, AiOutlineGlobal } from 'react-icons/ai';
import { FaCity } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { client } from '../lib/client';
import { useStateContext } from '../context/StateContext';

const SignUpInPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    city: '',
    country: 'Kenya'
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser, user } = useStateContext();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error('Email and password are required');
      return false;
    }

    if (!isLogin) {
      if (!formData.name) {
        toast.error('Name is required');
        return false;
      }

      if (!formData.phoneNumber) {
        toast.error('Phone number is required');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return false;
      }

      // Phone number validation
      const phoneRegex = /^\d{10,12}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/[\s-]/g, ''))) {
        toast.error('Please enter a valid phone number');
        return false;
      }

      // Password strength validation
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login logic
        const query = `*[_type == "user" && email == $email][0]`;
        const user = await client.fetch(query, { email: formData.email });
        
        if (!user) {
          toast.error('User not found. Please check your email or register.');
          setLoading(false);
          return;
        }
        
        // In a real app, you would hash and compare passwords
        // This is a simplified version for demonstration
        if (user.password !== formData.password) {
          toast.error('Invalid password');
          setLoading(false);
          return;
        }
        
        // Login successful
        setUser(user);
        toast.success('Login successful!');
        
        // Redirect to previous page or home
        const returnUrl = router.query.returnUrl || '/';
        router.push(returnUrl);
      } else {
        // Register logic
        const query = `*[_type == "user" && email == $email][0]`;
        const existingUser = await client.fetch(query, { email: formData.email });
        
        if (existingUser) {
          toast.error('Email already registered');
          setLoading(false);
          return;
        }
        
        // Create new user
        const doc = {
          _type: 'user',
          name: formData.name,
          email: formData.email,
          password: formData.password, // In a real app, you would hash this
          phoneNumber: formData.phoneNumber,
          city: formData.city,
          country: formData.country,
          registrationDate: new Date().toISOString()
        };
        
        const result = await client.create(doc);
        
        if (result) {
          // Registration successful
          setUser(result);
          toast.success('Registration successful!');
          
          // Redirect to previous page or home
          const returnUrl = router.query.returnUrl || '/';
          router.push(returnUrl);
        } else {
          toast.error('Registration failed');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-page-container">
      <div className="sign-page-content">
        <div className="sign-page-header">
          <Link href="/">
            <div className="sign-page-logo">
              <Image src="/logo.png" alt="Beads Charm Logo" width={150} height={75} quality={100} />
            </div>
          </Link>
          <h1>{isLogin ? 'Welcome Back' : 'Create an Account'}</h1>
          <p>{isLogin ? 'Sign in to continue shopping' : 'Join us to start shopping'}</p>
        </div>
        
        <div className="sign-page-form-container">
          <form onSubmit={handleSubmit} className="sign-page-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">
                  <AiOutlineUser className="form-icon" />
                  <span>Full Name</span>
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Enter your full name"
                  value={formData.name} 
                  onChange={handleChange} 
                  required={!isLogin} 
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">
                <AiOutlineMail className="form-icon" />
                <span>Email Address</span>
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Enter your email"
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">
                <AiOutlineLock className="form-icon" />
                <span>Password</span>
              </label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Enter your password"
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <AiOutlineLock className="form-icon" />
                    <span>Confirm Password</span>
                  </label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    placeholder="Confirm your password"
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    required={!isLogin} 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phoneNumber">
                    <AiOutlinePhone className="form-icon" />
                    <span>Phone Number</span>
                  </label>
                  <input 
                    type="tel" 
                    id="phoneNumber" 
                    name="phoneNumber" 
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber} 
                    onChange={handleChange} 
                    required={!isLogin} 
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="city">
                      <FaCity className="form-icon" />
                      <span>City</span>
                    </label>
                    <input 
                      type="text" 
                      id="city" 
                      name="city" 
                      placeholder="Enter your city"
                      value={formData.city} 
                      onChange={handleChange} 
                    />
                  </div>
                  
                  <div className="form-group half">
                    <label htmlFor="country">
                      <AiOutlineGlobal className="form-icon" />
                      <span>Country</span>
                    </label>
                    <input 
                      type="text" 
                      id="country" 
                      name="country" 
                      placeholder="Enter your country"
                      value={formData.country} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </>
            )}
            
            <button 
              type="submit" 
              className="sign-page-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          <div className="sign-page-toggle">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)}
                className="toggle-button"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
          
          <div className="sign-page-back">
            <Link href="/">
              <button className="back-button">Back to Home</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpInPage;