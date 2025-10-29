import { useState, useEffect } from "react";
import "./HeaderBar.css";
import { FaHome, FaBell, FaUserCircle, FaCog, FaSearch } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { usePageTitle } from "../../hooks/usePageTitle";
import { Menu, X } from 'lucide-react';

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {


  const { title } = usePageTitle();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


  return (
    <header className="header">
      <div className="header-left">
        <ul className="header-menu">
          {!isMobile && (
            <>
              <li className="menu-item"> <img src="/headers/window.png" alt="" /> </li>
              <li className="menu-item"> <img src="/headers/fav.png" alt="" /> </li>
              <li className="menu-item"> <span className="menu-text">TalkBrush</span></li>
              <li className="menu-item"> <span className="menu-text">/</span></li>
            </>
          )}
          <li className="menu-item active"> <span className="menu-text">{title}</span></li>
        </ul>
      </div>

      <div className="header-right">
        <div className="search-box">
          <FaSearch className="search-icon" />
          {!isMobile && <input type="text" placeholder="Search..." aria-label="Search" />}
        </div>
        {!isMobile && (
          <>
            <img src="/headers/lighttheme.png" alt="Profile" className="right-side-icons" />
            <img src="/headers/history.png" alt="Profile" className="right-side-icons" />
          </>
        )}
        <img src="/headers/notification.png" alt="Profile" className="right-side-icons" />
        <img src="/headers/Settings.png" style={{ height: "12px", width: "12px" }} alt="Profile" className="right-side-icons" />

        {/* Mobile Menu Toggle Button */}
        {isMobile && (
          <button
            className="mobile-menu-toggle-header"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;