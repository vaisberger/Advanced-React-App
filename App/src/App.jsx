import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Posts from './Posts';
import Todos from './Todos';
import Albums from './Albums';
import Login from './Login';
import Register from './register';
import CompleteProfile from './CompleteProfile';
import Layout from './Layout';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        {
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/todos" element={<Todos />} />
          </Route>
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
