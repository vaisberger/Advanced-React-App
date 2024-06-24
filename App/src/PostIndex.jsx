import classes from './App.module.css';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"
const PostsIndex = () => {
    const [post, setPost] = useState(()=>{});
    const params = useParams();
    useEffect(() => {
        const fetchPost = async () => {
          try {
            const response = await fetch(`http://localhost:3000/posts/${params.id}`);
            const res = await response.json();
            setPost(res);
          } catch (error) {
            console.error("Error fetching post:", error);
          }
        };
    
        fetchPost();
      }, [params.id]);
      return (
        <>
          {post && (
            <div key={post.id} className={classes.postI}>
              <h1>{post.id + '.'}</h1>
              <h2>{post.title}</h2>
              <button className={classes.btnPost} onClick={() => showPost(post.id)}>Show</button>
              <button className={classes.btnPost} onClick={() => Update(post.id)}>Update</button>
              <button className={classes.btnPost} onClick={() => Delete(post.id)}>Delete</button>
              <button className={classes.btnPost} onClick={() => Comments(post.id)}>Comments</button>
            </div>
          )}
        </>
      );
}
export default PostsIndex;