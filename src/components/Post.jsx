import React from 'react'
import './Post.css'
import axios from 'axios'
import { useForm } from "react-hook-form"
const Post = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
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
        console.log(result)
    
      }

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
    </div>
    </>
  )
}

export default Post