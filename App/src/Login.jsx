import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

function Login() {
  return <Form />;
}

async function authenticate(username, password) {
  console.log('Authenticating', username, password); // Debugging log
  const response = await fetch('http://localhost:3001/user');
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  const users = await response.json();
  console.log('Fetched users:', users); // Debugging log
  const user = users.find(u => u.username === username && u.website === password);
  if (user) {
    return user;
  } else {
    throw new Error('Invalid username or password');
  }
}

function Form() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await authenticate(username, password);
      console.log('User authenticated:', user); // Debugging log
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/home');
    } catch (e) {
      console.error('Error:', e); // Debugging log
      setError(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && <p>{error}</p>}
      <input type="submit" value="Submit" />
      <p>Don't have an account? <Link to="/register">Click here to register</Link></p>
    </form>
  );
}

export default Login;
