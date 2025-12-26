# TutorX Platform

A comprehensive MERN stack marketplace connecting learners with expert instructors. Learn any skill or teach what you know best. Support for online, offline, and hybrid modes with real-time chat, audio calls, and secure payments.

## Platform Vision

**"Learn Anything. Teach Anything."** - Master new skills from expert instructors, or monetize your expertise by teaching others. From music to coding, cooking to yoga - connect, learn, and grow together on our platform.

## Project Structure

```
tutorx/
├── backend/          # Node.js + Express backend
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth & file upload middleware
│   ├── utils/        # Helper functions & constants
│   └── server.js     # Main server with Socket.io
└── frontend/         # React frontend
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── services/     # API and Socket.io services
    │   ├── context/      # Auth context
    │   └── utils/        # Helper functions & constants
    └── public/
```

## Features

✅ **Backend (Completed)**
- Instructor & Learner authentication with JWT
- Skill-based instructor profiles with categories
- Teaching modes: Online, Offline, Hybrid
- Location-based search (for offline/hybrid)
- Booking system with Razorpay integration
- Session packages (demo, single, 5-pack, 10-pack, monthly)
- Progress tracking system
- Review & rating system
- Real-time chat with Socket.io
- Audio call signaling with WebRTC
- File upload for photos and videos

🚧 **Frontend (In Progress)**
- ✅ Landing page with new "Anyone Can Teach" messaging
- Authentication context and protected routes
- API service with axios
- Socket.io client service
- Skill-based search and filters
- Teaching mode selection
- UI pages and components (to be completed)

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- Socket.io for real-time features
- JWT for authentication
- Razorpay for payments
- Multer for file uploads
- bcryptjs for password hashing

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios for API calls
- Socket.io-client
- Simple-peer for WebRTC
- Recharts for analytics
- Lucide React for icons

## Skill Categories

The platform supports 16+ skill categories:
- Music & Audio
- Arts & Crafts
- Cooking & Baking
- Fitness & Yoga
- Dance
- Sports & Games
- Technology & Programming
- Languages
- Photography & Video
- Business & Marketing
- Writing & Content
- Design & Graphics
- Personal Development
- Academic Subjects
- Test Preparation
- Other

## Teaching Modes

Instructors can choose how they want to teach:
- **Online**: Virtual classes via Zoom, Google Meet, etc.
- **Offline**: In-person sessions at learner's location
- **Hybrid**: Both online and offline options

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
MONGODB_URI=mongodb+srv://name:pass@xyz.mongodb.net/db_name
JWT_SECRET=your_jwt_secret_key_change_this_in_production_min_32_chars
JWT_EXPIRE=30d
PORT=5000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register/student` - Register learner
- `POST /api/auth/register/teacher` - Register instructor
- `POST /api/auth/login` - Login

### Instructors
- `GET /api/teachers/search` - Search instructors with filters
- `GET /api/teachers/:id` - Get instructor profile
- `PUT /api/teachers/profile` - Update instructor profile
- `POST /api/teachers/upload-photo` - Upload profile photo
- `POST /api/teachers/upload-video` - Upload video

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings/:id/complete-demo` - Complete demo session
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `POST /api/bookings/verify-payment` - Verify Razorpay payment

### Progress
- `POST /api/progress` - Add progress entry
- `GET /api/progress/:studentId` - Get learner progress
- `GET /api/progress/booking/:bookingId` - Get booking progress
- `PUT /api/progress/:id` - Update progress
- `DELETE /api/progress/:id` - Delete progress

### Reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews/teacher/:teacherId` - Get instructor reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:userId` - Get conversation
- `GET /api/messages/conversations/list` - Get all conversations
- `PUT /api/messages/:id/read` - Mark as read
- `PUT /api/messages/conversation/:userId/read-all` - Mark all as read

## Socket.io Events

### Chat
- `join` - Join user's room
- `send-message` - Send message
- `receive-message` - Receive message
- `typing` - Typing indicator
- `stop-typing` - Stop typing
- `read-receipt` - Read receipt

### Audio Calls
- `call-user` - Initiate call
- `incoming-call` - Receive call
- `accept-call` - Accept call
- `reject-call` - Reject call
- `ice-candidate` - WebRTC ICE candidate
- `end-call` - End call

### Status
- `user-online` - User came online
- `user-offline` - User went offline

## Key Changes from Previous Version

### Data Model Transformation
- **Subjects → Skills**: Open-ended skill names instead of academic subjects
- **Classes → Skill Levels**: Beginner, Intermediate, Advanced, All Levels
- **Boards → Skill Categories**: 16+ predefined categories
- **Teaching Modes**: Added online/offline/hybrid support
- **Removed Aadhaar**: Completely removed verification requirement
- **Session Packages**: Demo, single, 5-pack, 10-pack, monthly options

### Platform Rebranding
- **HomeTutor → TutorX**
- **Students → Learners**
- **Tutors → Instructors**
- Focus on balanced two-sided marketplace for both learners and instructors

## Next Steps

Frontend development continues with:
- Instructor registration with skill categories
- Skill-based search with teaching mode filters
- Booking flow with mode selection
- Instructor profile with portfolio
- Session package selection
- Online meeting link integration
- Progress tracking charts
- Review components

## Security Notes

- JWT tokens stored in localStorage
- Passwords hashed with bcryptjs (10 rounds)
- File upload validation (type and size)
- Rate limiting on API endpoints
- MongoDB injection prevention via Mongoose
- CORS configuration for frontend
- Strict enum validation to prevent input errors

## License

This project is for educational purposes.

