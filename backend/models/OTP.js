const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['email', 'phone']
    },
    code: {
        type: String,
        required: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Auto-delete after 5 minutes
    }
});

// Index for faster lookups
otpSchema.index({ identifier: 1, type: 1 });

module.exports = mongoose.model('OTP', otpSchema);
