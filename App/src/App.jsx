import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Posts from './Posts';
import PostsIndex from './PostIndex';
import Todos from './Todos';
import Albums from './Albums';
import Login from './Login';
import CompleteProfile from './CompleteProfile';
import Layout from './Layout';
import './App.css';
import Register from './register';
import Comments from './Comments';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id/comments" element={<Comments/>}/>
          <Route path="/posts/:id" element={<PostsIndex/>}/>
          <Route path="/posts?" element={<PostsIndex/>}/>
          <Route path="/albums" element={<Albums />} />
          <Route path="/todos" element={<Todos />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
