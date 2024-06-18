import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './App.css'
import App from "./App";
export default function Login() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Form />}>
            <Route path='App' element={<App />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  );
}
function Form() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    navigate('/App');
    // try {
    //   await authenticate(username, password); // Assuming you have the authenticate function
    //   navigate('ome');

    //   } catch {
    //      setError('Invalid username or password');
    //    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
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
      </form>

    </>
  )
}