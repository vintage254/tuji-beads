import React, { useState } from 'react';
import { useStateContext } from '../context/StateContext';
import { toast } from 'react-hot-toast';
import { AiOutlineClose } from 'react-icons/ai';

const Authentication = ({ setShowAuth }) => {
  const onClose = () => setShowAuth(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  
  const { login, register } = useStateContext();

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && !formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Login
        await login(formData.email, formData.password);
        toast.success('Logged in successfully!');
      } else {
        // Register
        await register(formData);
        toast.success('Account created successfully!');
      }
      
      // Close modal on success
      onClose();
    } catch (error) {
      setGeneralError(error.message || 'Authentication failed. Please try again.');
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      phoneNumber: ''
    });
    setErrors({});
    setGeneralError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
        
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {generalError && (
              <div className="auth-error general-error">
                {generalError}
              </div>
            )}
            
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <div className="auth-error">{errors.name}</div>}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <div className="auth-error">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <div className="auth-error">{errors.password}</div>}
            </div>
            
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={errors.phoneNumber ? 'error' : ''}
                />
                {errors.phoneNumber && <div className="auth-error">{errors.phoneNumber}</div>}
              </div>
            )}
            
            <div className="form-actions">
              <button
                className="auth-button"
                type="submit"
                disabled={isLoading}
              >{isLoading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}</button>
              
              <div className="auth-toggle">
                <p>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="toggle-auth-btn"
                  >
                    {isLogin ? 'Sign Up' : 'Login'}
                  </button>
                </p>
              </div>
            </div>
          </form>
        )}
        
        <button className="auth-close-btn" onClick={onClose}>
          <AiOutlineClose />
        </button>
      </div>
    </div>
  );
};

export default Authentication;