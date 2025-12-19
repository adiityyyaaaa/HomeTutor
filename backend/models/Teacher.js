const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    photo: {
        type: String, // URL or file path
        default: ''
    },
    aadhaarPhoto: {
        type: String, // URL or file path
        default: ''
    },
    aadhaarNumber: {
        type: String,
        default: '',
        trim: true
    },
    aadhaarVerified: {
        type: Boolean,
        default: false
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            }
        }
    },
    qualifications: [{
        degree: {
            type: String,
            required: true
        },
        institution: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        }
    }],
    subjects: {
        type: [String],
        required: true
    },
    boards: {
        type: [String],
        required: true
    },
    classesCanTeach: {
        type: [String],
        required: true,
        enum: ['LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    },
    experience: {
        type: Number, // in years
        required: [true, 'Experience is required'],
        min: 0
    },
    videoIntro: {
        type: String, // URL or file path
        default: ''
    },
    teachingVideo: {
        type: String, // URL or file path for demo
        default: ''
    },
    hourlyRate: {
        type: Number,
        required: [true, 'Hourly rate is required'],
        min: 0
    },
    monthlyRate: {
        type: Number,
        required: [true, 'Monthly rate is required'],
        min: 0
    },
    examSpecialist: {
        type: Boolean,
        default: false
    },
    examSpecialistRate: {
        type: Number,
        min: 10000,
        max: 15000,
        default: null
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    totalStudents: {
        type: Number,
        default: 0
    },
    availability: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true
        },
        slots: [{
            start: {
                type: String, // Format: "HH:MM"
                required: true
            },
            end: {
                type: String, // Format: "HH:MM"
                required: true
            }
        }]
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    promotionActive: {
        type: Boolean,
        default: false
    },
    promotionExpiry: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        default: 'teacher',
        immutable: true
    },
    walletBalance: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

// Index for geospatial queries
teacherSchema.index({ 'address.coordinates': '2dsphere' });
// teacherSchema.index({ subjects: 1, boards: 1, rating: -1 }); // Commented out due to parallel array indexing limitation

module.exports = mongoose.model('Teacher', teacherSchema);
