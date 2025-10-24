import React from "react";
import "./RightPanel.css";


const AdminIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const UserManagementIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0112 12a5.995 5.995 0 013 5.197" />
    </svg>
);



const RightComponent = () => {
  return (
    // <div className="right-component">
    //   <div className="right-box">
    //     <h4>Notifications</h4>
    //     <ul>
    //       <li>New message from Alice</li>
    //       <li>Server downtime alert</li>
    //       <li>Update available</li>
    //     </ul>
    //   </div>
    //   <div className="right-box">
    //     <h4>Contacts</h4>
    //     <ul>
    //       <li>John Doe</li>
    //       <li>Jane Smith</li>
    //       <li>Michael Lee</li>
    //     </ul>
    //   </div>
    //   <div className="right-box">
    //     <h4>Activity</h4>
    //     <ul>
    //       <li>Logged in 2h ago</li>
    //       <li>Edited Profile</li>
    //       <li>Uploaded Document</li>
    //     </ul>
    //   </div>
    // </div>
    <>
        <aside className="right-component">
            <div className="right-box">
                <h4>Notifications</h4>
                <ul>
                    <li className="notification-item">
                         <div className="item-icon info"><AdminIcon className="icon-sm" /></div>
                         <div className="item-content">
                            <p>You fixed a bug.</p>
                            <small>Just now</small>
                        </div>
                    </li>
                     <li className="notification-item">
                         <div className="item-icon"><UserManagementIcon className="icon-sm" /></div>
                         <div className="item-content">
                            <p>New user registered.</p>
                            <small>59 minutes ago</small>
                        </div>
                    </li>
                     <li className="notification-item">
                         <div className="item-icon info"><AdminIcon className="icon-sm" /></div>
                         <div className="item-content">
                            <p>You fixed a bug.</p>
                            <small>12 hours ago</small>
                        </div>
                    </li>
                     <li className="notification-item">
                         <div className="item-icon"><img src="https://placehold.co/32x32/E2E8F0/475569?text=A" alt="user" /></div>
                         <div className="item-content">
                            <p>Andi Lane subscribed to you.</p>
                            <small>Today, 11:59 AM</small>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="right-box">
                <h4>Activities</h4>
                <ul>
                    <li className="activity-item">
                        <img src="https://placehold.co/32x32/E2E8F0/475569?text=C" alt="user" />
                        <p>Changed the style.</p>
                        <small>Just now</small>
                    </li>
                    <li className="activity-item">
                        <img src="https://placehold.co/32x32/E2E8F0/475569?text=R" alt="user" />
                        <p>Released a new version.</p>
                        <small> 5 min. ago</small>
                    </li>
                     <li className="activity-item">
                        <img src="https://placehold.co/32x32/E2E8F0/475569?text=S" alt="user" />
                        <p>Submitted a bug.</p>
                        <small>12 hours ago</small>
                    </li>
                     <li className="activity-item">
                        <img src="https://placehold.co/32x32/E2E8F0/475569?text=M" alt="user" />
                        <p>Modified A data in Page X.</p>
                        <small>Feb 1</small>
                    </li>
                     <li className="activity-item">
                        <img src="https://placehold.co/32x32/E2E8F0/475569?text=D" alt="user" />
                        <p>Deleted a page in Project X.</p>
                        <small>Feb 2</small>
                    </li>
                </ul>
            </div>
            <div className="right-box">
                <h4>Contacts</h4>
                <ul>
                    <li className="contact-item"><img src="https://placehold.co/32x32/E2E8F0/475569?text=N" alt="user" /> <p>Natali Craig</p></li>
                    <li className="contact-item"><img src="https://placehold.co/32x32/E2E8F0/475569?text=D" alt="user" /> <p>Drew Cano</p></li>
                    <li className="contact-item"><img src="https://placehold.co/32x32/E2E8F0/475569?text=A" alt="user" /> <p>Andi Lane</p></li>
                    <li className="contact-item"><img src="https://placehold.co/32x32/E2E8F0/475569?text=K" alt="user" /> <p>Koray Okumus</p></li>
                    {/* <li className="contact-item"><img src="https://placehold.co/32x32/E2E8F0/475569?text=K" alt="user" /> <p>Kate Morrison</p></li> */}
                    {/* <li className="contact-item"><img src="https://placehold.co/32x32/E2E8F0/475569?text=M" alt="user" /> <p>Melody Macy</p></li> */}
                </ul>
            </div>
        </aside>
    </>
  );
};

export default RightComponent;
