import { useLocation } from 'react-router-dom';
import { Home, User, Settings } from 'lucide-react';

const routeConfig = {
    '/dashboard': {
        title: 'Dashboard',
        icon: Home
    },
    '/manage-admins': {
        title: 'Admin Mangement',
        // icon: User
    },
    '/manage-users': {
        title: 'User Management',
        // icon: Settings
    },
    '/manage-event': {
        title: 'Events',
        // icon: Settings
    },
    '/analytics': {
        title: 'Analytics',
        // icon: Settings
    },
    '/manage-profile': {
        title: 'Manage Profile',
        // icon: Settings
    },
    '/convo-space': {
        title: 'Convo Space',
        // icon: Settings
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