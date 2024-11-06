import React, { useEffect } from 'react'
import './Post.css'
import axios from 'axios'
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { set } from 'mongoose';
// import { splitVendorChunkPlugin } from 'vite';
const Post = () => {
    
    
    const [posts, setPosts] = useState([])
    const [postusername, setPostusername] = useState("")
    
    
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState,
        formState: { errors },
        setValue,
      } = useForm()
    
      const onSubmit = async (data) =>{ 
        console.log(data)
        const formdata = new FormData()
        formdata.append('title',data.title)
        formdata.append('description',data.description)
        formdata.append('subject',data.subject)
        formdata.append('file',data.pdf[0])
        let result=axios.post('http://localhost:3000/post-upload',formdata,{
            headers:{
                authorization:localStorage.getItem('token'),
                "Content-Type":"multipart/form-data"
              }

        })
        result.then((res)=>{
            console.log(res)
            loadposts()
        }).catch((err)=>{
            console.log(err)
        })
        
    
      }
      
      
      const editpost = async (post) => {
        try {
          const response = await fetch(`http://localhost:3000/edit-post/${post}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              authorization: localStorage.getItem('token'),
            },
          });
      
          if (response.ok) {
            const result = await response.json();
            console.log(result);

            
            
      
            
            setValue('title', result.title);
            setValue('description', result.description);
            setValue('subject', result.subject);
            setValue('pdf', result.pdf);
            // the delete post

            

            
            
          } else {
            console.log('Failed to edit post');
          }
        } catch (err) {
          console.log('An error occurred:', err);
        }
      };
      const handleEditDelete = async (p) => {
        try {
            // Edit post first (ensure it's an async function if needed)
            await editpost(p);
            
            // Then delete post
            await deletepost(p);
        } catch (error) {
            console.error("Error in edit or delete action:", error);
        }
    };
    
      const deletepost = async (postId) => {
        try {
          const response = await fetch(`http://localhost:3000/delete-post/${postId}`, {
            method: 'POST', // Change method to DELETE if that's what your backend expects
            headers: {
              'Content-Type': 'application/json',
              authorization: localStorage.getItem('token'),
            },
          });
      
          if (response.ok) {
            console.log('Post deleted successfully');
            loadposts();
          } else {
            console.log('Failed to delete post');
          }
        } catch (err) {
          console.log('An error occurred:', err);
        }
      };

     
      const loadposts = async ()=>{
        let result = await fetch('http://localhost:3000/user-post',{
            headers:{
                authorization:localStorage.getItem('token'),
                
              }

        })
        let data = await result.json()
        console.log(data.post)
        console.log(data.username)
        setPostusername(data.username)
        console.log(data.post.length)
        if(data.post.length>0){
            setPosts((data.post).reverse())
        }

      }
      useEffect(() => {
        if (formState.isSubmitSuccessful) {
          reset()
        }
      }, [formState])
    
      useEffect(() => {
        loadposts()
        
      },[])
      

  return (
    <>
    <div className="container">
        <h1>Create a New Post</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label >Title:</label>
                <input type="text" {...register("title")}  required/>
            </div>
            <div className="form-group">
                <label >Description:</label>
                <textarea {...register("description")}  rows="4" required></textarea>
            </div>
            <div className="form-group">
                <label >Subject:</label>
                <input type="text" {...register("subject")}  required/>
            </div>
            <div className="form-group">
                <label >Upload PDF:</label>
                <input type="file" {...register("pdf")}  accept="application/pdf" required/>
            </div>
            <button type="submit">Create Post</button>
        </form>
        <h1>Post Details</h1>
        <div className="container">
        
        {posts.map((item)=>{
            return(
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
                <a href={`http://localhost:3000/images/`+item.pdf} target="_blank" id="pdf-link">View PDF</a>
            </div>
            <div className="post-item">
                <strong>Username</strong>
                <p className="post-username">{postusername}</p>
            </div>
            <div className="post-item">
                <strong>Likes : {item.like.length}</strong>
                
            </div>
            <div className="delete-post">
                <button onClick={()=> deletepost(item._id)}>Delete</button>
            </div>
            <div>
                <button onClick={()=>{
                    
                    handleEditDelete(item._id);
                    
                }}>Edit</button>
            </div>
            <br />
            <hr />
        </div>
            )
        })}
    </div>
    </div>
    </>
  )
}

export default Post