import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { NavLink } from 'react-router-dom'
import { set } from 'mongoose'
const Navbar = () => {
  const [username, setUsername] = useState('')
  useEffect(() => {
    setUsername(localStorage.getItem('loggenduser'))
    
    
  })
  
  
  
  
  return (
    <>
    <nav className="navbar">
        <div className="logo">
            <img src="company-logo.png" alt="Company Logo"/>
        </div>
        <ul className="nav-links">
            <li><NavLink to="/">Home</NavLink></li>
            
            
            {username ? <><li><NavLink to='/userinfo'>{username}</NavLink></li>
            <li><NavLink to ='/post'>Post</NavLink></li></>
            :<>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/signup">Signup</NavLink></li>
            </> }
  
        </ul>
    </nav>
    </>
  )
}

export default Navbar