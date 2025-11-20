import React, { useState, useEffect } from 'react';
import MenuItems from '../MenuItems/MenuItems';
import './Navbar.css';
import TalkBurshLogo from '../../assets/TalkBrush_logo.svg';
import HeaderBar from '../HeaderBar/HeaderBar';
import RightComponent from '../HeaderBar/RightPanel';
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

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
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <>


      {/* Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="menu-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${isMobile && isSidebarOpen ? 'sidebar-open' : ''} ${isMobile ? 'mobile' : ''}`}>
        <div className="sidebar-header">
          <Link to={getHomePath()}>
            <img
              src={TalkBurshLogo}
              alt="Logo"
              className="sidebar-logo"
              style={{ cursor: "pointer" }}
            />
          </Link>
        </div>

        <MenuItems onClose={() => setIsSidebarOpen(false)} />
      </aside>

      <HeaderBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isRightPanelOpen={isRightPanelOpen}
        setIsRightPanelOpen={setIsRightPanelOpen}
      />
      <RightComponent isOpen={isRightPanelOpen} onClose={() => setIsRightPanelOpen(false)} />
    </>
  );
};

export default Navbar;