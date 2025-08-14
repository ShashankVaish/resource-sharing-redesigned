import React, { useState } from 'react'
import './signup.css'
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { useAuth } from '../context/context.jsx'
import config from '../config/config.js';
const Signup = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
    
  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data),
      });

      const result = await response.text();
      
      if (result && result !== '') {
        setSuccess('Account created successfully! Redirecting to login...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
      console.error('Signup error:', error)
    } finally {
      setLoading(false)
    }
  }

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace={true} />
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <div className="signup-logo">✍️</div>
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Join our community and start sharing resources</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="Enter your username"
              {...register("username", { 
                required: "Username is required", 
                maxLength: { value: 15, message: "Username must be 15 characters or less" },
                minLength: { value: 3, message: "Username must be at least 3 characters" }
              })} 
            />
            {errors.username && <span className="error-message">{errors.username.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
              {...register("name", { 
                required: "Name is required", 
                maxLength: { value: 20, message: "Name must be 20 characters or less" },
                minLength: { value: 3, message: "Name must be at least 3 characters" }
              })} 
            />
            {errors.name && <span className="error-message">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
              {...register("email", { 
                required: "Email is required", 
                maxLength: { value: 150, message: "Email must be 150 characters or less" },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address"
                }
              })} 
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                maxLength: { value: 10, message: "Password must be 10 characters or less" },
                minLength: { value: 5, message: "Password must be at least 5 characters" }
              })} 
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <button 
            type="submit" 
            className={`signup-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="signup-footer">
          <p className="signup-footer-text">
            Already have an account? 
            <a href="/login" className="login-link"> Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup