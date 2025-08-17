import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { useAuth } from '../context/context.jsx'
import './userinfo.css'
import config from '../config/config.js'
const UserInfo = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  
  const { user, logout, isAuthenticated } = useAuth()
  const [image, setImage] = useState('')
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [uploadError, setUploadError] = useState('')
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const imageLoad = async () => {
    try {
      let result = await fetch(`${config.API_BASE_URL}/getimage`, {
        headers: {
          authorization: localStorage.getItem('token')
        }
      })
      let data = await result.text()
      setImage(data)
      console.log(data)
    } catch (error) {
      console.error('Error loading image:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user?.username) {
      imageLoad()
    }
  }, [count, isAuthenticated, user])

  const onSubmit = async (data) => {
    if (!data.picture || data.picture.length === 0) {
      setUploadError('Please select a file to upload')
      return
    }

    setLoading(true)
    setUploadError('')
    setUploadSuccess('')
    
    try {
      const formData = new FormData()
      formData.append('file', data.picture[0])
      formData.append('token', localStorage.getItem('token'))

      const result = await axios.post(`${config.API_BASE_URL}/uploads`, formData)
      console.log(result)
      setUploadSuccess('Profile picture updated successfully!')
      setCount((count) => count + 1)
      reset()
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(''), 3000)
    } catch (err) {
      console.error('Upload error:', err)
      setUploadError('Failed to upload image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Check if user is logged in
  if (!isAuthenticated || !user?.username) {
    return (
      <div className="userinfo-container">
        <div className="userinfo-card">
          <div className="userinfo-header">
            <h1 className="userinfo-title">Access Denied</h1>
            <p className="userinfo-subtitle">You must be logged in to view this page</p>
          </div>
          <div className="userinfo-actions">
            <NavLink to="/login" className="btn btn-primary">
              Login
            </NavLink>
            <NavLink to="/signup" className="btn btn-outline">
              Sign Up
            </NavLink>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="userinfo-container">
      {/* Header Section */}
      <div className="userinfo-header-section">
        <div className="userinfo-header-content">
          <h1 className="userinfo-header-title">User Profile</h1>
          <p className="userinfo-header-subtitle">Manage your account and profile picture</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="userinfo-profile-section">
        <div className="userinfo-profile-card">
          <div className="profile-header">
            <div className="profile-avatar-container">
              {image ? (
                <img 
                  src={
                    image.startsWith('http') ? image : `${config.API_BASE_URL}/images/${image}`
                  } 
                  alt="Profile Picture" 
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="profile-status">
                <span className="status-dot"></span>
                <span className="status-text">Online</span>
              </div>
            </div>
            
            <div className="profile-info">
              <h2 className="profile-username">Hello, {user.username}!</h2>
              <p className="profile-email">Welcome to your profile dashboard</p>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Likes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Resources</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Picture Upload */}
          <div className="profile-upload-section">
            <h3 className="upload-title">Update Profile Picture</h3>
            <p className="upload-description">
              Upload a new profile picture to personalize your account
            </p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="upload-form">
              <div className="file-input-container">
                <input 
                  type="file" 
                  {...register('picture')} 
                  accept=".jpeg,.jpg,.png,.gif"
                  className="file-input"
                  id="profile-picture-input"
                />
                <label htmlFor="profile-picture-input" className="file-input-label">
                  <span className="file-input-icon">📁</span>
                  <span className="file-input-text">Choose File</span>
                </label>
              </div>
              
              {uploadError && <div className="error-message">{uploadError}</div>}
              {uploadSuccess && <div className="success-message">{uploadSuccess}</div>}
              
              <button 
                type="submit" 
                className={`upload-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Picture'}
              </button>
            </form>
          </div>

          {/* Profile Actions */}
          <div className="profile-actions">
            <button onClick={handleLogout} className="logout-button">
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Logout</span>
            </button>
            
            <NavLink to="/post" className="create-post-button">
              <span className="create-post-icon">📝</span>
              <span className="create-post-text">Create New Post</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo