import classes from './App.module.css';
import Layout from './Layout';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [selectedPost, setSelectedPost] = useState(null); // State for the selected post
  const [postId, setPostId] = useState('');
  const navigate = useNavigate();
  const showPost = (id) => {
    document.getElementById("post").style.display = "block";
    document.getElementById("container").style.filter = "blur(3px)";
    document.getElementById("largePost").innerHTML = "";
    var node = document.createElement('h2');
    node.innerHTML = id;
    document.getElementById("largePost").appendChild(node);
    node = document.createElement('h2');
    node.innerHTML = posts[id - 1].title;
    document.getElementById("largePost").appendChild(node);
    node = document.createElement('p');
    node.innerHTML = posts[id - 1].body;
    document.getElementById("largePost").appendChild(node);
  }
  const Update = (id) => {
  }
  const Delete = (id) => {
  }
  const Comments = (id) => {
  }
  const handleInputChange = (event) => {
    setPostId(event.target.value);
  }
  const handleSearch = () => {
    navigate(postId);
  }
  const exitPost = () => {
    document.getElementById('post').style.display = "none";
    document.getElementById("container").style.filter = "blur(0px)";
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
    <Layout />
    <div className={classes.postMenu}>
      <button className={classes.btnPost} onClick={() => showPost(post.id)}>Add Post</button>
      <input
        type="id"
        value={postId}
        onChange={handleInputChange}
        placeholder="Enter post ID/Title"
        className={classes.inputid}
      />
      <button onClick={handleSearch} className={classes.btn}>Search</button>
    </div>
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
            <h1>{post.id + '.'}</h1>
            <h2>{post.title}</h2>
            <button className={classes.btnPost} onClick={() => showPost(post.id)}>Show</button>
            <button className={classes.btnPost} onClick={() => Update(post.id)}>Update</button>
            <button className={classes.btnPost} onClick={() => Delete(post.id)}>Delete</button>
            <button className={classes.btnPost} onClick={() => Comments(post.id)}>Comments</button>
          </div>
        ))

      )}
    </div>
  </>
  );
}

export default Posts;


const fetchUserPosts = async (userId) => {
  const response = await fetch(`http://localhost:3000/posts?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user posts');
  }
  const posts = await response.json();
  return posts;
};

