import React, { useState } from 'react'
import './signup.css'
import { Navigate } from "react-router-dom";
import { set, useForm } from "react-hook-form"
const Signup = () => {
  const [user, setUser] = useState(false)
    
    const {
        register,
        handleSubmit,
        
        formState: { errors },
      } = useForm()
    
    const onSubmit = async (e) => {
      // e.preventDefault();
      // console.log(e)
        

      const response = await fetch('http://localhost:3000/register/', {
          method: 'POST',
          headers:{
            "content-type":"application/json"
          },
            
          body: JSON.stringify(e), // Data to send in the body
      });

      const data = await response.text();
      // console.log(e,data);
      // // console.log(data.user)
      
      // if(data){
      //   setUser(true)
      //   console.log(user)
      // }
      if(data){
        setUser(true)
      }
      
      
      
      
      
        
    }
  return (
    <>
    <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
        <label >Username:</label>
        <input type="text" {...register("username",{ required: true, maxLength: 15,minLength:3 })}  />

        <label >Name:</label>
        <input type="text" {...register("name",{ required: true, maxLength: 20,minLength:3 })} required />

        <label >Email:</label>
        <input type="email" {...register("email",{ required: true, maxLength: 150 })} required />

        <label >Password:</label>
        <input type="password" {...register("password",{required:true,maxLength:10,minLength:5})} required/>

        <button type="submit">Sign Up</button>
    </form>
    {/* {user && <div>{user.map((item)=>{
      return(
        <h1>item.username</h1>
      )
    })}</div>} */}
    {user && (
          <Navigate to="/login" replace={true} />
        )}
    
    </>
  )
}

export default Signup