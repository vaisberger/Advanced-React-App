import classes from './App.module.css';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate, Link } from 'react-router-dom';
import Layout from './Layout';
const PostsIndex = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        let response;
        if (isNaN(params.id)) {
          response = await fetch(`http://localhost:3001/posts?title=${params.id}`);
        } else {
          response = await fetch(`http://localhost:3001/posts/${params.id}`);
        }
        const res = await response.json();

        if (Array.isArray(res)) {
          setPost(res[0]); // Assuming you want the first post if multiple are returned
        } else {
          setPost(res);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        navigate('/posts');
        alert('Error fetching post');
      }
    };

    fetchPost();
  }, [params.id, navigate]);

  const showPost = (id) => {
    // Your show post logic
  };

  const Update = (id) => {
    // Your update post logic
  };

  const Delete = (id) => {
    // Your delete post logic
  };

  const Comments = (id) => {
    // Your comments logic
  };
  const AddComment = (id) => {
  };
  return (
    <>
     <Layout />
      {post && (
        <div key={post.id} className={classes.postI}>
          <h1>{post.id + '.'}</h1>
          <h2>{post.title}</h2>
          <button className={classes.btnPostS} onClick={() => showPost(post.id)}>Show</button>
            <button className={classes.btnPostU} onClick={() => Update(post.id)}>Update</button>
            <button className={classes.btnPostD} onClick={() => Delete(post.id)}>Delete</button>
            <button className={classes.btnPostC} onClick={() => Comments(post.id)}>Comments</button>
            <button className={classes.btnPostA} onClick={() => AddComment(post.id)}>AddComment</button>
        </div>
      )}
    </>
  );
};

export default PostsIndex;