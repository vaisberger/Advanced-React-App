import React from 'react';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
    </div>
  );
};

export default Home;
