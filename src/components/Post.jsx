import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Post.css';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/context.jsx';
import { Navigate } from 'react-router-dom';
import config from '../config/config.js';
const Post = () => {
    const { isAuthenticated } = useAuth();
    const [posts, setPosts] = useState([]);
    const [postUsername, setPostUsername] = useState('');
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('subject', data.subject);
            formData.append('file', data.pdf[0]);

            const result = await axios.post(`${config.API_BASE_URL}/post-upload`, formData, {
                headers: {
                    authorization: localStorage.getItem('token'),
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(result);
            loadPosts();
            reset();
        } catch (err) {
            console.log(err);
        }
    };

    const deletePost = async (postId) => {
        try {
            await fetch(`${config.API_BASE_URL}/delete-post/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: localStorage.getItem('token'),
                },
            });

            loadPosts();
        } catch (err) {
            console.log('The error occurred', err);
        }
    };

    const loadPosts = async () => {
        setLoading(true);
        try {
            const result = await fetch(`${config.API_BASE_URL}/user-post`, {
                headers: {
                    authorization: localStorage.getItem('token'),
                },
            });

            const data = await result.json();
            console.log(data.post);
            console.log(data.username);

            setPostUsername(data.username);
            setPosts(data.post.length > 0 ? data.post.reverse() : []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPdf = (fileUrl) => {
        setSelectedPdf(fileUrl);
    };

    useEffect(() => {
        if (formState.isSubmitSuccessful) {
            reset();
        }
    }, [formState, reset]);

    useEffect(() => {
        if (isAuthenticated) {
            loadPosts();
        }
    }, [isAuthenticated]);

    // Redirect if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace={true} />;
    }

    return (
        <div className="post-container">
            {/* Header Section */}
            <div className="post-header-section">
                <div className="post-header-content">
                    <h1 className="post-header-title">Create & Manage Posts</h1>
                    <p className="post-header-subtitle">Share your knowledge and resources with the community</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="form-section">
                <div className="form-card">
                    <h2 className="form-title">Create a New Post</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input 
                                    type="text" 
                                    className="form-input"
                                    {...register('title', { required: 'Title is required' })} 
                                    placeholder="Enter post title"
                                />
                                {errors.title && <span className="error-message">{errors.title.message}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Subject</label>
                                <input 
                                    type="text" 
                                    className="form-input"
                                    {...register('subject', { required: 'Subject is required' })} 
                                    placeholder="Enter subject (e.g., Mathematics, Science)"
                                />
                                {errors.subject && <span className="error-message">{errors.subject.message}</span>}
                            </div>
                            
                            <div className="form-group full-width">
                                <label className="form-label">Description</label>
                                <textarea 
                                    className="form-textarea"
                                    {...register('description', { required: 'Description is required' })} 
                                    rows="4" 
                                    placeholder="Describe your resource in detail..."
                                />
                                {errors.description && <span className="error-message">{errors.description.message}</span>}
                            </div>
                            
                            <div className="form-group full-width">
                                <label className="form-label">Upload PDF</label>
                                <input 
                                    type="file" 
                                    className="form-file"
                                    {...register('pdf', { required: 'PDF file is required' })} 
                                    accept="application/pdf" 
                                />
                                {errors.pdf && <span className="error-message">{errors.pdf.message}</span>}
                            </div>
                        </div>
                        
                        <button type="submit" className="submit-button">
                            Create Post
                        </button>
                    </form>
                </div>
            </div>
            
            {/* Posts Display Section */}
            <div className="posts-display-section">
                <div className="posts-display-header">
                    <h2 className="posts-display-title">Your Posts</h2>
                    <p className="posts-display-subtitle">Manage and view all your shared resources</p>
                </div>
                
                {loading ? (
                    <div className="loading-posts">
                        <div className="loading-spinner"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="empty-posts">
                        <div className="empty-posts-icon">📚</div>
                        <h3 className="empty-posts-title">No posts yet</h3>
                        <p className="empty-posts-message">Create your first post to get started!</p>
                    </div>
                ) : (
                    <div className="posts-grid">
                        {posts.map((item) => (
                            <div className="post-display-card" key={item._id}>
                                <div className="post-display-header">
                                    <h3 className="post-display-title">{item.title}</h3>
                                    <span className="post-display-subject">{item.subject}</span>
                                </div>
                                
                                <div className="post-display-body">
                                    <p className="post-display-description">{item.description}</p>
                                    
                                    <div className="post-display-meta">
                                        <div className="post-display-author">
                                            <div className="post-display-author-avatar">
                                                {postUsername.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="post-display-author-name">{postUsername}</span>
                                        </div>
                                        
                                        <div className="post-display-stats">
                                            <div className="post-display-likes">
                                                <span>❤️</span>
                                                <span>{item.like.length || 0} likes</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="post-display-actions">
                                        <button 
                                            className="view-pdf-button"
                                            onClick={() => handleOpenPdf(`${config.API_BASE_URL}/images/${item.pdf}`)}
                                        >
                                            <span>📄</span>
                                            View PDF
                                        </button>
                                        
                                        <button 
                                            className="delete-button"
                                            onClick={() => deletePost(item._id)}
                                        >
                                            <span>🗑️</span>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* PDF Viewer Modal */}
            {selectedPdf && (
                <div className="pdf-viewer-section">
                    <div className="pdf-viewer-content">
                        <div className="pdf-viewer-header">
                            <h3 className="pdf-viewer-title">PDF Viewer</h3>
                            <button 
                                className="close-pdf-button"
                                onClick={() => setSelectedPdf(null)}
                            >
                                Close
                            </button>
                        </div>
                        <iframe
                            src={selectedPdf}
                            className="pdf-viewer-iframe"
                            title="PDF Viewer"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;