import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/userSlice';
import { Home, User, Settings, LogOut } from 'lucide-react';
import './MenuItems.css';

const MenuItems = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useDispatch();

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/');
    };

    return (
        <ul className="menu-items">
            <li onClick={() => navigate('/dashboard')}
                className={location.pathname === '/dashboard' ? 'active' : ''}>
                <Home size={20} />
                <span>Dashboard</span>
            </li>
            <li onClick={() => navigate('/profile')}
                className={location.pathname === '/profile' ? 'active' : ''}>
                <User size={20} />
                <span>Manage Profile</span>
            </li>
            <li onClick={() => navigate('/settings')}
                className={location.pathname === '/settings' ? 'active' : ''}>
                <Settings size={20} />
                <span>Privacy Policy</span>
            </li>
            <li onClick={handleLogout}
                className={location.pathname === '/logout' ? 'active' : ''}>
                <LogOut size={20} />
                <span>Logout</span>
            </li>
        </ul>
    );
};

export default MenuItems;