import classes from './App.module.css';
import Layout from './Layout';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Posts = () => {
  const [posts, setPosts] = useState([]);
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

  const Update =(id) => {
    document.getElementById("Updateform").style.display = "block";
    setChosenPost(id);
  }

  const Delete = async (id) => {
    await fetch(`http://localhost:3001/posts/${id}`, {
      method: 'DELETE'
    });

    setPosts(posts.filter(post => post.id !== id));
  }

  const Comments = (id) => {
    navigate(id + '/comments')
  }

  const addPost = () => {
    document.getElementById('addform').style.display = "block";
  }

  const AddComment = (id) => {
    document.getElementById("addformC").style.display = "block";
    setChosenPost(id);
  }

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

  const handleInputChange = (event) => {
    setPostIdTitle(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCount(Postcount + 1);
    const newPost = {
      userId: user.id,
      id: Postcount,
      title: title,
      body: body,
    };

    const response = await fetch('http://localhost:3001/posts', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(newPost),
    });

    const addedPost = await response.json();
    setPosts([...posts, addedPost]);
    setTitle('');
    setBody('');
    exit("addform");
  };

  const handleSearch = () => {
    navigate(postIdTitle);
  }

  const exitPost = () => {
    document.getElementById('post').style.display = "none";
    document.getElementById("container").style.filter = "blur(0px)";
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

  return (
    <>
      <Layout />
      <div className={classes.postMenu}>
        <button className={classes.btnPostA} onClick={addPost}>Add Post</button>

        <form className={classes.addpostform} id="addform" onSubmit={handleSubmit}>
          <span className={classes.exit} onClick={() => exit("addform")}></span>
          <h2>New Post</h2>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
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

        <input
          type="id"
          value={postIdTitle}
          onChange={handleInputChange}
          placeholder="Enter post ID/Title"
          className={classes.inputid}
        />
        <button onClick={handleSearch} className={classes.btn}>Search</button>
      </div>

      <div className={classes.userPost} id="post">
        <span className={classes.exit} onClick={() => exit("post")}></span>
        <h1>Post</h1>
        <div className={classes.infoDisplay} id="largePost"></div>
      </div>

      <div className={classes.container} id="container">
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
        {error ? (
          <p>Error: {error}</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className={classes.post}>
              <h1>{post.id + '.'}</h1>
              <h2>{post.title}</h2>
              <button className={classes.btnPostS} onClick={() => showPost(post.id)}>Show</button>
              <button className={classes.btnPostU} onClick={() => Update(post)}>Update</button>
              <button className={classes.btnPostD} onClick={() => Delete(post.id)}>Delete</button>
              <button className={classes.btnPostC} onClick={() => Comments(post.id)}>Comments</button>
              <button className={classes.btnPostA} onClick={() => AddComment(post.id)}>AddComment</button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Posts;


const fetchUserPosts = async (userId) => {
  const response = await fetch(`http://localhost:3001/posts?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user posts');
  }
  const posts = await response.json();
  return posts;
};
const exit = (id) => {
  document.getElementById(id).style.display = "none";
}

