const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
// const admin = require('../config/firebase'); // Import Firebase Admin
const { uploadPhoto, uploadAadhaar } = require('../middleware/upload');
const { validateEmail, validatePhone, validateAadhaar, validatePassword, validateCoordinates } = require('../utils/validation');

// Helper function to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @route   POST /api/auth/register/student
// @desc    Register a new student
// @access  Public
router.post('/register/student', uploadAadhaar.single('aadhaarDoc'), async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            studentName,
            class: studentClass,
            board,
            previousMarks,
            aadhaarNumber,

            address,
            firebaseToken // Get firebase token
        } = req.body;

        // Validate required fields (added firebaseToken)
        if (!name || !email || !password || !phone || !aadhaarNumber || !address || !firebaseToken) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields, including phone verification'
            });
        }

        // Verify Firebase Token
        let verifiedPhone;
        try {
            const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
            verifiedPhone = decodedToken.phone_number;
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Invalid or expired phone verification token' });
        }

        // Ensure verified phone matches provided phone (normalize if needed, but strict check for now)
        // Firebase returns E.164 (e.g., +919999999999). Ensure frontend sends consistent format.
        if (verifiedPhone !== phone && verifiedPhone !== `+91${phone}` && `+${phone}` !== verifiedPhone) {
            // Basic normalization check.
            // If input is 9876543210 and firebase is +919876543210, we should allow.
            if (!verifiedPhone.includes(phone)) {
                return res.status(400).json({ success: false, message: 'Phone number does not match verified number' });
            }
        }

        // Use verified phone to be safe
        // const finalPhone = verifiedPhone; 


        // Validate email format
        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Validate phone format
        if (!validatePhone(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid 10-digit phone number'
            });
        }

        // Validate Aadhaar format
        if (!validateAadhaar(aadhaarNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid 12-digit Aadhaar number'
            });
        }

        // Validate password
        if (!validatePassword(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Parse address if it's a string
        const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

        // Validate coordinates
        if (!parsedAddress.coordinates || !validateCoordinates(parsedAddress.coordinates.coordinates)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid GPS coordinates'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Check if Aadhaar is already registered
        const existingAadhaar = await User.findOne({ aadhaarNumber });
        if (existingAadhaar) {
            return res.status(400).json({
                success: false,
                message: 'This Aadhaar number is already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            studentName,
            class: studentClass,
            board,
            previousMarks,
            aadhaarNumber,
            address: parsedAddress
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering student',
            error: error.message
        });
    }
});

// @route   POST /api/auth/register/teacher
// @desc    Register a new teacher
// @access  Public
// @route   POST /api/auth/register/teacher
// @desc    Register a new teacher
// @access  Public
router.post('/register/teacher', uploadAadhaar.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'aadhaarDoc', maxCount: 1 }
]), async (req, res) => {
    try {
        console.log('Registering Teacher - Body:', req.body);
        const {
            name,
            email,
            password,
            phone,
            aadhaarNumber,
            address,
            qualifications,
            subjects,
            boards,
            classesCanTeach,
            experience,
            hourlyRate,
            monthlyRate,
            examSpecialist,
            examSpecialistRate,
            availability,
            introVideoLink,
            teachingVideoLink
            // firebaseToken
        } = req.body;


        // Validate required fields
        if (!name || !email || !password || !phone || !address || !experience || !hourlyRate || !monthlyRate) {
            console.error('Validation Error: Missing Fields', { name, email, hasPassword: !!password, phone, address, experience, hourlyRate, monthlyRate });
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Verify Firebase Token (Temporarily Disabled)
        // let verifiedPhone;
        // try {
        //     const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        //     verifiedPhone = decodedToken.phone_number;
        // } catch (error) {
        //     return res.status(401).json({ success: false, message: 'Invalid or expired phone verification token' });
        // }

        // Basic normalization check.
        // if (!verifiedPhone.includes(phone)) {
        //     return res.status(400).json({ success: false, message: 'Phone number does not match verified number' });
        // }

        // Validate email format
        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Validate phone format
        if (!validatePhone(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid 10-digit phone number'
            });
        }

        // Aadhaar validation removed

        // Validate password
        if (!validatePassword(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Parse address if it's a string
        const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

        // Parse array fields if they are strings (Multipart/form-data sends arrays as strings)
        const parsedSubjects = typeof subjects === 'string' ? JSON.parse(subjects) : subjects;
        const parsedBoards = typeof boards === 'string' ? JSON.parse(boards) : boards;
        const parsedClasses = typeof classesCanTeach === 'string' ? JSON.parse(classesCanTeach) : classesCanTeach;
        const parsedQualifications = typeof qualifications === 'string' ? JSON.parse(qualifications) : qualifications;

        // Validate coordinates
        // Default to [0,0] if missing to prevent validation error
        if (parsedAddress.coordinates && parsedAddress.coordinates.coordinates && parsedAddress.coordinates.coordinates.length === 2) {
            if (!validateCoordinates(parsedAddress.coordinates.coordinates)) {
                return res.status(400).json({ success: false, message: 'Invalid coordinates' });
            }
        } else {
            // Ensure structure matches Schema
            if (!parsedAddress.coordinates) parsedAddress.coordinates = {};
            parsedAddress.coordinates.type = 'Point';
            parsedAddress.coordinates.coordinates = [0, 0];
        }

        // Check if teacher already exists
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({
                success: false,
                message: 'Teacher with this email already exists'
            });
        }

        // Aadhaar duplicate check removed

        // Get file paths
        let photoPath = '';
        let aadhaarPath = '';

        if (req.files) {
            if (req.files.photo) {
                photoPath = req.files.photo[0].path;
            }
            if (req.files.aadhaarDoc) {
                aadhaarPath = req.files.aadhaarDoc[0].path;
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create teacher
        const teacher = await Teacher.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address: parsedAddress,
            photo: photoPath,
            qualifications: parsedQualifications,
            subjects: parsedSubjects,
            boards: parsedBoards,
            classesCanTeach: parsedClasses,
            experience,
            hourlyRate,
            monthlyRate,
            examSpecialist: examSpecialist === 'true' || examSpecialist === true,
            examSpecialistRate: examSpecialistRate || null,
            videoIntro: introVideoLink || '',
            teachingVideo: teachingVideoLink || '',
            availability: availability ? JSON.parse(availability) : []
        });

        // Generate token
        const token = generateToken(teacher._id);

        res.status(201).json({
            success: true,
            message: 'Teacher registered successfully',
            token,
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                role: teacher.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering teacher',
            error: error.message
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user (student or teacher)
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check in User collection
        let user = await User.findOne({ email }).select('+password');
        let role = 'student';

        // If not found in User, check in Teacher collection
        if (!user) {
            user = await Teacher.findOne({ email }).select('+password');
            role = 'teacher';
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
});

module.exports = router;
