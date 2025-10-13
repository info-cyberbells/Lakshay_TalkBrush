import React, { useState } from 'react';
import PageHeader from '../../hooks/PageHeader/PageHeader';
import './Profile.css';

const Profile = () => {
    const [formData, setFormData] = useState({
        firstName: 'Ram',
        lastName: 'Dashrath',
        email: 'Ram@gmail.com',
        phone: '9306796806',
        suburb: 'Chandigarh',
        referralCode: 'IMXT567'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add your submit logic here
    };

    const profileCompletion = 60; // Calculate based on filled fields

    return (
        <div className="dashboard-container">
            <main className="main-content">
                <div className="profile-wrapper">
                    <PageHeader />

                    <div className="profile-header">
                        <div className="profile-left">
                            <div className="profile-image">
                                <img src="/logo.png" alt="Profile" />
                            </div>
                            <div className="profile-buttons">
                                <button className="btn-change-password">Change Password</button>
                                <button className="btn-edit-picture">Edit Profile Picture</button>
                            </div>
                        </div>

                        <div className="profile-completion">
                            <div className="completion-header">
                                <span className="completion-icon">●</span>
                                <span className="completion-text">Complete your Profile</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${profileCompletion}%` }}
                                ></div>
                            </div>
                            <div className="completion-percentage">
                                {profileCompletion}% / 100%
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Suburb</label>
                                <input
                                    type="text"
                                    name="suburb"
                                    value={formData.suburb}
                                    onChange={handleChange}
                                    placeholder="Suburb"
                                />
                            </div>

                            <div className="form-group">
                                <label>Referral Code</label>
                                <input
                                    type="text"
                                    name="referralCode"
                                    value={formData.referralCode}
                                    onChange={handleChange}
                                    placeholder="Referral Code"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-confirm">
                            Confirm
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Profile;