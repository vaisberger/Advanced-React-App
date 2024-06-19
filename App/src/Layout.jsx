import { Outlet, Link } from "react-router-dom";
import classes from './App.module.css'
const Layout = () => {
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
      <Outlet />
 
    </>
  )
};

const logout=()=>{

}
const info=()=>{
    
}
export default Layout;