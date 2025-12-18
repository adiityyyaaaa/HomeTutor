# HomeTutor Platform

A comprehensive MERN stack home tuition booking platform with real-time chat, audio calls, location-based teacher search, and Razorpay payment integration.

## Project Structure

```
hometutor/
├── backend/          # Node.js + Express backend
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth & file upload middleware
│   ├── utils/        # Helper functions
│   └── server.js     # Main server with Socket.io
└── frontend/         # React frontend
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── services/     # API and Socket.io services
    │   ├── context/      # Auth context
    │   └── utils/        # Helper functions
    └── public/
```

## Features

✅ **Backend (Completed)**
- User & Teacher authentication with JWT
- Location-based teacher search with Haversine distance
- Booking system with Razorpay integration
- Demo class workflow (payment hold/release/refund)
- Progress tracking system
- Review & rating system
- Real-time chat with Socket.io
- Audio call signaling with WebRTC
- File upload for photos, videos, and Aadhaar documents

🚧 **Frontend (In Progress)**
- Authentication context and protected routes
- API service with axios
- Socket.io client service
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

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies (already done):
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

2. Install dependencies (already done):
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
- `POST /api/auth/register/student` - Register student
- `POST /api/auth/register/teacher` - Register teacher
- `POST /api/auth/login` - Login

### Teachers
- `GET /api/teachers/search` - Search teachers with filters
- `GET /api/teachers/:id` - Get teacher profile
- `PUT /api/teachers/profile` - Update teacher profile
- `POST /api/teachers/upload-photo` - Upload profile photo
- `POST /api/teachers/upload-video` - Upload video

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings/:id/complete-demo` - Complete demo class
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `POST /api/bookings/verify-payment` - Verify Razorpay payment

### Progress
- `POST /api/progress` - Add progress entry
- `GET /api/progress/:studentId` - Get student progress
- `GET /api/progress/booking/:bookingId` - Get booking progress
- `PUT /api/progress/:id` - Update progress
- `DELETE /api/progress/:id` - Delete progress

### Reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews/teacher/:teacherId` - Get teacher reviews
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

## Next Steps

Frontend development continues with:
- Landing page
- Login and registration pages  
- Student dashboard
- Teacher dashboard
- Teacher search with filters
- Teacher profile page
- Chat interface
- Audio call component
- Progress tracking charts
- Review components

## Security Notes

- JWT tokens stored in localStorage
- Passwords hashed with bcryptjs (10 rounds)
- File upload validation (type and size)
- Rate limiting on API endpoints
- MongoDB injection prevention via Mongoose
- CORS configuration for frontend

## License

This project is for educational purposes.
