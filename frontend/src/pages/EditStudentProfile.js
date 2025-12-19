import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import { User, Save, MapPin, Phone, Book } from 'lucide-react';
import { CLASSES, BOARDS } from '../utils/helpers';

const EditStudentProfile = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        studentName: '',
        class: '',
        board: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        },
        previousMarks: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                studentName: user.studentName || '',
                class: user.class || '',
                board: user.board || '',
                address: {
                    street: user.address?.street || '',
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    pincode: user.address?.pincode || ''
                },
                previousMarks: user.previousMarks || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });

        try {
            const res = await usersAPI.updateProfile(formData);
            if (res.data.success) {
                setMsg({ type: 'success', text: 'Profile updated successfully!' });
                // We should technically update the auth context here if we had a method exposed to partial update
                // For now, reload works or assume subsequent fetches will get new data
            }
        } catch (error) {
            console.error(error);
            setMsg({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="bg-primary px-6 py-4">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <User className="w-6 h-6" /> Edit Profile (Student)
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {msg.text && (
                        <div className={`p-4 rounded ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {msg.text}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="label">Parent Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input w-full"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">Student Name</label>
                        <input
                            type="text"
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="label">Class</label>
                            <select
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                className="input w-full"
                            >
                                <option value="">Select Class</option>
                                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">Board</label>
                            <select
                                name="board"
                                value={formData.board}
                                onChange={handleChange}
                                className="input w-full"
                            >
                                <option value="">Select Board</option>
                                {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Address
                        </h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="address.street"
                                placeholder="Street Address"
                                value={formData.address.street}
                                onChange={handleChange}
                                className="input w-full"
                            />
                            <div className="grid grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    name="address.city"
                                    placeholder="City"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    className="input w-full"
                                />
                                <input
                                    type="text"
                                    name="address.state"
                                    placeholder="State"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                    className="input w-full"
                                />
                                <input
                                    type="text"
                                    name="address.pincode"
                                    placeholder="PIN"
                                    value={formData.address.pincode}
                                    onChange={handleChange}
                                    className="input w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudentProfile;
