import classes from './App.module.css';
import Layout from './Layout';
import React, { useState,useEffect } from 'react';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [user,setUser]=useState(JSON.parse(localStorage.getItem('user')))
  useEffect(() => {
    const userId = user.id;
    const getPosts = async () => {
      try {
        const userPosts = await fetchUserPosts(userId);
        setPosts(userPosts);
      } catch (error) {
        setError(error.message);
      }
    };
    getPosts();
  }, [user.id]);
    return (<>
    <Layout/>
    <div className={classes.container}>
        {error ? (
          <p>Error: {error}</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className={classes.post} onClick={showPost(post.id)}>
              <h1>{post.id+'.'}</h1>
              <h2>{post.title}</h2>
            </div>
          ))
        )}
      </div>
    </>)
  };
  
  export default Posts;

  const fetchUserPosts = async (userId) => {
    const response = await fetch(`http://localhost:3000/posts?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user posts');
    }
    const posts = await response.json();
    return posts;
  };
  const showPost=(id)=>{
    
  }