import React from 'react';
import MenuItems from '../MenuItems/MenuItems';
import './Navbar.css';
import TalkBurshLogo from '../../assets/TalkBrush_logo.svg'; 
import HeaderBar from '../HeaderBar/HeaderBar';
import RightComponent from '../HeaderBar/RightPanel';

const Navbar = () => {
  return (
    // <aside className="sidebar">
    //   <div className="sidebar-header">
    //     <img src={TalkBurshLogo} alt="Logo" className="sidebar-logo" />
    //   </div>
    //   <MenuItems />  
    //   <HeaderBar />  
    // </aside>


    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={TalkBurshLogo} alt="Logo" className="sidebar-logo" />
        </div>
        <MenuItems />  
      </aside>

      {/* HeaderBar next to sidebar */}
      
        <HeaderBar />
        <RightComponent />
    </>

  );
};

export default Navbar;
