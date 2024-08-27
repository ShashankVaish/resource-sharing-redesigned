import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useForm } from "react-hook-form"
import axios from 'axios'
import './userinfo.css'
const UserInfo = () => {
    const {
        register,
        handleSubmit,
        
        formState: { errors },
      } = useForm()
    const [username, setUsername] = useState('')
    const [image, setImage] = useState('')
    const [count, setCount] = useState(0)
    const handlelogout = ()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('loggenduser')
        

    }
    const imageload = async ()=>{
      
      let result = await fetch('http://localhost:3000/getimage',{
        headers:{
          authorization:localStorage.getItem('token')
        }
      })
      let data = await result.text()
      setImage(data)
      console.log(data)
    }
    useEffect(() => {
        setUsername(localStorage.getItem('loggenduser'))
        imageload()

    })
    
    
   
        const onSubmit = async (data) => {
          console.log(data.picture[0])
          const formdata = new FormData()
          formdata.append('file',data.picture[0])
          formdata.append('token',localStorage.getItem('token'))

          axios.post('http://localhost:3000/uploads',formdata)
          .then(res=> console.log(res))
          .catch(err=> console.log(err))
          imageload()
            
    }
    
    
    
  return (
    <>
    <div>
        {username?<div><h2>hello user {username}
            </h2>
            {/* <!-- Display user profile picture --> */}
            <img src={`http://localhost:3000/images/`+image}  className="profile-picture" />
            {/* <button id="edit-profile">Edit Profile</button> */}
            {/* <!-- Edit Profile Form --> */}
            <form  onSubmit={handleSubmit(onSubmit)}  >
                <input type="file" {...register('picture')}  accept=".jpeg , .jpg ,.png" />
                <button type="submit" onClick={()=>setCount((count)=>count+1)}>Upload</button>
            </form>
            <button onClick={handlelogout}><NavLink to='/'>Logout</NavLink></button>
            </div>:<h1>You must be loggend</h1>}
    </div>
    </>
  )
}

export default UserInfo