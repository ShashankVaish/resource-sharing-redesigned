import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <h3 className="footer-section-title">About Us</h3>
          <p className="footer-section-description">
            I make this project for our resume building and help students to share their resources like notes, pdfs, etc.
            This platform allows users to upload and share educational materials, fostering a collaborative learning environment.
          </p>
        </div>
        
        {/* Quick Links Section */}
        <div className="footer-section">
          <h3 className="footer-section-title">Quick Links</h3>
          <ul className="footer-links">
            <li className="footer-link-item">
              <a href="/" className="footer-link">
                <span className="footer-link-icon">🏠</span>
                Home
              </a>
            </li>
            <li className="footer-link-item">
              <a href="/post" className="footer-link">
                <span className="footer-link-icon">📝</span>
                Create Post
              </a>
            </li>
            <li className="footer-link-item">
              <a href="/login" className="footer-link">
                <span className="footer-link-icon">🔑</span>
                Login
              </a>
            </li>
            <li className="footer-link-item">
              <a href="/signup" className="footer-link">
                <span className="footer-link-icon">✍️</span>
                Sign Up
              </a>
            </li>
          </ul>
        </div>
        
        {/* Contact Section */}
        <div className="footer-section">
          <h3 className="footer-section-title">Contact Info</h3>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <span>vaishshashank3@gmail.com</span>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>Laboni preview , crossing republik Ghaziabad</span>
            </div>
          </div>
        </div>
        
        {/* Social Media Section */}
        <div className="footer-section">
          <h3 className="footer-section-title">Follow Us</h3>
          <p className="footer-section-description">
            Stay connected with us on social media for the latest updates and resources.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <span className="social-icon">📘</span>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <span className="social-icon">🐦</span>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <span className="social-icon">📷</span>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <span className="social-icon">💼</span>
            </a>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="newsletter-section">
          <h3 className="newsletter-title">Stay Updated</h3>
          <p className="newsletter-description">
            Subscribe to our newsletter for the latest resources and updates.
          </p>
          <form className="newsletter-form">
            <input 
              type="email" 
              className="newsletter-input" 
              placeholder="Enter your email address"
              aria-label="Email for newsletter"
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            &copy; 2024 Resource Sharing Platform. All rights reserved.
          </p>
          <ul className="footer-bottom-links">
            <li>
              <a href="#" className="footer-bottom-link">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="footer-bottom-link">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="footer-bottom-link">Cookie Policy</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer