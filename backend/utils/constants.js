// Backend enum constants for validation
// Keep these in sync with frontend/src/utils/constants.js

const SKILL_CATEGORIES = [
    'Music & Audio',
    'Arts & Crafts',
    'Cooking & Baking',
    'Fitness & Yoga',
    'Dance',
    'Sports & Games',
    'Technology & Programming',
    'Languages',
    'Photography & Video',
    'Business & Marketing',
    'Writing & Content',
    'Design & Graphics',
    'Personal Development',
    'Academic Subjects',
    'Test Preparation',
    'Other'
];

const TEACHING_MODES = ['online', 'offline', 'hybrid'];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const ONLINE_TOOLS = [
    'Zoom',
    'Google Meet',
    'Microsoft Teams',
    'Skype',
    'Custom Platform',
    'Other'
];

const LANGUAGES = [
    'English',
    'Hindi',
    'Bengali',
    'Telugu',
    'Marathi',
    'Tamil',
    'Gujarati',
    'Kannada',
    'Malayalam',
    'Punjabi',
    'Odia',
    'Urdu',
    'Other'
];

const SESSION_DURATIONS = [30, 45, 60, 90, 120]; // in minutes

const BOOKING_TYPES = [
    'demo',
    'single-session',
    'package-5',
    'package-10',
    'monthly'
];

const TRAVEL_DISTANCES = [5, 10, 15, 20, 25, 30]; // in km

const PREFERRED_TEACHING_MODE = ['online', 'offline', 'hybrid', 'no-preference'];

module.exports = {
    SKILL_CATEGORIES,
    TEACHING_MODES,
    SKILL_LEVELS,
    ONLINE_TOOLS,
    LANGUAGES,
    SESSION_DURATIONS,
    BOOKING_TYPES,
    TRAVEL_DISTANCES,
    PREFERRED_TEACHING_MODE
};
