import { useState, useEffect, useRef } from "react";
import "./HeaderBar.css";
import { usePageTitle } from "../../hooks/usePageTitle";
import { Menu, X, Sun, Settings, Wrench, SlidersHorizontal, Cog, Shield, FileText, Mail, Home, History, Bell } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";


const Header = ({ isSidebarOpen, setIsSidebarOpen, isRightPanelOpen, setIsRightPanelOpen }) => {

  const { title } = usePageTitle();
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef(null); // Ref to store the closure timer ID


  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  const openSettingsMenu = () => {
    // 1. If a closure timer is running, clear it (the user quickly moved out and back in)
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsSettingsMenuOpen(true);
  };

  const closeSettingsMenu = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsSettingsMenuOpen(false);
      timerRef.current = null; // Clear ref after execution
    }, 500);
  };

  const instantCloseMenu = () => {
    // Clear any pending closure timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsSettingsMenuOpen(false);
  };

  const navigate = useNavigate();

  const handleMenuItemClick = (item) => {
    if (item === "Privacy & Policy") navigate("/privacy-policy");
    // if (item === "Terms & Conditions") navigate("/terms-and-conditions");
    // if (item === "Contact Us") navigate("/contact-us");
  };

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
          <li className="menu-item active"> <span className="menu-text mt-2">{title}</span></li>
        </ul>
      </div>

      <div className="header-right">
        {!isMobile && (
          <>
            {/* <img src="/headers/lighttheme.png" alt="Profile" className="right-side-icons" />    */}
            <Sun
              size={18}
              className=" cursor-pointer transition duration-150"
              aria-label="Toggle Light Theme"
            />
          </>
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
          // <img src="/headers/Settings.png" style={{ height: "12px", width: "12px" }} alt="Profile" className="right-side-icons" />
          <div
            className="relative"
            onMouseEnter={openSettingsMenu}
            onMouseLeave={closeSettingsMenu}
          >
            <Cog
              size={20}
              className={`text-gray-700 cursor-pointer transition duration-300 ${isSettingsMenuOpen ? 'text-blue-600 rotate-90' : 'hover:rotate-90'}`}
              aria-label="Settings"
            />

            {/* Settings Dropdown Card */}
            {isSettingsMenuOpen && (
              <div
                className="absolute right-0 mt-3 w-60 rounded-xl shadow-xl bg-white border border-gray-100 transform origin-top-right z-40"
                style={{ animation: 'scale-in 0.2s ease-out' }}
              // The onMouseLeave for the dropdown is handled by the parent container
              >
                <div className="absolute -top-1.5 right-2 w-3 h-3 bg-white transform rotate-45 border-t border-l border-gray-100"></div>

                {/* Header with Close Button */}
                <div className="flex justify-between items-center px-4 pt-3 pb-1 border-b border-gray-100">
                  <span className="text-xs font-semibold uppercase text-gray-500">Utilities</span>
                  <button
                    onClick={instantCloseMenu}
                    className="text-gray-400 cursor-pointer hover:text-red-500 p-1 rounded-full transition duration-150"
                    aria-label="Close Settings Menu"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Menu Items */}
                <ul className="py-2 text-sm text-gray-700">
                  <li
                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition duration-150"
                    onClick={() => handleMenuItemClick("Privacy & Policy")}
                  >
                    <Shield size={18} className="mr-3 text-indigo-500" />
                    Privacy & Policy
                  </li>
                  {/* <li 
                          className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition duration-150 border-t border-gray-100"
                          onClick={() => handleMenuItemClick("Terms & Conditions")}
                      >
                          <FileText size={18} className="mr-3 text-teal-500" />
                          Terms & Conditions
                      </li>
                      <li 
                          className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition duration-150 border-t border-gray-100"
                          onClick={() => handleMenuItemClick("Contact Us")}
                      >
                          <Mail size={18} className="mr-3 text-red-500" />
                          Contact Us
                      </li> */}
                </ul>
              </div>
            )}
          </div>
        )}
        {isMobile && (
          // <img src="/headers/Settings.png" style={{ height: "12px", width: "12px" }} alt="Profile" className="right-side-icons" />
          <div
            className="relative"
            onMouseEnter={openSettingsMenu}
            onMouseLeave={closeSettingsMenu}
          >
            <Cog
              size={14}
              className={`text-gray-700 cursor-pointer transition duration-300 ${isSettingsMenuOpen ? 'text-blue-600 rotate-90' : 'hover:rotate-90'}`}
              aria-label="Settings"
            />

            {/* Settings Dropdown Card */}
            {isSettingsMenuOpen && (
              <div
                className="absolute right-0 mt-3 w-60 rounded-xl shadow-xl bg-white border border-gray-100 transform origin-top-right z-40"
                style={{ animation: 'scale-in 0.2s ease-out' }}
              // The onMouseLeave for the dropdown is handled by the parent container
              >
                <div className="absolute -top-1.5 right-2 w-3 h-3 bg-white transform rotate-45 border-t border-l border-gray-100"></div>

                {/* Header with Close Button */}
                <div className="flex justify-between items-center px-4 pt-3 pb-1 border-b border-gray-100">
                  <span className="text-xs font-semibold uppercase text-gray-500">Utilities</span>
                  <button
                    onClick={instantCloseMenu}
                    className="text-gray-400 cursor-pointer hover:text-red-500 p-1 rounded-full transition duration-150"
                    aria-label="Close Settings Menu"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Menu Items */}
                <ul className="py-2 text-sm text-gray-700">
                  <li
                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition duration-150"
                    onClick={() => handleMenuItemClick("Privacy & Policy")}
                  >
                    <Shield size={18} className="mr-3 text-indigo-500" />
                    Privacy & Policy
                  </li>
                  <li
                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition duration-150 border-t border-gray-100"
                    onClick={() => handleMenuItemClick("Terms & Conditions")}
                  >
                    <FileText size={18} className="mr-3 text-teal-500" />
                    Terms & Conditions
                  </li>
                  <li
                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition duration-150 border-t border-gray-100"
                    onClick={() => handleMenuItemClick("Contact Us")}
                  >
                    <Mail size={18} className="mr-3 text-red-500" />
                    Contact Us
                  </li>
                </ul>
              </div>
            )}
          </div>
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