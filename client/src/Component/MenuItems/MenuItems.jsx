// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { logout } from '../../features/userSlice';
// import { Home, User, Settings, LogOut } from 'lucide-react';
// import './MenuItems.css';

// const MenuItems = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     const dispatch = useDispatch();

//     const handleLogout = async () => {
//         await dispatch(logout());
//         navigate('/');
//     };

//     return (
//         <ul className="menu-items">
//             <li onClick={() => navigate('/dashboard')}
//                 className={location.pathname === '/dashboard' ? 'active' : ''}>
//                 <Home size={20} />
//                 <span>Dashboard</span>
//             </li>
//             <li onClick={() => navigate('/profile')}
//                 className={location.pathname === '/profile' ? 'active' : ''}>
//                 <User size={20} />
//                 <span>Manage Profile</span>
//             </li>
//             <li onClick={() => navigate('/settings')}
//                 className={location.pathname === '/settings' ? 'active' : ''}>
//                 <Settings size={20} />
//                 <span>Privacy Policy</span>
//             </li>
//             <li onClick={handleLogout}
//                 className={location.pathname === '/logout' ? 'active' : ''}>
//                 <LogOut size={20} />
//                 <span>Logout</span>
//             </li>
//         </ul>
//     );
// };

// export default MenuItems;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/userSlice';
import { Home, User, Settings, LogOut, Users, Shield } from 'lucide-react'; // Added icons
import './MenuItems.css';

const MenuItems = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const role = localStorage.getItem("role"); // 👈 Get logged-in user role

    const handleLogout = async () => {
        await dispatch(logout());
        localStorage.clear();
        navigate('/');
    };


    const Icon = ({ children, className = "w-5 h-5" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {children}
    </svg>
);

const icons = {
    BarChart3: (
        <>
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
        </>
    ),
    UserCog: (
        <>
            <circle cx="18" cy="15" r="3" />
            <circle cx="9" cy="7" r="4" />
            <path d="M10 15H6a4 4 0 0 0-4 4v2" />
            <path d="m21.7 16.4-.9-.3" />
            <path d="m15.2 13.9-.9-.3" />
            <path d="m16.6 18.7.3-.9" />
            <path d="m19.1 12.2.3-.9" />
            <path d="m19.5 17.3-.3.9" />
            <path d="m18.4 11.2.9.3" />
            <path d="m16.8 19.7-.4.9" />
            <path d="m14.3 12.8-.4.9" />
        </>
    ),
    UserSearch: (
        <>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
        </>
    ),
    Gavel: (
        <>
            <path d="m14 13-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L11 10" />
            <path d="m16 16 6-6" />
            <path d="m8 8 6-6" />
            <path d="m9 7 8 8" />
            <path d="m21 11-8-8" />
        </>
    ),
    FileText: (
        <>
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
        </>
    ),
    Blocks: (
        <>
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="3" y="3" rx="1" />
        </>
    ),
    
    ChevronDown: <path d="m6 9 6 6 6-6" />,
};

    // 🧠 Define menu items per role
    const menuConfig = {
        superadmin: [
            // { name: "Dashboard", icon: <Home size={20}  />, path: "/dashboard" },
            { name: "Dashboard",icon: <Icon>{icons.Blocks}</Icon>, path: "/dashboard" },
            // { name: "Manage Admins", icon: <Shield size={20} />, path: "/manage-admins" },
            { name: "Admin Management", icon: <Icon>{icons.UserCog}</Icon>, path: "/manage-admins" },
            // { name: "Manage Users", icon: <Users size={20} />, path: "/manage-users" },
            { name: "User Management", icon: <Icon>{icons.UserSearch}</Icon>, path: "/manage-users" },
            // { name: "Privacy Policy", icon: <Settings size={20} />, path: "/settings" },
            // { name: "Privacy Policy",icon: <Icon>{icons.FileText}</Icon>, path: "/settings" },
        ],
        admin: [
            { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
            { name: "Manage Users", icon: <Users size={20} />, path: "/manage-users" },
            { name: "Privacy Policy", icon: <Settings size={20} />, path: "/settings" },
        ],
        user: [
            { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
            { name: "Services", icon: <User size={20} />, path: "/services" },
            { name: "Privacy Policy", icon: <Settings size={20} />, path: "/settings" },
        ],
    };
    const type = role === '1' ? 'superadmin' : role === '2' ? 'admin' : 'user'; // 👈 Map role to menuConfig key
    // 🪄 Choose menu based on role (default to user if not found)
    const menuItems = menuConfig[type] || menuConfig.user;

    return (
        <ul className="menu-items">
            {menuItems.map((item) => (
                <li
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className={location.pathname === item.path ? 'active' : ''}
                >
                    {item.icon}
                    <span>{item.name}</span>
                </li>
            ))}

            {/* Logout is common for all */}
            <li onClick={handleLogout}>
                <LogOut size={20} />
                <span>Logout</span>
            </li>
        </ul>
    );
};

export default MenuItems;
