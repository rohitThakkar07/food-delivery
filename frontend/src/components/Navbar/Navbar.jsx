import React from 'react'
import './navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
const Navbar = ({setShowLogin}) => {

  const {getTotalCartAmount,token,setToken}=React.useContext(StoreContext)
  
  const navigate = useNavigate();
  const logout = ()=>{
    localStorage.removeItem("token");
    setToken("");
    navigate('/');
  }
  return (
    <div className='navbar'>
        <img src={assets.logo} alt="" className="logo" />
        <ul className="navbar-menu">
            <li><Link to="/">home</Link></li>
            <li><a href="#explore-menu">menu</a></li>
            <li><a href="#app-download">mobile-app</a></li>
            <li><a href="#footer">contact us</a></li>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt="" />
            <div className="navbar-search-icon">
              <Link to="/cart"> <img src={assets.basket_icon} alt="" /></Link>
                
                <div className={getTotalCartAmount() === 0 ?"" :"dot"}></div>
                
                {!token?<button onClick={()=>setShowLogin(true)}>sign in</button>
                  :<div className='navbar-profile'>
                    <img src={assets.profile_icon} alt="" />
                    <ul className="nav-profile-drowpdon">
                      <li onClick={()=>navigate("/myorders")}><img src={assets.bag_icon} alt="" />Orders</li>
                      <hr/>

                      <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
                    </ul>
                  </div>  
              }
                
            </div>
        </div>
    </div>
  )
}

export default Navbar