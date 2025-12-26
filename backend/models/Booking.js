const mongoose = require('mongoose');
const { SKILL_LEVELS, TEACHING_MODES, BOOKING_TYPES } = require('../utils/constants');

const bookingSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    skill: {
        type: String,
        required: [true, 'Skill is required']
    },
    skillLevel: {
        type: String,
        required: [true, 'Skill level is required'],
        enum: SKILL_LEVELS
    },
    bookingType: {
        type: String,
        required: true,
        enum: BOOKING_TYPES
    },
    teachingMode: {
        type: String,
        required: [true, 'Teaching mode is required'],
        enum: TEACHING_MODES
    },
    meetingLink: {
        type: String,
        default: null
    },
    meetingPlatform: {
        type: String,
        default: null
    },
    scheduledDate: {
        type: Date,
        required: [true, 'Scheduled date is required']
    },
    scheduledTime: {
        type: String, // Format: "HH:MM"
        required: [true, 'Scheduled time is required']
    },
    duration: {
        type: Number, // in minutes
        default: 60
    },
    sessionCount: {
        type: Number,
        default: 1
    },
    sessionsCompleted: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: 0
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'held', 'released', 'refunded'],
        default: 'pending'
    },
    razorpayOrderId: {
        type: String,
        default: null
    },
    razorpayPaymentId: {
        type: String,
        default: null
    },
    bookingStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    demoCompleted: {
        type: Boolean,
        default: false
    },
    demoSatisfactory: {
        type: Boolean,
        default: null
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
bookingSchema.index({ studentId: 1, bookingStatus: 1 });
bookingSchema.index({ teacherId: 1, bookingStatus: 1 });
bookingSchema.index({ scheduledDate: 1 });
bookingSchema.index({ teachingMode: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
