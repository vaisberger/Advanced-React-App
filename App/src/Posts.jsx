import classes from './App.module.css';
import Layout from './Layout';
import React, { useState,useEffect } from 'react';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [user,setUser]=useState(JSON.parse(localStorage.getItem('user')));

  const showPost=(post)=>{
    document.getElementById("post").style.display="block";
    document.getElementById("container").style.filter="blur(3px)";
    document.getElementById("largePost").innerHTML="";
    var node=document.createElement('h2');
    node.innerHTML=post;
    document.getElementById("largePost").appendChild(node);
    node=document.createElement('h2');
    node.innerHTML=posts[post-1].title;
    document.getElementById("largePost").appendChild(node);
    node=document.createElement('p');
    node.innerHTML=posts[post-1].body;
    document.getElementById("largePost").appendChild(node);
  }
  const exitPost=()=>{
    document.getElementById('post').style.display = "none";
    document.getElementById("container").style.filter="blur(0px)";
  }
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
    <div className={classes.userPost} id="post">
      <span className={classes.exit} onClick={exitPost}></span>
        <h1>Post</h1>
          <div className={classes.infoDisplay} id="largePost">
          </div>
    </div>
    <div className={classes.container} id="container">
        {error ? (
          <p>Error: {error}</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className={classes.post}>
              <h1>{post.id+'.'}</h1>
              <h2>{post.title}</h2>
              <button className={classes.btnPost} onClick={() =>showPost(post.id)}>Show</button>
              <button className={classes.btnPost} onClick={() =>showPost(post.id)}>Update</button>
              <button className={classes.btnPost} onClick={() =>showPost(post.id)}>Delete</button>
              <button className={classes.btnPost} onClick={() =>showPost(post.id)}>Comments</button>
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

