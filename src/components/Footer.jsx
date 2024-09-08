import React from 'react'
import './Footer.css'
const Footer = () => {
  return (
    <>
    <footer>
        <div className="footer-container">
            <div className="footer-column">
                <h3>About Us</h3>
                <p>We are a team of passionate developers creating amazing web experiences.</p>
            </div>
            
            <div className="footer-column">
                <h3>Follow Us</h3>
                <div className="social-icons">
                    <a href="#"><img src="facebook-icon.png" alt="Facebook"/></a>
                    <a href="#"><img src="twitter-icon.png" alt="Twitter"/></a>
                    <a href="#"><img src="instagram-icon.png" alt="Instagram"/></a>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2024 Your Website. All rights reserved.</p>
        </div>
    </footer>
    </>
  )
}

export default Footer