import React from 'react';
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import Home from './Home';
import Posts from './Posts';
import Todos from './Todos';
import Albums from './Albums';
import Login from './Login';
import './App.module.css';
function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/todos" element={<Todos />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;
