import React from 'react';
import { usePageTitle } from '../usePageTitle';
import { Home } from 'lucide-react';
import './PageHeader.css';

const PageHeader = () => {
    const { title, Icon } = usePageTitle();

    return (
        <div className="page-header">
            <h1 className="page-title">{title}</h1>
            <div className="breadcrumb">
                  {Icon && <Icon size={16} className="breadcrumb-icon" />}
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{title}</span>
            </div>
        </div>
    );
};

export default PageHeader;