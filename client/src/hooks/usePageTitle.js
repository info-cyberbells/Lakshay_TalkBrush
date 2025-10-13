import { useLocation } from 'react-router-dom';
import { Home, User, Settings } from 'lucide-react';

const routeConfig = {
    '/dashboard': {
        title: 'Dashboard',
        icon: Home
    },
    '/profile': {
        title: 'Manage Profile',
        icon: User
    },
    '/settings': {
        title: 'Privacy Policy',
        icon: Settings
    },
};

export const usePageTitle = () => {
    const location = useLocation();
    const config = routeConfig[location.pathname];
    return {
        title: config?.title,
        Icon: config?.icon,
    };
};