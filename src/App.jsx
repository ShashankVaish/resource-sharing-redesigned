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
function App() {
  
  
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Navbar/><Home/></>,

    },
    {
      path: "/login",
      element: <><Navbar/><Login/></>,

    },
    {
      path: "/userinfo",
      element: <><Navbar/><UserInfo/></>,

    },
    {
      
      path: "/signup",
      element: <><Navbar/><Signup/></>,

    },

  ]);
  
  


  return (
    <>
    <RouterProvider router={router} />
      
    </>
  )
}

export default App
