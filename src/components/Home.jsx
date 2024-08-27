import React, { useEffect, useState } from 'react'
import './Home.css'

const Home = () => {
  const [user, setUser] = useState(false)
  const [allpost, setAllpost] = useState([])
  const getpost=async ()=>{
    let result = await fetch('http://localhost:3000/all-post',{
      headers:{
        authorization:localStorage.getItem('token')
      }
    })
    let data = await result.json()
    if(data){
      console.log(data.post)
      setUser(true)
      setAllpost((data.post).reverse())
    }
    
    
  }
  useEffect(() => {
    if(localStorage.getItem('token')){
      getpost()
    }

   
  }, [])
  
  return (
    <>
    {user && <>
    <div className="container">
      {allpost.map((item)=>{
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
            <br />
            <hr />
        </div>
            )
        })}
        </div>
    </>
    }

    
  

    </>
  )
}

export default Home