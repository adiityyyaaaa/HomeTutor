const mongoose = require('mongoose');
const { SKILL_CATEGORIES, PREFERRED_TEACHING_MODE } = require('../utils/constants');

const userSchema = new mongoose.Schema({
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
  learnerName: {
    type: String,
    trim: true
  },
  interests: {
    type: [String],
    enum: SKILL_CATEGORIES,
    default: []
  },
  preferredTeachingMode: {
    type: String,
    enum: PREFERRED_TEACHING_MODE,
    default: 'no-preference'
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
  role: {
    type: String,
    default: 'student',
    immutable: true
  }
}, {
  timestamps: true
});

// Index for geospatial queries
userSchema.index({ 'address.coordinates': '2dsphere' });

module.exports = mongoose.model('User', userSchema);
