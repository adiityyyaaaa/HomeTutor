const mongoose = require('mongoose');

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
    subject: {
        type: String,
        required: [true, 'Subject is required']
    },
    class: {
        type: String,
        required: [true, 'Class is required'],
        enum: ['LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    },
    bookingType: {
        type: String,
        required: true,
        enum: ['demo', 'monthly', 'exam-prep']
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

module.exports = mongoose.model('Booking', bookingSchema);
