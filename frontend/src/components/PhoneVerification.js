import React, { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../firebase';
import { Phone, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const PhoneVerification = ({ onVerified, initialValue = '' }) => {
    const [phoneNumber, setPhoneNumber] = useState(initialValue);
    const [otp, setOtp] = useState('');
    const [verificationId, setVerificationId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [verified, setVerified] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);

    useEffect(() => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                },
                'expired-callback': () => {
                    // Response expired. Ask user to solve reCAPTCHA again.
                }
            });
        }
    }, []);

    const sendOTP = async () => {
        setError('');
        setLoading(true);

        // Basic formatting: ensure +91 if missing (assuming India for now based on context)
        let formattedNumber = phoneNumber;
        if (!formattedNumber.startsWith('+')) {
            formattedNumber = '+91' + formattedNumber;
        }

        try {
            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);

            window.confirmationResult = confirmationResult;
            setVerificationId(confirmationResult.verificationId);
            setShowOtpInput(true);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setError(error.message || 'Failed to send OTP. Please try again.');
            // Reset recaptcha
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        }
    };

    const verifyOTP = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await window.confirmationResult.confirm(otp);
            const user = result.user;
            const token = await user.getIdToken();

            setVerified(true);
            setLoading(false);
            onVerified(token, user.phoneNumber);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setError('Invalid OTP. Please try again.');
        }
    };

    if (verified) {
        return (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Phone Number Verified</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Phone Number</span>
                </label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="tel"
                            placeholder="Enter phone number"
                            className="input pl-10 w-full"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={showOtpInput || loading}
                        />
                    </div>
                    {!showOtpInput && (
                        <button
                            type="button"
                            onClick={sendOTP}
                            disabled={!phoneNumber || loading}
                            className="btn btn-primary"
                        >
                            {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Send OTP'}
                        </button>
                    )}
                </div>
            </div>

            {showOtpInput && (
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Enter OTP</span>
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            className="input w-full"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={verifyOTP}
                            disabled={!otp || loading}
                            className="btn btn-success text-white"
                        >
                            {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Verify'}
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}

            <div id="recaptcha-container"></div>
        </div>
    );
};

export default PhoneVerification;
