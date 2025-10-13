import React from 'react';
import MenuItems from '../MenuItems/MenuItems';
import './Navbar.css';
import TalkBurshLogo from '../../assets/TalkBrush_logo.svg'; 

const Navbar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={TalkBurshLogo} alt="Logo" className="sidebar-logo" />
      </div>
      <MenuItems />
    </aside>
  );
};

export default Navbar;
