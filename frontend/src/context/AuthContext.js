import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        if (token) {
            // You could verify token with backend here
            // For now, we'll just set a flag
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                const { token, user } = response.data;

                // Store token and user
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                setToken(token);
                setUser(user);

                return { success: true };
            }

            return { success: false, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData, userType) => {
        try {
            const endpoint = userType === 'student'
                ? '/auth/register/student'
                : '/auth/register/teacher';

            const response = await api.post(endpoint, userData);

            if (response.data.success) {
                const { token, user, teacher } = response.data;
                const userData = user || teacher;

                // Store token and user
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                setToken(token);
                setUser(userData);

                return { success: true };
            }

            return { success: false, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const registerTeacher = async (formData) => {
        try {
            const response = await api.post('/auth/register/teacher', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                const { token, teacher } = response.data;

                // Store token and user
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(teacher));

                setToken(token);
                setUser(teacher);

                return { success: true };
            }

            return { success: false, message: response.data.message };
        } catch (error) {
            throw error; // Re-throw so RegisterTeacher.js can handle it
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        registerTeacher,
        logout,
        updateUser,
        isAuthenticated: !!token,
        isStudent: user?.role === 'student',
        isTeacher: user?.role === 'teacher'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
