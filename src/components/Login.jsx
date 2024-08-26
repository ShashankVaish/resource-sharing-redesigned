import React, { useState } from 'react'
import './login.css'


import { useForm } from "react-hook-form"
import { Navigate } from "react-router-dom";
const Login = () => {
 
  const [userdetail, setUserdetail] = useState(false)
  const [user, setUser] = useState({})
  const {
    register,
    handleSubmit,
    
    formState: { errors },
  } = useForm()

  const onSubmit = async (e) =>{
    const response = await fetch('http://localhost:3000/login/', {
      method: 'POST',
      headers:{
        "content-type":"application/json"
      },
        
      body: JSON.stringify(e), // Data to send in the body
  });

  const data = await response.json();
  if(data===""){
    setUserdetail(false)

  }
  else{
    
    const { succes ,jwttoken , isloggendUser } = data
    if(succes){
      await localStorage.setItem('token',jwttoken)
      await localStorage.setItem('loggenduser',isloggendUser)
      setTimeout(()=>{
        setUserdetail(true)
        
      },1000)

    }
    

  }

  }
  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="imgcontainer">
            <img src="img_avatar2.png" alt="Avatar" className="avatar"/>
        </div>
        <div className="container">
            <label for="uname"><b>email</b></label>
            <input type="email" placeholder="Enter email"  {...register("email")} />
            <label for="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" {...register("password")} />
            <button type="submit">Login</button>
            <label>
                <input type="checkbox" checked="checked" name="remember"/> Remember me
            </label>
        </div>
        <div className="container" >
            {/* <button type="button" className="cancelbtn">Cancel</button> */}
            <span className="psw">Forgot <a href="#">password?</a></span>
        </div>
    </form>
    {userdetail && (
          <Navigate to="/" replace={true} user={user} />
        )}
    </>
  )
}

export default Login