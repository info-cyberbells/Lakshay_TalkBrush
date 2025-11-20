import { useLocation, matchPath } from 'react-router-dom';
import { Home, User, Settings } from 'lucide-react';

const routeConfig = {
    '/dashboard': {
        title: 'Dashboard',
    },
    '/admin-dashboard': {
        title: 'Admin Dashboard',

    },
    '/user-dashboard': {
        title: 'User Dashboard',

    },
    '/manage-admins': {
        title: 'Admin Management',

    },
    '/manage-users': {
        title: 'User Management',

    },
    '/manage-event': {
        title: 'Events',
    },
    '/events': {
        title: 'Events',
    },
    '/analytics': {
        title: 'Analytics',
    },
    '/voice-conversation': {
        title: 'Convo Space',
    },
    '/manage-profile': {
        title: 'Manage Profile',

    },
    '/convo-space': {
        title: 'Convo Space',
    },
};

export const usePageTitle = () => {
    const location = useLocation();
    const path = location.pathname;

    const exactConfig = routeConfig[path];
    if (exactConfig) {
        return {
            title: exactConfig.title,
            Icon: exactConfig.icon,
        };
    }

    if (matchPath('/accent/room/:id', path)) {
        return {
            title: 'Convo Space',
            Icon: null,
        };
    }

    return { title: '', Icon: null };
};
