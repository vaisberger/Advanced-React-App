import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout'
import Posts from './Posts';
import Todos from './Todos';
import Albums from './Albums';
import classes from './App.module.css';
const Home = () => {
  return (
   <Layout/>
  );
};

export default Home;
