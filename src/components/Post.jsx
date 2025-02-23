import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Post.css';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const Post = () => {
    const [posts, setPosts] = useState([]);
    const [postUsername, setPostUsername] = useState('');
    const [selectedPdf, setSelectedPdf] = useState(null); // State to track the selected PDF

    const { register, handleSubmit, reset, formState, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('subject', data.subject);
            formData.append('file', data.pdf[0]);

            const result = await axios.post('http://localhost:3000/post-upload', formData, {
                headers: {
                    authorization: localStorage.getItem('token'),
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(result);
            loadPosts();
        } catch (err) {
            console.log(err);
        }
    };

    const deletePost = async (postId) => {
        try {
            await fetch(`http://localhost:3000/delete-post/${postId}`, {
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
        try {
            const result = await fetch('http://localhost:3000/user-post', {
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
        }
    };

    const handleOpenPdf = (fileUrl) => {
        setSelectedPdf(fileUrl); // Set the selected PDF URL to display in the iframe
    };

    useEffect(() => {
        if (formState.isSubmitSuccessful) {
            reset();
        }
    }, [formState, reset]);

    useEffect(() => {
        loadPosts();
    }, []);

    return (
        <div className="container">
            <h1>Create a New Post</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Title:</label>
                    <input type="text" {...register('title')} required />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea {...register('description')} rows="4" required></textarea>
                </div>
                <div className="form-group">
                    <label>Subject:</label>
                    <input type="text" {...register('subject')} required />
                </div>
                <div className="form-group">
                    <label>Upload PDF:</label>
                    <input type="file" {...register('pdf')} accept="application/pdf" required />
                </div>
                <button type="submit">Create Post</button>
            </form>
            
            <h1>Post Details</h1>
            <div className="container">
                {posts.map((item) => (
                    <div className="post-details" key={item._id}>
                        <div className="post-item">
                            <strong>Title:</strong>
                            <span>{item.title}</span>
                        </div>
                        <div className="post-item">
                            <strong>Description:</strong>
                            <p>{item.description}</p>
                        </div>
                        <div className="post-item">
                            <strong>Subject:</strong>
                            <span>{item.subject}</span>
                        </div>
                        <div className="post-item">
                            <strong>PDF Document:</strong>
                            <button onClick={() => handleOpenPdf(`http://localhost:3000/images/${item.pdf}`)}>View PDF</button>
                        </div>
                        <div className="post-item">
                            <strong>Username:</strong>
                            <p>{postUsername}</p>
                        </div>
                        <div className="post-item">
                            <strong>Likes: {item.like.length}</strong>
                        </div>
                        <div className="delete-post">
                            <button onClick={() => deletePost(item._id)}>Delete</button>
                        </div>
                        <hr />
                    </div>
                ))}
            </div>

            {/* PDF Viewer Section */}
            {selectedPdf && (
                <div className="pdf-viewer">
                    <h2>PDF Viewer</h2>
                    <iframe
                        src={selectedPdf}
                        width="100%"
                        height="600px"
                        style={{ border: 'none' }}
                        title="PDF Viewer"
                    ></iframe>
                    <button onClick={() => setSelectedPdf(null)}>Close PDF Viewer</button>
                </div>
            )}
        </div>
    );
};
export default Post;