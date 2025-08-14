import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './Usercard.css'
import config from '../config/config.js'
const Usercard = () => {
  const [user, setUser] = useState({})

  const fetchdata = async () => {
    const url = window.location.href
    let userid = url.toString().split("/")[4]

    try {
      const result = await axios.get(`${config.API_BASE_URL}/user/${userid}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'json'
      });
      console.log(result)
      setUser(result.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchdata()
  }, [])

  return (
    <div>
      <h1>User Card</h1>
      {user ? (
        <div className="user-card">
        <img src={`${config.API_BASE_URL}/images/${user.profilepic}`} alt="Profile" />
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Username: {user.username}</p>
      </div>
      
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Usercard;
