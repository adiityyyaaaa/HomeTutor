const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');
const Razorpay = require('razorpay');

// Initialize Razorpay
// Note: Errors here will be caught when using instance methods
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'mock_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret'
});

const COMMISSION_RATE = 0.08; // 8% Platform Fee

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can create bookings'
            });
        }

        const {
            teacherId,
            subject,
            class: bookingClass,
            bookingType,
            scheduledDate,
            scheduledTime,
            duration,
            amount,
            address,
            notes
        } = req.body;

        // Validate required fields
        if (!teacherId || !subject || !bookingClass || !bookingType || !scheduledDate || !scheduledTime || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required booking details'
            });
        }

        // Check if teacher exists
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        // Check for scheduling conflicts
        const conflictingBooking = await Booking.findOne({
            teacherId,
            scheduledDate: new Date(scheduledDate),
            scheduledTime,
            bookingStatus: { $in: ['pending', 'confirmed'] }
        });

        if (conflictingBooking) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked'
            });
        }

        // Create Razorpay order
        let razorpayOrderId = null;
        let paymentStatus = 'pending';

        try {
            const razorpayOrder = await razorpay.orders.create({
                amount: amount * 100, // Convert to paise
                currency: 'INR',
                receipt: `booking_${Date.now()}`,
                notes: {
                    bookingType,
                    teacherId: teacherId.toString(),
                    studentId: req.user._id.toString()
                }
            });

            razorpayOrderId = razorpayOrder.id;
        } catch (razorpayError) {
            console.warn('Razorpay order creation failed (likely invalid keys). Using Mock ID for development.');
            razorpayOrderId = `order_mock_${Date.now()}`;
        }

        // For demo bookings, payment should be held
        if (bookingType === 'demo') {
            paymentStatus = 'held';
        }

        // Create booking
        const booking = await Booking.create({
            studentId: req.user._id,
            teacherId,
            subject,
            class: bookingClass,
            bookingType,
            scheduledDate: new Date(scheduledDate),
            scheduledTime,
            duration: duration || 60,
            amount,
            paymentStatus,
            razorpayOrderId,
            bookingStatus: 'pending',
            address,
            notes
        });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking,
            razorpayOrderId
        });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
});

// @route   POST /api/bookings/verify-payment
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify-payment', protect, async (req, res) => {
    try {
        const { bookingId, razorpayPaymentId, razorpaySignature } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Verify payment signature (Skipped if using Mock Order ID)
        if (booking.razorpayOrderId && booking.razorpayOrderId.startsWith('order_mock_')) {
            console.log('Skipping signature verification for Mock Order');
        } else {
            // In production, uncomment signature verification

            const crypto = require('crypto');
            const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(booking.razorpayOrderId + '|' + razorpayPaymentId)
                .digest('hex');

            if (generatedSignature !== razorpaySignature) {
                return res.status(400).json({ success: false, message: 'Payment verification failed' });
            }

        }

        // Update booking with payment details
        booking.razorpayPaymentId = razorpayPaymentId || `pay_mock_${Date.now()}`;
        booking.bookingStatus = 'confirmed';

        console.log('Payment verified. Updating booking:', booking._id, 'to confirmed');

        // Record Student Transaction (Debit)
        const studentTx = await Transaction.create({
            userId: req.user._id,
            userRole: 'student',
            amount: booking.amount,
            type: 'debit',
            description: `Payment for ${booking.subject} class with Tutor`,
            bookingId: booking._id,
            status: 'completed',
            razorpayPaymentId: booking.razorpayPaymentId
        });
        console.log('Student Transaction created:', studentTx._id);

        if (booking.bookingType === 'demo') {
            booking.paymentStatus = 'held';
            console.log('Demo booking payment held');
        } else {
            booking.paymentStatus = 'released';

            // Calculate earnings (92% to teacher)
            const teacherEarnings = booking.amount * (1 - COMMISSION_RATE);

            // Update Teacher Wallet
            const teacher = await Teacher.findById(booking.teacherId);
            teacher.walletBalance += teacherEarnings;
            await teacher.save();
            console.log('Teacher wallet updated:', teacher.walletBalance);

            // Record Teacher Transaction (Credit)
            await Transaction.create({
                userId: booking.teacherId,
                userRole: 'teacher',
                amount: teacherEarnings,
                type: 'credit',
                description: `Earnings from ${booking.subject} class (Student: ${req.user.name})`,
                bookingId: booking._id,
                status: 'completed',
                balanceAfter: teacher.walletBalance
            });
        }

        await booking.save();
        console.log('Booking saved successfully');

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            booking
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            error: error.message
        });
    }
});

// @route   GET /api/bookings
// @desc    Get all bookings for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let bookings;

        if (req.user.role === 'student') {
            bookings = await Booking.find({ studentId: req.user._id })
                .populate('teacherId', 'name photo subjects rating')
                .sort({ createdAt: -1 });
        } else if (req.user.role === 'teacher') {
            bookings = await Booking.find({ teacherId: req.user._id })
                .populate('studentId', 'name phone studentName class')
                .sort({ createdAt: -1 });
        }

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('studentId', 'name email phone studentName class')
            .populate('teacherId', 'name email phone subjects photo');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user is authorized to view this booking
        if (booking.studentId._id.toString() !== req.user._id.toString() &&
            booking.teacherId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this booking'
            });
        }

        res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
});

