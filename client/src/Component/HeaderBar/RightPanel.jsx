import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivities } from "../../features/activitiesSlice";
import "./RightPanel.css";

// Icon components
const CalendarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BellIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// Get icon based on action type and entity
const getNotificationIcon = (actionType, entityType, metadata) => {
  if (actionType === "DELETE") return <TrashIcon className="icon-sm" />;
  if (entityType === "events") return <CalendarIcon className="icon-sm" />;
  return <BellIcon className="icon-sm" />;
};

const getActivityIcon = (actionType, metadata) => {
  if (actionType === "DELETE") return <TrashIcon className="icon-sm" />;
  return <UserIcon className="icon-sm" />;
};

const getInitial = (description) => {
  // Extract first letter from name or email
  const nameMatch = description.match(/^([A-Z][a-z]+)/);
  if (nameMatch) return nameMatch[1].charAt(0).toUpperCase();

  const emailMatch = description.match(/([a-z]+)@/i);
  if (emailMatch) return emailMatch[1].charAt(0).toUpperCase();

  return description.charAt(0).toUpperCase();
};

const RightComponent = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { notifications, activities, loading, error } = useSelector((state) => state.activities);

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  // const role = localStorage.getItem("role");
  // if (role === "3") return null;


  return (
    <aside className={`right-component ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      )}
      {/* Notifications Section (Events) */}
      <div className="right-box">
        <h4>Notifications</h4>
        {loading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && notifications.length === 0 && (
          <p className="empty-text">No notifications</p>
        )}
        {!loading && !error && notifications.length > 0 && (
          <ul>
            {notifications.slice(0, 4).map((notification) => (
              <li key={notification.id} className="notification-item">
                <div className={`item-icon ${notification.actionType === 'CREATE' ? 'success' : notification.actionType === 'DELETE' ? 'danger' : 'info'}`}>
                  {getNotificationIcon(notification.actionType, notification.entityType, notification.metadata)}
                </div>
                <div className="item-content">
                  <p title={notification.description}>{notification.description}</p>
                  <small>{notification.timeAgo}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Activities Section (Users) */}
      <div className="right-box">
        <h4>Activities</h4>
        {loading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && activities.length === 0 && (
          <p className="empty-text">No activities</p>
        )}
        {!loading && !error && activities.length > 0 && (
          <ul>
            {activities.slice(0, 5).map((activity) => (
              <li key={activity.id} className="activity-item">
                <img
                  src={`https://placehold.co/32x32/E2E8F0/475569?text=${getInitial(activity.description)}`}
                  alt="user"
                />
                <div className="item-content">
                  <p title={activity.description}>{activity.description}</p>
                  <small>{activity.timeAgo}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </aside>
  );
};

export default RightComponent;