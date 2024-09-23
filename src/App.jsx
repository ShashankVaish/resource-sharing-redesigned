import { useState } from 'react'

import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import UserInfo from './components/UserInfo';
import Post from './components/Post';
import Usercard from './components/Usercard'
import Footer from './components/Footer';
function App() {
  
  
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Navbar/><Home/><Footer/></>,

    },
    {
      path: "/post",
      element: <><Navbar/><Post/><Footer/></>,

    },
    {
      path: "/login",
      element: <><Navbar/><Login/><Footer/></>,

    },
    {
      path: "/userinfo",
      element: <><Navbar/><UserInfo/><Footer/></>,

    },
    {
      
      path: "/signup",
      element: <><Navbar/><Signup/><Footer/></>,

    },
    {
      
      path: "/user/:id",
      element:<> <Navbar/><Usercard/><Footer/></>,
      

    },

  ]);
  
  


  return (
    <>
    <RouterProvider router={router} />
      
    </>
  )
}

export default App
