import { useState, useEffect } from "react";
import "./HeaderBar.css";
import { usePageTitle } from "../../hooks/usePageTitle";
import { Menu, X } from 'lucide-react';
import { Link } from "react-router-dom";


const Header = ({ isSidebarOpen, setIsSidebarOpen, isRightPanelOpen, setIsRightPanelOpen }) => {

  const { title } = usePageTitle();
  const [isMobile, setIsMobile] = useState(false);

  const getHomePath = () => {
    const userType = localStorage.getItem('role');

    if (userType === "1") {
      return "/dashboard";
    } else if (userType === "2") {
      return "/admin-dashboard";
    } else if (userType === "3") {
      return "/user-dashboard";
    } else {
      return "/user-dashboard";
    }
  };

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
              <li className="menu-item">
                <Link to={getHomePath()}>
                  <img
                    src="https://img.icons8.com/ios-filled/50/000000/home.png"
                    alt="home"
                    className="w-4 h-4 mr-1"
                  />
                </Link>
              </li>
              <li className="menu-item -ml-1 mt-1">
                <Link to={getHomePath()} className="menu-text">Home</Link>
              </li>
              <li className="menu-item"> <span className="menu-text mt-1">/</span></li>
            </>
          )}
          <li className="menu-item active"> <span className="menu-text mt-1">{title}</span></li>
        </ul>
      </div>

      <div className="header-right">
        {!isMobile && (
          <>
            <img src="/headers/lighttheme.png" alt="Profile" className="right-side-icons" />          </>
        )}
        {isMobile && (
          <>
            <img
              src="/headers/history.png"
              alt="History"
              className="right-side-icons"
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              style={{ cursor: 'pointer' }}
            />
            <img
              src="/headers/notification.png"
              alt="Notification"
              className="right-side-icons"
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              style={{ cursor: 'pointer' }}
            />
          </>
        )}
        {!isMobile && (
          <img src="/headers/Settings.png" style={{ height: "12px", width: "12px" }} alt="Profile" className="right-side-icons" />
        )}

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