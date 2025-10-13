import React from 'react';
import PageHeader from '../../hooks/PageHeader/PageHeader';
import './Dashboard.css';


const Dashboard = () => {

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <PageHeader />
        <h1>Welcome to your Dashboard</h1>
        <p>This is the main content area.</p>
      </main>
    </div>
  );
};

export default Dashboard;
