import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, MapPin, Upload, ArrowRight, ArrowLeft, CheckCircle, Loader, X, Timer } from 'lucide-react';
import { isValidEmail } from '../utils/helpers';
import PhoneVerification from '../components/PhoneVerification';
import TagInput from '../components/TagInput';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const RegisterTeacher = () => {
    const { registerTeacher } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            coordinates: {
                coordinates: [] // [longitude, latitude]
            }
        },
        subjects: [],
        boards: [],
        classesCanTeach: [],
        experience: '',
        qualifications: '',
        hourlyRate: '',
        monthlyRate: '',
        aadhaarNumber: '',
        photo: null,
        aadhaarDoc: null,
        introVideoLink: '',
        teachingVideoLink: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleAddressChange = (e) => {
        setFormData({
            ...formData,
            address: { ...formData.address, [e.target.name]: e.target.value }
        });
        setError(null);
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        address: {
                            ...formData.address,
                            coordinates: {
                                coordinates: [position.coords.longitude, position.coords.latitude]
                            }
                        }
                    });
                },
                (error) => {
                    console.error("Error obtaining location", error);
                    alert("Could not get your location. Please ensure location services are enabled.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };



    const validateStep = () => {
        setError(null);

        if (step === 1) {
            if (!formData.name || !formData.email || !formData.password || !formData.phone) {
                setError('Please fill in all required fields');
                return false;
            }
            if (!isValidEmail(formData.email)) {
                setError('Please enter a valid email address');
                return false;
            }
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters');
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return false;
            }
        }

        if (step === 2) {
            if (!formData.address.street || !formData.address.city || !formData.address.state || !formData.address.pincode) {
                setError('Please fill in all location fields');
                return false;
            }
            if (formData.subjects.length === 0 || formData.boards.length === 0 || formData.classesCanTeach.length === 0 || !formData.experience || !formData.qualifications) {
                setError('Please fill in all professional details');
                return false;
            }
        }

        if (step === 3) {
            if (!formData.hourlyRate || !formData.monthlyRate) {
                setError('Please specify your rates');
                return false;
            }
        }

        if (step === 4) {
            if (!formData.photo) {
                setError('Please upload a profile photo');
                return false;
            }
            if (formData.introVideoLink && !formData.introVideoLink.includes('youtube.com') && !formData.introVideoLink.includes('youtu.be')) {
                setError('Please enter a valid YouTube link for Intro Video');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep()) return;

        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('phone', formData.phone);
            data.append('aadhaarNumber', formData.aadhaarNumber);
            data.append('address', JSON.stringify(formData.address));


            // Arrays (stringify for backend parsing)
            data.append('subjects', JSON.stringify(formData.subjects));
            data.append('boards', JSON.stringify(formData.boards));
            data.append('classesCanTeach', JSON.stringify(formData.classesCanTeach));

            // Currently fixed placeholders
            data.append('qualifications', JSON.stringify([{ degree: formData.qualifications, institution: 'Unknown', year: 2020 }]));

            data.append('experience', formData.experience);
            data.append('hourlyRate', formData.hourlyRate);
            data.append('monthlyRate', formData.monthlyRate);
            data.append('introVideoLink', formData.introVideoLink);
            data.append('teachingVideoLink', formData.teachingVideoLink);

            if (formData.photo) data.append('photo', formData.photo);

            await registerTeacher(data);
            navigate('/teacher-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };
    const prevStep = () => setStep(step - 1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">


            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <BookOpen className="w-10 h-10 text-primary" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">HomeTutor</span>
                    </Link>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Join as a Teacher & Start Earning
                    </p>
                </div>

                <div className="card">
                    {/* Progress Steps */}
                    <div className="flex justify-between mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`flex items-center ${i < 4 ? 'flex-1' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= i ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {i}
                                </div>
                                {i < 4 && (
                                    <div className={`h-1 flex-1 mx-2 ${step > i ? 'bg-primary' : 'bg-gray-200'
                                        }`}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account Details</h2>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    className="input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                                {/* Email Field with Verify */}
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    className="input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />


                                {/* Phone Field with Verify */}
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        className="input"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        className="input"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        className="input"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="button" onClick={nextStep} className="btn btn-primary flex items-center">
                                        Next <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Professional Details</h2>

                                <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <input type="text" name="street" placeholder="Street" className="input" value={formData.address.street} onChange={handleAddressChange} required />
                                        <input type="text" name="city" placeholder="City" className="input" value={formData.address.city} onChange={handleAddressChange} required />
                                        <input type="text" name="state" placeholder="State" className="input" value={formData.address.state} onChange={handleAddressChange} required />
                                        <input type="text" name="pincode" placeholder="Pincode" className="input" value={formData.address.pincode} onChange={handleAddressChange} required />
                                    </div>
                                    <button type="button" onClick={getLocation} className="btn btn-sm btn-outline flex items-center w-full justify-center">
                                        <MapPin className="w-4 h-4 mr-2" /> Detect My Location
                                    </button>
                                    <button type="button" onClick={getLocation} className="btn btn-sm btn-outline flex items-center w-full justify-center">
                                        <MapPin className="w-4 h-4 mr-2" /> Detect My Location
                                    </button>
                                    {formData.address.coordinates.coordinates.length > 0 && <p className="text-xs text-green-600 mt-1 text-center">Location Captured!</p>}
                                </div>

                                <TagInput
                                    label="Subjects (e.g. Math, Physics)"
                                    placeholder="Type and press Enter"
                                    tags={formData.subjects}
                                    setTags={(newTags) => setFormData({ ...formData, subjects: newTags })}
                                />
                                <TagInput
                                    label="Boards (e.g. CBSE, ICSE)"
                                    placeholder="Type and press Enter"
                                    tags={formData.boards}
                                    setTags={(newTags) => setFormData({ ...formData, boards: newTags })}
                                />
                                <TagInput
                                    label="Classes (e.g. 9, 10, 11)"
                                    placeholder="Type and press Enter"
                                    tags={formData.classesCanTeach}
                                    setTags={(newTags) => setFormData({ ...formData, classesCanTeach: newTags })}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="number"
                                        name="experience"
                                        placeholder="Experience (Years)"
                                        className="input"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="qualifications"
                                        placeholder="Latest Degree (e.g. B.Tech)"
                                        className="input"
                                        value={formData.qualifications}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="flex justify-between pt-4">
                                    <button type="button" onClick={prevStep} className="btn btn-secondary flex items-center">
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                    </button>
                                    <button type="button" onClick={nextStep} className="btn btn-primary flex items-center">
                                        Next <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pricing & Verification</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hourly Rate (₹)</label>
                                        <input
                                            type="number"
                                            name="hourlyRate"
                                            className="input"
                                            value={formData.hourlyRate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Rate (₹)</label>
                                        <input
                                            type="number"
                                            name="monthlyRate"
                                            className="input"
                                            value={formData.monthlyRate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <input
                                    type="text"
                                    name="aadhaarNumber"
                                    placeholder="Aadhaar Number (12 digits) - Optional"
                                    className="input"
                                    value={formData.aadhaarNumber}
                                    onChange={handleChange}
                                />
                                <div className="flex justify-between pt-4">
                                    <button type="button" onClick={prevStep} className="btn btn-secondary flex items-center">
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                    </button>
                                    <button type="button" onClick={nextStep} className="btn btn-primary flex items-center">
                                        Next <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Media & Profile</h2>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 mb-2">Upload Profile Photo (10KB - 50KB)</p>
                                        <input
                                            type="file"
                                            name="photo"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    if (file.size < 10240 || file.size > 51200) {
                                                        alert('Image must be between 10KB and 50KB');
                                                        e.target.value = '';
                                                        return;
                                                    }
                                                    if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
                                                        alert('Only JPG/JPEG allowed');
                                                        e.target.value = '';
                                                        return;
                                                    }
                                                    setFormData({ ...formData, photo: file });
                                                }
                                            }}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary hover:file:bg-primary-100"
                                        />
                                    </div>
                                </div>

                                <input
                                    type="url"
                                    name="introVideoLink"
                                    placeholder="Intro Video Link (YouTube)"
                                    className="input"
                                    value={formData.introVideoLink}
                                    onChange={handleChange}
                                />
                                <input
                                    type="url"
                                    name="teachingVideoLink"
                                    placeholder="Teaching Demo Video Link (YouTube)"
                                    className="input"
                                    value={formData.teachingVideoLink}
                                    onChange={handleChange}
                                />

                                <div className="flex justify-between pt-4">
                                    <button type="button" onClick={prevStep} className="btn btn-secondary flex items-center">
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                    </button>
                                    <button type="submit" disabled={loading} className="btn btn-primary flex items-center">
                                        {loading ? 'Registering...' : 'Submit Registration'} <CheckCircle className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <Link to="/login" className="text-primary hover:underline text-sm">
                                Already have an account? Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
};

export default RegisterTeacher;
