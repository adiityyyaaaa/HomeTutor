const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Teacher = require('../models/Teacher');
const { protect } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Submit a review for a teacher
// @access  Private (Student only)
router.post('/', protect, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can submit reviews'
            });
        }

        const { bookingId, teacherId, rating, comment } = req.body;

        // Validate required fields
        if (!bookingId || !teacherId || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Please provide booking ID, teacher ID, and rating'
            });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Verify booking exists and is completed
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Verify booking belongs to student
        if (booking.studentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to review this booking'
            });
        }

        // Verify booking is completed
        if (booking.bookingStatus !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Can only review completed bookings'
            });
        }

        // Check if review already exists for this booking
        const existingReview = await Review.findOne({ bookingId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'Review already submitted for this booking'
            });
        }

        // Create review
        const review = await Review.create({
            bookingId,
            studentId: req.user._id,
            teacherId,
            rating,
            comment
        });

        // Update teacher's rating
        const teacher = await Teacher.findById(teacherId);
        const allReviews = await Review.find({ teacherId });

        const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
        const averageRating = totalRating / allReviews.length;

        teacher.rating = Math.round(averageRating * 10) / 10; // Round to 1 decimal
        teacher.totalReviews = allReviews.length;
        await teacher.save();

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            review
        });
    } catch (error) {
        console.error('Submit review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting review',
            error: error.message
        });
    }
});

// @route   GET /api/reviews/teacher/:teacherId
// @desc    Get all reviews for a teacher
// @access  Public
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const { sort, page = 1, limit = 10 } = req.query;

        // Build sort criteria
        let sortCriteria = { createdAt: -1 }; // Default: most recent first
        if (sort === 'highest') {
            sortCriteria = { rating: -1, createdAt: -1 };
        } else if (sort === 'lowest') {
            sortCriteria = { rating: 1, createdAt: -1 };
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get reviews
        const reviews = await Review.find({ teacherId: req.params.teacherId })
            .populate('studentId', 'name')
            .sort(sortCriteria)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Review.countDocuments({ teacherId: req.params.teacherId });

        // Get rating distribution
        const ratingDistribution = await Review.aggregate([
            { $match: { teacherId: mongoose.Types.ObjectId(req.params.teacherId) } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            ratingDistribution,
            reviews
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
});

// @route   GET /api/reviews/student/:studentId
// @desc    Get all reviews submitted by a student
// @access  Private
router.get('/student/:studentId', protect, async (req, res) => {
    try {
        // Verify user is authorized
        if (req.user._id.toString() !== req.params.studentId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these reviews'
            });
        }

        const reviews = await Review.find({ studentId: req.params.studentId })
            .populate('teacherId', 'name photo subjects')
            .populate('bookingId', 'subject class scheduledDate')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        console.error('Get student reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private (Student who created the review)
router.put('/:id', protect, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can update reviews'
            });
        }

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Verify student owns this review
        if (review.studentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review'
            });
        }

        const { rating, comment } = req.body;

        // Update review
        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 1 and 5'
                });
            }
            review.rating = rating;
        }

        if (comment !== undefined) {
            review.comment = comment;
        }

        await review.save();

        // Recalculate teacher's average rating
        const allReviews = await Review.find({ teacherId: review.teacherId });
        const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
        const averageRating = totalRating / allReviews.length;

        await Teacher.findByIdAndUpdate(review.teacherId, {
            rating: Math.round(averageRating * 10) / 10
        });

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            review
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating review',
            error: error.message
        });
    }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private (Student who created the review)
router.delete('/:id', protect, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can delete reviews'
            });
        }

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Verify student owns this review
        if (review.studentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        const teacherId = review.teacherId;
        await review.deleteOne();

        // Recalculate teacher's average rating
        const allReviews = await Review.find({ teacherId });

        if (allReviews.length > 0) {
            const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
            const averageRating = totalRating / allReviews.length;

            await Teacher.findByIdAndUpdate(teacherId, {
                rating: Math.round(averageRating * 10) / 10,
                totalReviews: allReviews.length
            });
        } else {
            await Teacher.findByIdAndUpdate(teacherId, {
                rating: 0,
                totalReviews: 0
            });
        }

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error.message
        });
    }
});

module.exports = router;
