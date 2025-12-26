const mongoose = require('mongoose');
const { SKILL_CATEGORIES, TEACHING_MODES, SKILL_LEVELS, ONLINE_TOOLS, LANGUAGES, SESSION_DURATIONS } = require('../utils/constants');

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
    // Skills and Categories (replacing academic subjects)
    skills: {
        type: [String],
        required: [true, 'At least one skill is required'],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'Please add at least one skill you can teach'
        }
    },
    skillCategories: {
        type: [String],
        required: [true, 'At least one skill category is required'],
        enum: SKILL_CATEGORIES,
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'Please select at least one skill category'
        }
    },
    skillLevels: {
        type: [String],
        required: [true, 'Skill level is required'],
        enum: SKILL_LEVELS,
        default: ['All Levels']
    },
    // Teaching Modes
    teachingModes: {
        type: [String],
        required: [true, 'At least one teaching mode is required'],
        enum: TEACHING_MODES,
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'Please select at least one teaching mode'
        }
    },
    onlineTools: {
        type: [String],
        enum: ONLINE_TOOLS,
        default: []
    },
    maxTravelDistance: {
        type: Number, // in km
        default: 10,
        min: 0,
        max: 50
    },
    // Qualifications (more flexible than before)
    qualifications: [{
        title: {
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
        },
        description: String
    }],
    portfolio: [{
        title: String,
        url: String,
        description: String
    }],
    experience: {
        type: Number, // in years
        required: [true, 'Experience is required'],
        min: 0
    },
    languages: {
        type: [String],
        required: [true, 'At least one language is required'],
        enum: LANGUAGES,
        default: ['English']
    },
    // Videos
    videoIntro: {
        type: String, // URL or file path
        default: ''
    },
    teachingVideo: {
        type: String, // URL or file path for demo
        default: ''
    },
    // Pricing
    ratePerSession: {
        type: Number,
        required: [true, 'Rate per session is required'],
        min: 0
    },
    sessionDuration: {
        type: Number, // in minutes
        required: true,
        enum: SESSION_DURATIONS,
        default: 60
    },
    // Ratings and Stats
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
    // Availability
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
    // Status and Premium
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

// Index for geospatial queries (only relevant for offline/hybrid teaching)
teacherSchema.index({ 'address.coordinates': '2dsphere' });
teacherSchema.index({ skillCategories: 1, rating: -1 });
teacherSchema.index({ teachingModes: 1 });

module.exports = mongoose.model('Teacher', teacherSchema);
