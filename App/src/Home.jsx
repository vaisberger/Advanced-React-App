import React, { useState } from 'react';
import Layout from './Layout';
import classes from './App.module.css';

const Home = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  return (
    <> <Layout />
      <div className={classes['home-container']}>
        <h1 className={classes['home-title']}>Welcome to the Home Page</h1>
        <h2 className={classes['home-welcome']}>Hello, {user.username}!</h2>
        <p className={classes['home-content']}>
          This is your personalized home page. Here you can navigate to different sections of the application and manage your content.
        </p>
      </div>
    </>


  );
};

export default Home;
