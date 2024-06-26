import classes from './App.module.css';
import Layout from './Layout';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Comments = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const params = useParams();
  const [error, setError] = useState(null);
  const [chosenComment, setChosenComment] = useState('');
  const [body, setBody] = useState('');
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3001/comments?postId=${params.id}`);
        console.log('Fetching comments with URL:', `http://localhost:3001/comments?postId=${params.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const res = await response.json();
        console.log('Fetched comments:', res);

        if (Array.isArray(res)) {
          setComments(res); // Set the array of comments directly
        } else {
          setComments([res]); // Handle case where res is a single object
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Error fetching comments');
        alert('Error fetching comments');
      }
    };

    fetchComments();
  }, [params.id, navigate]);

  const Update = (comment) => {
    document.getElementById("Updateform").style.display = "block";
    setChosenComment(comment);
  };

  const handleUpdateComment = async(event) => {
    event.preventDefault();
    await fetch(`http://localhost:3001/comments/${chosenComment.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: chosenComment.id,
        name: chosenComment.name,
        email: chosenComment.email,
        body: body,
        postId: chosenComment.postId,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    const response = await fetch(`http://localhost:3001/comments?postId=${params.id}`);
    const res = await response.json();
    if (Array.isArray(res)) {
      setComments(res); // Set the array of comments directly
    } else {
      setComments([res]); // Handle case where res is a single object
    }

    exit();
    setBody('');
    setChosenComment('');
  }

  const Delete = async (id) => {    
    await fetch(`http://localhost:3001/comments/${id}`, {
      method: 'DELETE'
    });

    setComments(comments.filter(comment => comment.id !== id));
  };

  return (
    <>
      <Layout />
      <div className={classes.containerC} id="container">
        <form className={classes.addcommentform} id="Updateform" onSubmit={handleUpdateComment}>
          <span className={classes.exit} onClick={() => exit()}></span>
          <h2>Update Comment</h2>
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
          comments.map(comment => (
            <div key={comment.id} className={classes.post}>
              <h1>{comment.id + '.'}</h1>
              <h2>{comment.name}</h2>
              <h3>{comment.email}</h3>
              <p>{comment.body}</p>
              <button className={classes.btnPostU} onClick={() => Update(comment)}>Update</button>
              <button className={classes.btnPostD} onClick={() => Delete(comment.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

const exit = () => {
  document.getElementById("Updateform").style.display = "none";
}

export default Comments;