import classes from './App.module.css';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate, Link } from 'react-router-dom';
import Layout from './Layout';
const PostsIndex = () => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [postIdTitle, setPostIdTitle] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [chosenPost, setChosenPost] = useState('');
  const [commentTitle, setCommentTitle] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const navigate = useNavigate();
  const [Postcount, setCount] = useState(101);
  const [Commentcount, setCommentCount] = useState(501);
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
  };

  const Update = (id) => {
    document.getElementById("Updateform").style.display = "block";
    setChosenPost(id);
  };

  const Delete = async(id) => {
    await fetch(`http://localhost:3001/posts/${id}`, {
      method: 'DELETE'
    });

    setPosts(posts.filter(post => post.id !== id));
  };

  const Comments = (id) => {
    navigate(id + '/comments')
  };
  const AddComment = (id) => {
    document.getElementById("addformC").style.display = "block";
    setChosenPost(id);
  };
  const handleAddcomment = async (event) => {
    event.preventDefault();
    setCommentCount(Commentcount + 1);
    const newComment = {
      postId: chosenPost,
      id: Commentcount,
      email: user.email,
      name: commentTitle,
      body: commentBody
    };
    const response = await fetch('http://localhost:3001/comments', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(newComment),
    });
    if (!response.ok) {
      setError('Failed to add comment');
    } else {
      setCommentTitle('');
      setCommentBody('');
      setChosenPost('');
      exit("addformC");
    }
  }
  const handleUpdatecomment= async(event)=>{
    event.preventDefault();
    await fetch(`http://localhost:3001/posts/${chosenPost.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: chosenPost.id,
        title:chosenPost.title,
        body: body,
        userId:chosenPost.userId,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },})

    setPosts(await fetchUserPosts(user.Id));
    exit("Updateform");
    setBody('');
  }
  return (
    <>
     <Layout />
     <div className={classes.userPost} id="post">
        <span className={classes.exit} onClick={() => exit("post")}></span>
        <h1>Post</h1>
        <div className={classes.infoDisplay} id="largePost"></div>
      </div>
     <form className={classes.addcommentform} id="addformC" onSubmit={handleAddcomment}>
          <span className={classes.exit} onClick={() => exit("addformC")}></span>
          <h2>New Comment</h2>
          <label>
            Name:
            <input
              type="text"
              value={commentTitle}
              onChange={(e) => setCommentTitle(e.target.value)}
            />
          </label>
          <label>
            Body:
            <input
              type="text"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
            />
          </label>
          {error && <p>{error}</p>}
          <input type="submit" value="Submit" />
        </form>
        <form className={classes.addcommentform} id="Updateform" onSubmit={handleUpdatecomment}>
        <span className={classes.exit} onClick={() => exit("Updateform")}></span>
        <h2>Update Post</h2>
            <label>
            Body:
            <input
              type="text"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </label>
          {error && <p>{error}</p>}
          <input type="submit" value="Submit" />
        </form>
      {post && (
        <div key={post.id} className={classes.postI}>
          <h1>{post.id + '.'}</h1>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
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
const exit = (id) => {
  document.getElementById(id).style.display = "none";
}
export default PostsIndex;