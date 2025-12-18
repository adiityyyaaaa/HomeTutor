const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Message = require('./models/Message');

// Load env vars
dotenv.config();

// Sample Data
const studentData = {
    name: "Demo Student",
    email: "student@demo.com",
    password: "password123",
    role: "student",
    phone: "9876543210",
    studentName: "Rahul Kumar",
    studentGender: "Male",
    class: "10",
    board: "CBSE",
    subjects: ["Mathematics", "Science"],
    address: {
        street: "123 Green Park",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110016",
        coordinates: {
            type: "Point",
            coordinates: [77.2090, 28.6139]
        }
    },
    aadhaarNumber: "123456789012",
    aadhaarVerified: true
};

const teacherData = {
    name: "Demo Teacher",
    email: "teacher@demo.com",
    password: "password123",
    role: "teacher",
    phone: "9876543211",
    address: {
        street: "456 Blue Ridge",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110016",
        coordinates: {
            type: "Point",
            coordinates: [77.2190, 28.6239]
        }
    },
    aadhaarNumber: "987654321098",
    aadhaarVerified: true,
    // Teacher specific fields
    photo: "https://ui-avatars.com/api/?name=Demo+Teacher&background=0D8ABC&color=fff",
    bio: "Experienced Mathematics tutor with 5 years of experience teaching CBSE and ICSE students.",
    qualifications: [
        { degree: "B.Sc Mathematics", institution: "Delhi University", year: 2018 }
    ],
    experience: 5,
    subjects: ["Mathematics", "Physics"],
    classesCanTeach: ["9", "10", "11"],
    boards: ["CBSE", "ICSE"],
    hourlyRate: 500,
    monthlyRate: 6000,
    videoIntro: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isPremium: true,
    rating: 4.8,
    totalReviews: 12,
    totalStudents: 5,
    availability: [
        {
            day: "Monday",
            slots: [
                { start: "16:00", end: "18:00" }
            ]
        },
        {
            day: "Wednesday",
            slots: [
                { start: "16:00", end: "18:00" }
            ]
        }
    ]
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        console.log('Clearing existing data and dropping indexes...');
        await User.deleteMany({});
        try {
            await Teacher.collection.dropIndexes();
            console.log('Dropped Teacher indexes');
        } catch (e) {
            console.log('No indexes to drop or error dropping:', e.message);
        }
        await Teacher.deleteMany({});
        await Booking.deleteMany({});
        await Review.deleteMany({});
        await Message.deleteMany({});

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const studentPassword = await bcrypt.hash(studentData.password, salt);
        const teacherPassword = await bcrypt.hash(teacherData.password, salt);

        // Create Student (User)
        console.log('Creating student...');
        const studentUser = await User.create({
            ...studentData,
            password: studentPassword
        });

        // Create Teacher (Teacher Model directly)
        console.log('Creating teacher...');
        const teacherUser = await Teacher.create({
            ...teacherData,
            password: teacherPassword
        });

        // Create a Sample Booking
        console.log('Creating sample booking...');
        await Booking.create({
            studentId: studentUser._id,
            teacherId: teacherUser._id,
            subject: "Mathematics",
            class: "10",
            bookingType: "monthly",
            scheduledDate: new Date(),
            scheduledTime: "16:00",
            amount: 6000,
            bookingStatus: "confirmed",
            paymentStatus: "released",
            paymentId: "pay_demo123456",
            address: {
                street: "123 Green Park",
                city: "New Delhi",
                state: "Delhi",
                pincode: "110016"
            }
        });

        // Add a review
        console.log('Adding a review...');
        const completedBooking = await Booking.create({
            studentId: studentUser._id,
            teacherId: teacherUser._id,
            subject: "Physics",
            class: "10",
            bookingType: "demo",
            scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            scheduledTime: "17:00",
            amount: 500,
            bookingStatus: "completed",
            paymentStatus: "released",
            demoCompleted: true,
            address: {
                street: "123 Green Park",
                city: "New Delhi",
                state: "Delhi",
                pincode: "110016"
            }
        });

        await Review.create({
            bookingId: completedBooking._id,
            studentId: studentUser._id,
            teacherId: teacherUser._id,
            rating: 5,
            comment: "Excellent teacher! Concepts were explained very clearly."
        });

        console.log('Data Imported Successfully!');
        console.log('-----------------------------------');
        console.log('Student Login: student@demo.com / password123');
        console.log('Teacher Login: teacher@demo.com / password123');
        console.log('-----------------------------------');
        process.exit();

    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
