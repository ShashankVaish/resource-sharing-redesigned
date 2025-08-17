import React, { useState } from 'react'
import './Navbar.css'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/context.jsx'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const isActiveRoute = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand/Logo Section */}
        <NavLink to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="navbar-logo">📚</div>
          <span className="navbar-title">Resource Sharing</span>
        </NavLink>

        {/* Mobile Menu Toggle */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-nav ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <NavLink 
              to="/" 
              className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span className="nav-link-icon">🏠</span>
              <span className="nav-link-text">Home</span>
            </NavLink>
          </li>

          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <NavLink 
                  to="/post" 
                  className={`nav-link ${isActiveRoute('/post') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span className="nav-link-icon">📝</span>
                  <span className="nav-link-text">Create Post</span>
                </NavLink>
              </li>
              
              {/* User Menu */}
              <li className="nav-item">
                <div className="user-menu">
                  <div className="user-avatar">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="user-dropdown">
                    <NavLink 
                      to="/userinfo" 
                      className="dropdown-item"
                      onClick={closeMobileMenu}
                    >
                      <span>👤</span> Profile
                    </NavLink>
                    <button 
                      className="dropdown-item danger"
                      onClick={handleLogout}
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink 
                  to="/login" 
                  className={`nav-link ${isActiveRoute('/login') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span className="nav-link-icon">🔐</span>
                  <span className="nav-link-text">Login</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/signup" 
                  className={`nav-link ${isActiveRoute('/signup') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span className="nav-link-icon">📝</span>
                  <span className="nav-link-text">Sign Up</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar