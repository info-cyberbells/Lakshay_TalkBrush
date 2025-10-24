import React from "react";
import "./HeaderBar.css";
import { FaHome, FaBell, FaUserCircle, FaCog, FaSearch } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { usePageTitle } from "../../hooks/usePageTitle";

const Header = () => {

  const {title} = usePageTitle();
    

  return (
    <header className="header">
      <div className="header-left">
        <ul className="header-menu">
          <li className="menu-item"> <img src="/headers/window.png" alt="" /> </li>
          <li className="menu-item"> <img src="/headers/fav.png" alt="" /> </li>
          <li className="menu-item "> <span className="menu-text">TalkBrush</span></li>
          <li className="menu-item"> <span className="menu-text">/</span></li>

          <li className="menu-item active"> <span className="menu-text">{title}</span></li>

        </ul>
      </div>

      <div className="header-right">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search..." aria-label="Search" />
        </div>
        <img src="/headers/lighttheme.png" alt="Profile" className="right-side-icons" />
        <img src="/headers/history.png" alt="Profile" className="right-side-icons" />
        <img src="/headers/notification.png" alt="Profile" className="right-side-icons" />
        <img src="/headers/Settings.png" style={{height: "12px", width: "12px"}} alt="Profile" className="right-side-icons" />
        
      </div>
    </header>
  );
};

export default Header;