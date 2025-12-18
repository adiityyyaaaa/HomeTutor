# Quick Start Guide

## Running the Application

### 1. Start the Backend Server

```bash
cd /Users/adityasingh/.gemini/antigravity/scratch/hometutor/backend
npm start
```

The backend will start on `http://localhost:5000`

### 2. Start the Frontend Server (in a new terminal)

```bash
cd /Users/adityasingh/.gemini/antigravity/scratch/hometutor/frontend
npm start
```

The frontend will open automatically at `http://localhost:3000`

## Testing the Application

### 1. View Landing Page
- Open `http://localhost:3000`
- You should see the beautiful landing page with hero section

### 2. Register as a Student
- Click "Get Started" or "Register as Student"
- Fill in the 4-step registration form:
  - Account details (email, password, phone)
  - Student information (name, class, board)
  - Aadhaar number
  - Address with GPS (click "Get Current Location")
- Complete registration

### 3. Login
- Use the email and password you registered with
- You'll be redirected to the Student Dashboard

### 4. Explore Dashboard
- View your stats (bookings, completed classes)
- See recent bookings
- Access quick actions (Find Tutors, Messages)

### 5. Use Demo Credentials
If you skip registration, use these pre-created accounts:

**Student:**
- Email: `student@demo.com`
- Password: `password123`

**Teacher:**
- Email: `teacher@demo.com`
- Password: `password123`

## Current Status

✅ **Complete:**
- Backend API (100%)
- Frontend Infrastructure (100%)
- Landing Page
- Login/Register Pages
- Student Dashboard
- Teacher Dashboard

🚧 **In Progress:**
- Teacher Search with filters
- Teacher Profile with videos
- Real-time Chat interface
- Audio Call UI
- Progress Charts

## Next Development Steps

1. **Teacher Search Page** - Add filter sidebar and teacher cards
2. **Teacher Profile** - Video players, reviews, booking form
3. **Chat Interface** - Real-time messaging with Socket.io
4. **Audio Calls** - WebRTC integration
5. **Progress Charts** - Recharts implementation

## Pro Tips

- The backend MongoDB connection is already configured
- Razorpay test credentials need to be added to `.env`
- GPS location works best on HTTPS (use localhost for testing)
- Dark mode toggle can be added to navbar

---

**Project Location:**
`/Users/adityasingh/.gemini/antigravity/scratch/hometutor`

Set this as your active workspace in your IDE!
