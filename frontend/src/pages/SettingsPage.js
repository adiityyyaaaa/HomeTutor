import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, Lock, Bell, User } from 'lucide-react';

const SettingsPage = () => {
    const { user } = useAuth();
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        updates: false
    });
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });



    const handleNotificationChange = (e) => {
        setNotifications({
            ...notifications,
            [e.target.name]: e.target.checked
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const submitPasswordChange = (e) => {
        e.preventDefault();
        alert('Password change functionality would go here.');
        setPasswordData({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <div className="container-custom py-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar / Navigation (optional for larger apps, inline for now) */}
                    <div className="col-span-3 space-y-6">

                        {/* Appearance */}


                        {/* Notifications */}
                        <div className="card">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Notifications
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
                                    <input type="checkbox" name="email" className="toggle toggle-primary" checked={notifications.email} onChange={handleNotificationChange} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
                                    <input type="checkbox" name="push" className="toggle toggle-primary" checked={notifications.push} onChange={handleNotificationChange} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 dark:text-gray-300">Product Updates</span>
                                    <input type="checkbox" name="updates" className="toggle toggle-primary" checked={notifications.updates} onChange={handleNotificationChange} />
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="card">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                Security
                            </h2>
                            <form onSubmit={submitPasswordChange} className="space-y-4">
                                <div>
                                    <label className="label">Current Password</label>
                                    <input
                                        type="password"
                                        name="current"
                                        className="input w-full"
                                        value={passwordData.current}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">New Password</label>
                                        <input
                                            type="password"
                                            name="new"
                                            className="input w-full"
                                            value={passwordData.new}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirm"
                                            className="input w-full"
                                            value={passwordData.confirm}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="btn btn-primary">Change Password</button>
                                </div>
                            </form>
                        </div>

                        {/* Account Info (Read Only) */}
                        <div className="card bg-gray-50 dark:bg-gray-800 border dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Account Information
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Name</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Email</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Role</p>
                                    <p className="font-medium text-gray-900 dark:text-white capitalize">{user?.role}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">User ID</p>
                                    <p className="font-mono text-gray-900 dark:text-white">{user?._id}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
