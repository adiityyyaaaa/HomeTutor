const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const OTP = require('../models/OTP');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Initialize Providers
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Rate Limiting Logic (Simple In-Memory or Database query)
const checkRateLimit = async (identifier) => {
    // Count OTPs generated in last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const count = await OTP.countDocuments({
        identifier: identifier,
        createdAt: { $gte: tenMinutesAgo }
    });
    return count >= 3;
};

// Generate Random 6-digit Code
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash OTP
const hashOTP = (otp) => {
    return crypto.createHash('sha256').update(otp).digest('hex');
};

// @route   POST /auth/send-otp
// @desc    Send OTP to Email or Phone
router.post('/send-otp', async (req, res) => {
    const { identifier, type } = req.body; // type: 'email' or 'phone'

    if (!identifier || !type) {
        return res.status(400).json({ success: false, message: 'Identifier and type are required' });
    }

    try {
        // 1. Check Rate Limit
        if (await checkRateLimit(identifier)) {
            return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
        }

        // 2. Invalidate Old OTPs for this identifier/type
        await OTP.deleteMany({ identifier, type });

        // 3. Generate Code
        const code = generateOTP();
        const hashedCode = hashOTP(code);

        // 4. Send Code
        if (type === 'email') {
            await transporter.sendMail({
                from: `"HomeTutor" <${process.env.EMAIL_USER}>`,
                to: identifier,
                subject: 'Your Verification Code',
                text: `Your OTP for HomeTutor registration is: ${code}. It expires in 5 minutes.`
            });
        } else if (type === 'phone') {
            if (!twilioClient) {
                // Mock for dev if keys missing
                console.log(`[Twilio Mock] Sending SMS to ${identifier}: ${code}`);
            } else {
                await twilioClient.messages.create({
                    body: `Your HomeTutor verification code is: ${code}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: identifier // Ensure format is E.164 (e.g. +91...)
                });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Invalid type' });
        }

        // 5. Save securely
        await OTP.create({
            identifier,
            type,
            code: hashedCode
        });

        res.json({ success: true, message: `OTP sent to ${type}` });

    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

// @route   POST /auth/verify-otp
// @desc    Verify the Code
router.post('/verify-otp', async (req, res) => {
    const { identifier, type, code } = req.body;

    if (!identifier || !type || !code) {
        return res.status(400).json({ success: false, message: 'Missing parameters' });
    }

    try {
        const otpRecord = await OTP.findOne({ identifier, type });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'OTP expired or not found' });
        }

        // Check attempts
        if (otpRecord.attempts >= 5) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ success: false, message: 'Too many failed attempts. Request a new OTP.' });
        }

        // Verify Hash
        const hashedInput = hashOTP(code);
        if (hashedInput === otpRecord.code) {
            // Success
            await OTP.deleteOne({ _id: otpRecord._id }); // Single use
            return res.json({ success: true, message: 'Verified successfully' });
        } else {
            // Increment attempts
            otpRecord.attempts += 1;
            await otpRecord.save();
            return res.status(400).json({ success: false, message: 'Invalid OTP code' });
        }

    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ success: false, message: 'Verification failed' });
    }
});

module.exports = router;
