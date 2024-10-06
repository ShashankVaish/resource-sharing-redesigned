import React, { useEffect, useState } from 'react'
import './Home.css'
import { NavLink } from 'react-router-dom'

const Home = () => {
  const [user, setUser] = useState(false)
  const [allpost, setAllpost] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const getpost = async () => {
    let result = await fetch('http://localhost:3000/all-post', {
      headers: {
        authorization: localStorage.getItem('token')
      }
    })
    let data = await result.json()
    if (data) {
      console.log(data.post)
      setUser(true)
      setAllpost(data.post.reverse())
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getpost()
    }
  }, [])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleLike = async (postId) => {
    try {
      await fetch(`http://localhost:3000/like-post/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: localStorage.getItem('token')
        }
      }).then((res)=>console.log(res.json()))
      getpost()  // Refresh posts after like
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const filteredPosts = allpost.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      {user && <>
        <div className="container">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
          {filteredPosts.map((item) => (
            <div className="post-details" key={item._id}>
              <div className="post-item">
                <strong>Title:</strong>
                <span id="post-title">{item.title}</span>
              </div>
              <div className="post-item">
                <strong>Description:</strong>
                <p id="post-description">
                  {item.description}
                </p>
              </div>
              <div className="post-item">
                <strong>Subject:</strong>
                <span id="post-subject">{item.subject}</span>
              </div>
              <div className="post-item">
                <strong>PDF Document:</strong>
                <a href={`http://localhost:3000/images/` + item.pdf} target="_blank" id="pdf-link">View PDF</a>
              </div>
              <div className="post-item">
                <strong>Username:</strong>
                <NavLink to={`/user/` + item.user._id}>
                  <p>{item.user.username}</p>
                </NavLink>
              </div>
              <div className="post-item-like">
                <strong>Likes:</strong>
                <span id="like-count">{item.like.length || 0}</span>
                <button onClick={() => handleLike(item._id)}>Like</button>
              </div>
              <br />
              <hr />
            </div>
          ))}
        </div>
      </>
      }
    </>
  )
}

export default Home
