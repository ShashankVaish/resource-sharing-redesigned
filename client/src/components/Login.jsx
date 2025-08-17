import React, { useState } from 'react'
import './login.css'
import { useForm } from "react-hook-form"
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from '../context/context.jsx'
import config from '../config/config.js';
const Login = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result === "") {
        setError('Invalid email or password. Please try again.')
      } else {
        const { succes, jwttoken, isloggendUser } = result
        if (succes) {
          // Use the context login function to update authentication state
          login({ jwttoken, isloggendUser })
          // Navigate to home page
          navigate('/')
        } else {
          setError('Invalid email or password. Please try again.')
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace={true} />
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">📚</div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to access your resources</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input"
              placeholder="Enter your email address"  
              {...register("email", { 
                required: "Email is required",
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
              className="form-input"
              placeholder="Enter your password"  
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })} 
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>
          
          <div className="remember-me">
            <input type="checkbox" id="remember" name="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          <p className="login-footer-text">
            Don't have an account? 
            <a href="/signup" className="signup-link"> Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login