const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   PUT /api/users/profile
// @desc    Update student profile
// @access  Private (Student only)
router.put('/profile', protect, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can update student profiles'
            });
        }

        const updates = req.body;

        // Prevent updating sensitive or immutable fields
        delete updates.password;
        delete updates.email;
        delete updates.role;
        delete updates.aadhaarNumber;
        delete updates.aadhaarVerified;
        delete updates._id;

        // Parse address if string
        if (typeof updates.address === 'string') {
            try {
                updates.address = JSON.parse(updates.address);
            } catch (e) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid address format'
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                studentName: user.studentName,
                class: user.class,
                board: user.board,
                address: user.address,
                previousMarks: user.previousMarks
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
});

// @route   GET /api/users/profile
// @desc    Get current student profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
});

module.exports = router;
