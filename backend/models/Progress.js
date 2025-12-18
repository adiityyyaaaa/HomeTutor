const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
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
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now
    },
    topics: [{
        type: String,
        required: true
    }],
    performance: {
        type: String,
        enum: ['Excellent', 'Good', 'Average', 'Needs Improvement'],
        required: [true, 'Performance rating is required']
    },
    homework: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    remarks: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    attendance: {
        type: Boolean,
        required: true,
        default: true
    },
    testScores: [{
        subject: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true,
            min: 0
        },
        maxScore: {
            type: Number,
            required: true,
            min: 0
        }
    }]
}, {
    timestamps: true
});

// Indexes for queries
progressSchema.index({ studentId: 1, date: -1 });
progressSchema.index({ teacherId: 1, date: -1 });
progressSchema.index({ bookingId: 1 });

module.exports = mongoose.model('Progress', progressSchema);
