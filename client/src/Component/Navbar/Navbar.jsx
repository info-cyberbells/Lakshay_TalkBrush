import React, { useState, useEffect } from 'react';
import MenuItems from '../MenuItems/MenuItems';
import './Navbar.css';
import TalkBurshLogo from '../../assets/TalkBrush_logo.svg';
import HeaderBar from '../HeaderBar/HeaderBar';
import RightComponent from '../HeaderBar/RightPanel';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
          <img src={TalkBurshLogo} alt="Logo" className="sidebar-logo" />
        </div>
        <MenuItems onClose={() => setIsSidebarOpen(false)} />
      </aside>

      <HeaderBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <RightComponent />
    </>
  );
};

export default Navbar;