import { Outlet, Link } from "react-router-dom";
import React, { useState } from 'react';
import classes from './App.module.css';
import { useNavigate } from 'react-router-dom';
const Layout = () => {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();
  const logout=()=>{
    navigate('/login');
    localStorage.removeItem("user");
  
  }
  return (
    <>
      <nav className={classes.navbar}>
        <ul className={classes.navLnk}>
          <li className={classes.liLnk}>
            <Link to="/home" className={classes.lnk}>Home</Link>
          </li>
          <li className={classes.liLnk}>
            <Link to="/posts" className={classes.lnk}>Posts</Link>
          </li>
          <li className={classes.liLnk}>
            <Link to="/albums"className={classes.lnk} >Albums</Link>
          </li>
          <li className={classes.liLnk}>
            <Link to="/todos" className={classes.lnk}>Todos</Link>
          </li>
          <li>
            <button className={classes.btn} onClick={info}>Info  <img src="logout.png" className={classes.logout}></img></button>
          </li>
          <li>
            <button className={classes.btn} onClick={logout}>Logout  <img src="info.png" className={classes.info}></img></button>
          </li>
        </ul>
      </nav>
      <div className={classes.userInfo} id="information">
      <span className={classes.exit} onClick={exitinfo}></span>
        <h1>My Info</h1>
        <div className={classes.infoDisplay}>
            <p><strong>ID:</strong> {userData.id}</p>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone:</strong> {userData.phone}</p>
            <p><strong>Website:</strong> {userData.website}</p>
            <p><strong>Address:</strong></p>
            <p>{userData.address.street}, {userData.address.suite}, {userData.address.city}, {userData.address.zipcode}</p>
            <p><strong>Company:</strong></p>
            <p>{userData.company.name} - {userData.company.catchPhrase}</p>
          </div>
      </div>
      <Outlet />
 
    </>
  )
};


const info=()=>{
  document.getElementById('information').style.visibility = "visible";
}
const exitinfo=()=>{
  document.getElementById('information').style.visibility = "hidden";
}
export default Layout;