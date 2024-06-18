import { useState } from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Posts from "./Posts";
import Todos from "./Todos";
import Albums from "./Albums";
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path='home' element={<Home />} />
            <Route path="posts" element={<Posts />} />
            <Route path="albums" element={<Albums />} />
            <Route path="todos" element={<Todos />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