// @route   POST /api/bookings/:id/complete-demo
// @desc    Complete demo and mark satisfaction
// @access  Private (Student only)
router.post('/:id/complete-demo', protect, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can complete demo evaluation'
            });
        }

        const { satisfactory } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Verify it's the student's booking
        if (booking.studentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to complete this demo'
            });
        }

        // Verify it's a demo booking
        if (booking.bookingType !== 'demo') {
            return res.status(400).json({
                success: false,
                message: 'This is not a demo booking'
            });
        }

        // Update booking
        booking.demoCompleted = true;
        booking.demoSatisfactory = satisfactory;

        if (satisfactory) {
            // Release payment to teacher
            booking.paymentStatus = 'released';
            booking.bookingStatus = 'completed';

            // Calculate earnings (92% to teacher)
            const teacherEarnings = booking.amount * (1 - COMMISSION_RATE);

            // Update Teacher Wallet
            const teacher = await Teacher.findById(booking.teacherId);
            teacher.walletBalance += teacherEarnings;
            // Update teacher stats
            teacher.totalStudents += 1;
            await teacher.save();

            // Record Teacher Transaction (Credit)
            await Transaction.create({
                userId: booking.teacherId,
                userRole: 'teacher',
                amount: teacherEarnings,
                type: 'credit',
                description: `Earnings from Demo Class (Student: ${req.user.name})`,
                bookingId: booking._id,
                status: 'completed',
                balanceAfter: teacher.walletBalance
            });

        } else {
            // Refund payment
            booking.paymentStatus = 'refunded';
            booking.bookingStatus = 'cancelled';

            // Record Student Refund Transaction
            await Transaction.create({
                userId: req.user._id,
                userRole: 'student',
                amount: booking.amount,
                type: 'credit',
                description: `Refund for Unsatisfactory Demo`,
                bookingId: booking._id,
                status: 'completed'
            });

            // Initiate refund via Razorpay (Mock if needed)
            try {
                if (booking.razorpayPaymentId && !booking.razorpayPaymentId.startsWith('pay_mock_')) {
                    await razorpay.payments.refund(booking.razorpayPaymentId, {
                        amount: booking.amount * 100 // Full refund
                    });
                } else {
                    console.log('Skipping Razorpay refund for Mock Payment');
                }
            } catch (refundError) {
                console.error('Razorpay refund error:', refundError);
            }
        }

        // Create notification for teacher (Unchanged)
        const Notification = require('../models/Notification');
        await Notification.create({
            recipient: booking.teacherId,
            message: satisfactory
                ? `Demo with ${req.user.name} marked as Satisfactory. Payment released.`
                : `Demo with ${req.user.name} marked as Unsatisfactory. Booking cancelled.`,
            type: satisfactory ? 'success' : 'error',
            relatedBookingId: booking._id
        });

        await booking.save();

        res.status(200).json({
            success: true,
            message: satisfactory ? 'Demo marked as satisfactory' : 'Booking cancelled and refund initiated',
            booking
        });
    } catch (error) {
        console.error('Demo completion error:', error);
        res.status(500).json({
            success: false,
            message: 'Error completing demo',
            error: error.message
        });
    }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check authorization
        if (booking.studentId.toString() !== req.user._id.toString() &&
            booking.teacherId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        // Check if booking can be cancelled
        if (booking.bookingStatus === 'completed' || booking.bookingStatus === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel this booking'
            });
        }

        // Update booking status
        booking.bookingStatus = 'cancelled';

        // Initiate refund if payment was made
        if (booking.paymentStatus === 'held' || booking.paymentStatus === 'released') {
            booking.paymentStatus = 'refunded';

            // Record Refund Transaction for relevant party
            // If student cancelled, maybe deduct fee? For now full refund.
            await Transaction.create({
                userId: booking.studentId,
                userRole: 'student',
                amount: booking.amount,
                type: 'credit',
                description: `Refund for Cancelled Class`,
                bookingId: booking._id,
                status: 'completed'
            });

            // If teacher already got paid (released), we need to revert wallet?
            // Simplification: bookings are 'released' instantly for non-demo. 
            // If teacher cancels, we should deduct. 
            // MVP: Assuming cancellation happens before class.
            // If released, we need to debit teacher wallet.

            if (booking.paymentStatus === 'released') {
                const teacherEarnings = booking.amount * (1 - COMMISSION_RATE);
                const teacher = await Teacher.findById(booking.teacherId);
                teacher.walletBalance -= teacherEarnings;
                await teacher.save();

                await Transaction.create({
                    userId: booking.teacherId,
                    userRole: 'teacher',
                    amount: teacherEarnings,
                    type: 'debit',
                    description: `Reversal for Cancelled Class`,
                    bookingId: booking._id,
                    status: 'completed',
                    balanceAfter: teacher.walletBalance
                });
            }

            try {
                if (booking.razorpayPaymentId && !booking.razorpayPaymentId.startsWith('pay_mock_')) {
                    await razorpay.payments.refund(booking.razorpayPaymentId, {
                        amount: booking.amount * 100
                    });
                }
            } catch (refundError) {
                console.error('Razorpay refund error:', refundError);
            }
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            booking
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error.message
        });
    }
});

module.exports = router;
