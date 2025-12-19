
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Keep existing context usage
import { BookOpen, MapPin, Upload, ArrowRight, ArrowLeft, CheckCircle, Loader, X, Timer } from 'lucide-react'; // Added icons
import { isValidEmail, isValidPhone } from '../utils/helpers';
import axios from 'axios'; // For direct API calls

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const RegisterTeacher = () => {
    const { registerTeacher } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // OTP State
    const [otpState, setOtpState] = useState({
        email: { sent: false, verified: false, loading: false },
        phone: { sent: false, verified: false, loading: false }
    });
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [activeOtpType, setActiveOtpType] = useState(null); // 'email' or 'phone'
    const [otpInput, setOtpInput] = useState('');
    const [timer, setTimer] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: { street: '', city: '', state: '', pincode: '', coordinates: { coordinates: [] } },
        subjects: '',
        boards: '',
        classesCanTeach: '',
        experience: '',
        qualifications: '',
        hourlyRate: '',
        monthlyRate: '',
        aadhaarNumber: '',
        photo: null,
        aadhaarDoc: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleAddressChange = (e) => {
        setFormData({ ...formData, address: { ...formData.address, [e.target.name]: e.target.value } });
        setError(null);
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    // OTP Logic
    const handleSendOTP = async (type) => {
        const identifier = type === 'email' ? formData.email : formData.phone;

        if (type === 'email' && !isValidEmail(identifier)) {
            setError('Please enter a valid email first');
            return;
        }
        if (type === 'phone' && !isValidPhone(identifier)) {
            setError('Please enter a valid phone number first');
            return;
        }

        setOtpState(prev => ({ ...prev, [type]: { ...prev[type], loading: true } }));
        setError(null);

        try {
            await axios.post(`${API_URL}/auth/send-otp`, { identifier, type });
            setOtpState(prev => ({ ...prev, [type]: { ...prev[type], sent: true, loading: false } }));
            setActiveOtpType(type);
            setShowOtpModal(true);
            setTimer(300); // 5 minutes
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
            setOtpState(prev => ({ ...prev, [type]: { ...prev[type], loading: false } }));
        }
    };

    const handleVerifyOTP = async () => {
        const identifier = activeOtpType === 'email' ? formData.email : formData.phone;
        setLoading(true); // Reuse main loading or add local
        try {
            await axios.post(`${API_URL}/auth/verify-otp`, {
                identifier,
                type: activeOtpType,
                code: otpInput
            });

            // Success
            setOtpState(prev => ({ ...prev, [activeOtpType]: { ...prev[activeOtpType], verified: true, sent: false } }));
            setShowOtpModal(false);
            setOtpInput('');
            // Optional: Auto-save verify token? Currently backend just trusts the verified state before register
            // For now, we trust the client state + backend will eventually re-check or we assume trust for MVP
            // *Secure way*: Backend returns a temp token to include in registration. 
            // For MVP, blocking UI is decent first step, but ideal is token.
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    // Timer Effect
    React.useEffect(() => {
        let interval;
        if (showOtpModal && timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [showOtpModal, timer]);


    const getLocation = () => { /* ... existing ... */ };

    const validateStep = () => {
        setError(null);
        if (step === 1) {
            if (!formData.name || !formData.email || !formData.password || !formData.phone) {
                setError('Please fill in all required fields');
                return false;
            }
            if (!isValidEmail(formData.email)) { setError('Invalid Email'); return false; }
            if (!isValidPhone(formData.phone)) { setError('Invalid Phone'); return false; }
            if (formData.password.length < 6) { setError('Password too short'); return false; }
            if (formData.password !== formData.confirmPassword) { setError('Passwords mismatch'); return false; }

            // OTP Checks
            if (!otpState.email.verified) { setError('Please verify your Email'); return false; }
            if (!otpState.phone.verified) { setError('Please verify your Phone Number'); return false; }
        }
        /* ... existing Step 2 & 3 checks ... */
        if (step === 2) {
            if (!formData.address.street || !formData.address.city || !formData.address.state || !formData.address.pincode) {
                setError('Please fill in all location fields');
                return false;
            }
            if (!formData.subjects || !formData.boards || !formData.classesCanTeach || !formData.experience || !formData.qualifications) {
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
        return true;
    };

    /* ... handleSubmit code ... */

    /* ... UI Render ... */
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 relative">
                        <button onClick={() => setShowOtpModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-bold mb-4">Verify {activeOtpType === 'email' ? 'Email' : 'Phone'}</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Enter the 6-digit code sent to {activeOtpType === 'email' ? formData.email : formData.phone}
                        </p>

                        <input
                            type="text"
                            maxLength="6"
                            className="input text-center text-2xl tracking-widest mb-4"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            autoFocus
                        />

                        <div className="flex items-center justify-between mb-4 text-sm">
                            <span className="flex items-center text-gray-500">
                                <Timer className="w-4 h-4 mr-1" /> {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                            </span>
                            <button
                                onClick={() => handleSendOTP(activeOtpType)}
                                disabled={timer > 0}
                                className={`font-medium ${timer > 0 ? 'text-gray-300' : 'text-primary hover:underline'}`}
                            >
                                Resend OTP
                            </button>
                        </div>

                        <button onClick={handleVerifyOTP} disabled={otpInput.length !== 6 || loading} className="btn btn-primary w-full">
                            {loading ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : 'Verify Code'}
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-2xl w-full">
                {/* ... existing header ... */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <BookOpen className="w-10 h-10 text-primary" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">HomeTutor</span>
                    </Link>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Join as a Teacher & Start Earning</p>
                </div>

                <div className="card">
                    {/* ... Progress Steps ... */}
                    <div className="flex justify-between mb-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`flex items-center ${i < 3 ? 'flex-1' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= i ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>{i}</div>
                                {i < 3 && <div className={`h-1 flex-1 mx-2 ${step > i ? 'bg-primary' : 'bg-gray-200'}`}></div>}
                            </div>
                        ))}
                    </div>

                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account Details</h2>
                                <input type="text" name="name" placeholder="Full Name" className="input" value={formData.name} onChange={handleChange} required />

                                {/* Email Field with Verify */}
                                <div className="relative">
                                    <input type="email" name="email" placeholder="Email Address" className={`input ${otpState.email.verified ? 'border-green-500 pr-10' : ''}`} value={formData.email} onChange={handleChange} required disabled={otpState.email.verified} />
                                    {otpState.email.verified ? (
                                        <CheckCircle className="absolute right-3 top-3 text-green-500 w-5 h-5" />
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleSendOTP('email')}
                                            disabled={otpState.email.loading || !formData.email}
                                            className="absolute right-2 top-2 btn btn-xs btn-outline"
                                        >
                                            {otpState.email.loading ? <Loader className="w-3 h-3 animate-spin" /> : 'Verify'}
                                        </button>
                                    )}
                                </div>

                                {/* Phone Field with Verify */}
                                <div className="relative">
                                    <input type="tel" name="phone" placeholder="Phone Number" className={`input ${otpState.phone.verified ? 'border-green-500 pr-10' : ''}`} value={formData.phone} onChange={handleChange} required disabled={otpState.phone.verified} />
                                    {otpState.phone.verified ? (
                                        <CheckCircle className="absolute right-3 top-3 text-green-500 w-5 h-5" />
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleSendOTP('phone')}
                                            disabled={otpState.phone.loading || !formData.phone}
                                            className="absolute right-2 top-2 btn btn-xs btn-outline"
                                        >
                                            {otpState.phone.loading ? <Loader className="w-3 h-3 animate-spin" /> : 'Verify'}
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input type="password" name="password" placeholder="Password" className="input" value={formData.password} onChange={handleChange} required />
                                    <input type="password" name="confirmPassword" placeholder="Confirm Password" className="input" value={formData.confirmPassword} onChange={handleChange} required />
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
                                    {formData.address.coordinates.coordinates.length > 0 && <p className="text-xs text-green-600 mt-1 text-center">Location Captured!</p>}
                                </div>

                                <input
                                    type="text"
                                    name="subjects"
                                    placeholder="Subjects (e.g. Math, Physics)"
                                    className="input"
                                    value={formData.subjects}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="boards"
                                    placeholder="Boards (e.g. CBSE, ICSE)"
                                    className="input"
                                    value={formData.boards}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="classesCanTeach"
                                    placeholder="Classes (e.g. 9, 10, 11, 12)"
                                    className="input"
                                    value={formData.classesCanTeach}
                                    onChange={handleChange}
                                    required
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

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 mb-2">Upload Profile Photo</p>
                                        <input type="file" name="photo" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary hover:file:bg-primary-100" />
                                    </div>
                                </div>

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
            </div>
        </div>
    );
};

export default RegisterTeacher;
