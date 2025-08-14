import React, { useEffect, useState } from 'react'
import './Home.css'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/context.jsx'
import config from '../config/config.js'
const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const [allpost, setAllpost] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const getpost = async () => {
    setLoading(true)
    try {
      let result = await fetch(`${config.API_BASE_URL}/all-post`, {
        headers: {
          authorization: localStorage.getItem('token')
        }
      })
      let data = await result.json()
      if (data) {
        console.log(data.post)
        setAllpost(data.post.reverse())
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && localStorage.getItem('token')) {
      getpost()
    }
  }, [isAuthenticated])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleLike = async (postId) => {
    try {
      await fetch(`${config.API_BASE_URL}/like-post/${postId}`, {
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

  if (!isAuthenticated) {
    return (
      <div className="home-container">
        <div className="search-section">
          <div className="search-container">
            <h1 className="search-title">Resource Sharing</h1>
            <p className="search-subtitle">Please login to view and share resources</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="home-container">
      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <h1 className="search-title">Discover Resources</h1>
          <p className="search-subtitle">Find the perfect study materials and resources</p>
          <input
            type="text"
            placeholder="Search posts by title, description, subject, or username..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
        </div>
      </div>

      {/* Posts Section */}
      <div className="posts-container">
        {loading ? (
          <div className="loading-posts">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3 className="empty-state-title">No posts found</h3>
            <p className="empty-state-message">
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to share a resource!'}
            </p>
          </div>
        ) : (
          <div className="posts-grid">
            {filteredPosts.map((item) => (
              <div className="post-card" key={item._id}>
                <div className="post-header">
                  <h3 className="post-title">{item.title}</h3>
                  <span className="post-subject">{item.subject}</span>
                </div>
                
                <div className="post-body">
                  <p className="post-description">{item.description}</p>
                  
                  <div className="post-meta">
                    <div className="post-author">
                      <div className="author-avatar">
                        {item.user.username.charAt(0).toUpperCase()}
                      </div>
                      <NavLink to={`/user/${item.user._id}`} className="author-name">
                        {item.user.username}
                      </NavLink>
                    </div>
                    
                    <div className="post-actions">
                      <button 
                        className={`like-button ${item.like.includes(user?.userid || '') ? 'liked' : ''}`}
                        onClick={() => handleLike(item._id)}
                      >
                        <span>❤️</span>
                        <span className="like-count">{item.like.length || 0}</span>
                      </button>
                      
                      <a 
                        href={`${config.API_BASE_URL}/images/${item.pdf}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="pdf-link"
                      >
                        <span className="pdf-icon">📄</span>
                        View PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
