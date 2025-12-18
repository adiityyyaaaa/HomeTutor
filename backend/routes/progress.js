const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

// @route   POST /api/progress
// @desc    Add progress entry (Teacher only)
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({
                success: false,
                message: 'Only teachers can add progress entries'
            });
        }

        const {
            bookingId,
            studentId,
            date,
            topics,
            performance,
            homework,
            remarks,
            attendance,
            testScores
        } = req.body;

        // Validate required fields
        if (!bookingId || !studentId || !performance) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Verify booking exists and belongs to teacher
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.teacherId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to add progress for this booking'
            });
        }

        // Create progress entry
        const progress = await Progress.create({
            bookingId,
            studentId,
            teacherId: req.user._id,
            date: date || new Date(),
            topics: Array.isArray(topics) ? topics : [topics],
            performance,
            homework,
            remarks,
            attendance: attendance !== undefined ? attendance : true,
            testScores: testScores || []
        });

        res.status(201).json({
            success: true,
            message: 'Progress entry added successfully',
            progress
        });
    } catch (error) {
        console.error('Add progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding progress entry',
            error: error.message
        });
    }
});

// @route   GET /api/progress/:studentId
// @desc    Get all progress entries for a student
// @access  Private
router.get('/:studentId', protect, async (req, res) => {
    try {
        const { startDate, endDate, subject } = req.query;

        // Build query
        let query = { studentId: req.params.studentId };

        // Date range filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Get progress entries
        let progressEntries = await Progress.find(query)
            .populate('teacherId', 'name photo subjects')
            .populate('bookingId', 'subject class')
            .sort({ date: -1 });

        // Subject filter (filter after population)
        if (subject) {
            progressEntries = progressEntries.filter(entry =>
                entry.bookingId && entry.bookingId.subject === subject
            );
        }

        // Calculate summary statistics
        const stats = {
            totalClasses: progressEntries.length,
            attendanceRate: 0,
            performanceDistribution: {
                Excellent: 0,
                Good: 0,
                Average: 0,
                'Needs Improvement': 0
            },
            averageTestScore: 0
        };

        if (progressEntries.length > 0) {
            // Attendance rate
            const attendedClasses = progressEntries.filter(e => e.attendance).length;
            stats.attendanceRate = Math.round((attendedClasses / progressEntries.length) * 100);

            // Performance distribution
            progressEntries.forEach(entry => {
                stats.performanceDistribution[entry.performance]++;
            });

            // Average test score
            const allTestScores = progressEntries
                .flatMap(entry => entry.testScores)
                .filter(score => score.score !== undefined && score.maxScore !== undefined);

            if (allTestScores.length > 0) {
                const totalPercentage = allTestScores.reduce((sum, score) => {
                    return sum + (score.score / score.maxScore) * 100;
                }, 0);
                stats.averageTestScore = Math.round(totalPercentage / allTestScores.length);
            }
        }

        res.status(200).json({
            success: true,
            count: progressEntries.length,
            stats,
            progressEntries
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching progress entries',
            error: error.message
        });
    }
});

// @route   GET /api/progress/booking/:bookingId
// @desc    Get progress entries for a specific booking
// @access  Private
router.get('/booking/:bookingId', protect, async (req, res) => {
    try {
        const progressEntries = await Progress.find({ bookingId: req.params.bookingId })
            .populate('teacherId', 'name photo')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: progressEntries.length,
            progressEntries
        });
    } catch (error) {
        console.error('Get booking progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching progress entries',
            error: error.message
        });
    }
});

// @route   PUT /api/progress/:id
// @desc    Update progress entry
// @access  Private (Teacher only)
router.put('/:id', protect, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({
                success: false,
                message: 'Only teachers can update progress entries'
            });
        }

        const progress = await Progress.findById(req.params.id);

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'Progress entry not found'
            });
        }

        // Verify teacher owns this progress entry
        if (progress.teacherId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this progress entry'
            });
        }

        // Update fields
        const allowedUpdates = ['topics', 'performance', 'homework', 'remarks', 'attendance', 'testScores'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                progress[field] = req.body[field];
            }
        });

        await progress.save();

        res.status(200).json({
            success: true,
            message: 'Progress entry updated successfully',
            progress
        });
    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating progress entry',
            error: error.message
        });
    }
});

// @route   DELETE /api/progress/:id
// @desc    Delete progress entry
// @access  Private (Teacher only)
router.delete('/:id', protect, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({
                success: false,
                message: 'Only teachers can delete progress entries'
            });
        }

        const progress = await Progress.findById(req.params.id);

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'Progress entry not found'
            });
        }

        // Verify teacher owns this progress entry
        if (progress.teacherId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this progress entry'
            });
        }

        await progress.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Progress entry deleted successfully'
        });
    } catch (error) {
        console.error('Delete progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting progress entry',
            error: error.message
        });
    }
});

module.exports = router;
