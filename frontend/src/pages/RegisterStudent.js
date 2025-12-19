import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, Mail, Lock, Phone, MapPin, AlertCircle, CreditCard } from 'lucide-react';
import { CLASSES, BOARDS } from '../utils/helpers';
import { getCurrentLocation, isValidEmail, isValidPhone, isValidAadhaar } from '../utils/helpers';

const RegisterStudent = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        studentName: '',
        class: '',
        board: '',
        previousMarks: '',
        aadhaarNumber: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            coordinates: {
                type: 'Point',
                coordinates: [0, 0] // [longitude, latitude]
            }
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [addressField]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
        setError('');
    };

    const getLocation = async () => {
        setGettingLocation(true);
        setError('');

        try {
            const location = await getCurrentLocation();
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    coordinates: {
                        type: 'Point',
                        coordinates: [location.longitude, location.latitude]
                    }
                }
            });
            setError('');
        } catch (err) {
            setError('Unable to get location. Please enable location services.');
        }

        setGettingLocation(false);
    };

    const validateStep = () => {
        setError('');

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
            if (!isValidPhone(formData.phone)) {
                setError('Please enter a valid 10-digit phone number');
                return false;
            }
        }

        if (step === 2) {
            if (!formData.studentName || !formData.class || !formData.board) {
                setError('Please fill in all student details');
                return false;
            }
        }

        if (step === 3) {
            if (!formData.aadhaarNumber) {
                setError('Please enter Aadhaar number');
                return false;
            }
            if (!isValidAadhaar(formData.aadhaarNumber)) {
                setError('Please enter a valid 12-digit Aadhaar number');
                return false;
            }
        }

        if (step === 4) {
            if (!formData.address.street || !formData.address.city || !formData.address.state || !formData.address.pincode) {
                setError('Please fill in all address fields');
                return false;
            }
            if (formData.address.coordinates.coordinates[0] === 0) {
                setError('Please allow location access to continue');
                return false;
            }
        }

        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        setStep(step - 1);
        setError('');
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;

        setLoading(true);
        setError('');

        const result = await register(formData, 'student');

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <BookOpen className="w-10 h-10 text-primary" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">HomeTutor</span>
                    </Link>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Register as a Student
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4].map((s) => (
                            <React.Fragment key={s}>
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${step >= s ? 'bg-primary text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`}>
                                        {s}
                                    </div>
                                    <div className={`mt-2 text-xs ${step >= s ? 'text-primary' : 'text-gray-500'}`}>
                                        {s === 1 && 'Account'}
                                        {s === 2 && 'Student Info'}
                                        {s === 3 && 'Aadhaar'}
                                        {s === 4 && 'Address'}
                                    </div>
                                </div>
                                {s < 4 && (
                                    <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <div className="card">
                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Step 1: Account Details */}
                    {step === 1 && (
                        <div className="space-y-6 animate-slideIn">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Details</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input pl-10"
                                        placeholder="Parent's full name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input pl-10"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Phone Number *
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="input pl-10"
                                        placeholder="10-digit mobile number"
                                        maxLength="10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Password *
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input pl-10"
                                        placeholder="At least 6 characters"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm Password *
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="input pl-10"
                                        placeholder="Re-enter password"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Student Details */}
                    {step === 2 && (
                        <div className="space-y-6 animate-slideIn">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Student Information</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Student Name *
                                </label>
                                <input
                                    type="text"
                                    name="studentName"
                                    value={formData.studentName}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Student's full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Class *
                                </label>
                                <select
                                    name="class"
                                    value={formData.class}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="">Select class</option>
                                    {CLASSES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Board *
                                </label>
                                <select
                                    name="board"
                                    value={formData.board}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="">Select board</option>
                                    {BOARDS.map(b => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Previous Marks (%)
                                </label>
                                <input
                                    type="number"
                                    name="previousMarks"
                                    value={formData.previousMarks}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Optional"
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Aadhaar */}
                    {step === 3 && (
                        <div className="space-y-6 animate-slideIn">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Aadhaar Verification</h3>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                    Your Aadhaar details are kept secure and are used only for verification purposes.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Aadhaar Number *
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="aadhaarNumber"
                                        value={formData.aadhaarNumber}
                                        onChange={handleChange}
                                        className="input pl-10"
                                        placeholder="12-digit Aadhaar number"
                                        maxLength="12"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Address */}
                    {step === 4 && (
                        <div className="space-y-6 animate-slideIn">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Address Details</h3>

                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                    We use your location to find tutors near you. Your exact address is never shared with tutors.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="House/Flat number, Street name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="address.city"
                                        value={formData.address.city}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="City"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        name="address.state"
                                        value={formData.address.state}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="State"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    PIN Code *
                                </label>
                                <input
                                    type="text"
                                    name="address.pincode"
                                    value={formData.address.pincode}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="6-digit PIN code"
                                    maxLength="6"
                                />
                            </div>

                            <div>
                                <button
                                    type="button"
                                    onClick={getLocation}
                                    disabled={gettingLocation}
                                    className="btn btn-secondary w-full flex items-center justify-center space-x-2"
                                >
                                    <MapPin className="w-5 h-5" />
                                    <span>
                                        {gettingLocation ? 'Getting location...' :
                                            formData.address.coordinates.coordinates[0] !== 0 ? 'Location captured ✓' : 'Get Current Location'}
                                    </span>
                                </button>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                                    Click to allow location access (required)
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-8 flex justify-between">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="btn btn-secondary"
                            >
                                Previous
                            </button>
                        )}

                        {step < 4 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="btn btn-primary ml-auto"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="btn btn-primary ml-auto"
                            >
                                {loading ? 'Creating account...' : 'Complete Registration'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:text-primary-600 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterStudent;
