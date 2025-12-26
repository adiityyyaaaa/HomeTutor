// Enum constants for the Anyone Can Teach platform
// Use these constants across frontend and backend for strict validation

export const SKILL_CATEGORIES = [
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

export const TEACHING_MODES = ['online', 'offline', 'hybrid'];

export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

export const ONLINE_TOOLS = [
  'Zoom',
  'Google Meet',
  'Microsoft Teams',
  'Skype',
  'Custom Platform',
  'Other'
];

export const LANGUAGES = [
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

export const SESSION_DURATIONS = [30, 45, 60, 90, 120]; // in minutes

export const BOOKING_TYPES = [
  'demo',
  'single-session',
  'package-5',
  'package-10',
  'monthly'
];

export const TRAVEL_DISTANCES = [5, 10, 15, 20, 25, 30]; // in km

export const PREFERRED_TEACHING_MODE = ['online', 'offline', 'hybrid', 'no-preference'];

// Helper function to get booking type display name
export const getBookingTypeLabel = (type) => {
  const labels = {
    'demo': 'Demo Session (Free)',
    'single-session': 'Single Session',
    'package-5': '5 Sessions Package',
    'package-10': '10 Sessions Package',
    'monthly': 'Monthly Subscription'
  };
  return labels[type] || type;
};

// Helper function to get session duration display
export const getSessionDurationLabel = (minutes) => {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = minutes / 60;
  return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
};
