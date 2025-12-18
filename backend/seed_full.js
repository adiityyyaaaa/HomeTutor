const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Transaction = require('./models/Transaction');

dotenv.config();

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'History', 'Geography'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'];

const sampleBios = [
    "Passionate educator with 5+ years of experience.",
    "Making complex concepts simple for students.",
    "Specialized in exam preparation and competitive exams.",
    "Patient and student-centric approach to teaching.",
    "PhD scholar helping students achieve academic excellence."
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Teacher.deleteMany({});
        await Booking.deleteMany({});
        await Review.deleteMany({});
        await Transaction.deleteMany({});

        const hashedPassword = await bcrypt.hash('password123', 10);

        console.log('Creating Students...');
        const students = [];
        for (let i = 1; i <= 5; i++) {
            const student = await User.create({
                name: `Student ${i}`,
                email: `student${i}@example.com`,
                password: hashedPassword,
                role: 'student',
                phone: `900000000${i}`,
                class: `${9 + (i % 4)}`, // 9, 10, 11, 12
                aadhaarNumber: `10000000000${i}`,
                address: {
                    street: "123 Student Lane",
                    city: cities[i % cities.length],
                    state: "Maharashtra",
                    pincode: "400001",
                    coordinates: {
                        type: "Point",
                        coordinates: [72.8777, 19.0760] // [lng, lat]
                    }
                }
            });
            students.push(student);
        }

        // Create specific demo student
        const demoStudent = await User.create({
            name: "Demo Student",
            email: "student@demo.com",
            password: hashedPassword,
            role: 'student',
            phone: "9999999999",
            class: "10",
            aadhaarNumber: "100000000099",
            address: {
                street: "Demo St",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: "400001",
                coordinates: {
                    type: "Point",
                    coordinates: [72.8777, 19.0760]
                }
            }
        });
        students.push(demoStudent);

        console.log('Creating Teachers...');
        const teachers = [];
        for (let i = 1; i <= 10; i++) {
            const subject = subjects[i % subjects.length];
            const city = cities[i % cities.length];

            // Create Teacher directly (Separate collection, contains all fields)
            const teacher = await Teacher.create({
                name: `Teacher ${i} - ${subject}`,
                email: `teacher${i}@example.com`,
                password: hashedPassword,
                role: 'teacher',
                phone: `980000000${i}`,
                aadhaarNumber: `20000000000${i}`,
                address: {
                    street: `${i} Main St`,
                    city: city,
                    state: 'Maharashtra',
                    pincode: '400001',
                    coordinates: { type: "Point", coordinates: [72.8777, 19.0760] }
                },
                bio: sampleBios[i % sampleBios.length],
                experience: 2 + i,
                qualifications: [{
                    degree: "master",
                    institution: "IIT",
                    year: 2018
                }],
                subjects: [subject, subjects[(i + 1) % subjects.length]],
                boards: ['CBSE', 'ICSE'],
                classesCanTeach: ['9', '10', '11', '12'],
                hourlyRate: 300 + (i * 50),
                monthlyRate: 3000 + (i * 500),
                availability: [
                    {
                        day: "Monday",
                        slots: [{ start: "16:00", end: "20:00" }]
                    },
                    {
                        day: "Wednesday",
                        slots: [{ start: "16:00", end: "20:00" }]
                    },
                    {
                        day: "Saturday",
                        slots: [{ start: "10:00", end: "18:00" }]
                    }
                ],
                isVerified: true,
                rating: 4 + (i % 10) / 10,
                totalReviews: Math.floor(Math.random() * 20) + 1,
                totalStudents: Math.floor(Math.random() * 50) + 5,
                walletBalance: 0
            });
            teachers.push(teacher);
        }

        // Create specific Payment Test Teacher
        const paymentTestTeacher = await Teacher.create({
            name: "Payment Test Teacher",
            email: "payment_test@teacher.com",
            password: hashedPassword,
            role: 'teacher',
            phone: "9876543210",
            aadhaarNumber: "999999999999",
            address: {
                street: "123 Tech Park",
                city: "Bangalore",
                state: "Karnataka",
                pincode: "560001",
                coordinates: { type: "Point", coordinates: [77.5946, 12.9716] }
            },
            bio: "Dedicated teacher for payment flow testing.",
            experience: 5,
            qualifications: [{ degree: "PhD", institution: "IISc", year: 2020 }],
            subjects: ["Mathematics", "Physics"],
            boards: ["CBSE"],
            classesCanTeach: ["10", "11", "12"],
            hourlyRate: 500,
            monthlyRate: 5000,
            isVerified: true,
            walletBalance: 1500,
            availability: [
                { day: "Monday", slots: [{ start: "09:00", end: "18:00" }] },
                { day: "Tuesday", slots: [{ start: "09:00", end: "18:00" }] },
                { day: "Wednesday", slots: [{ start: "09:00", end: "18:00" }] },
                { day: "Thursday", slots: [{ start: "09:00", end: "18:00" }] },
                { day: "Friday", slots: [{ start: "09:00", end: "18:00" }] }
            ]
        });
        teachers.push(paymentTestTeacher);

        console.log('Creating Bookings & Transactions...');
        // Create a few bookings for the demo student
        const demoTeacher = teachers[0];

        // 1. Completed Booking
        await Booking.create({
            teacherId: demoTeacher._id,
            studentId: demoStudent._id,
            subject: demoTeacher.subjects[0],
            class: "10", // Added class
            scheduledDate: new Date(Date.now() - 86400000), // Added Date
            scheduledTime: "10:00", // Added Time
            date: new Date(Date.now() - 86400000), // Backwards compatibility if needed
            timeSlot: "10:00 - 11:00",
            bookingType: "monthly", // Fixed Enum
            amount: demoTeacher.hourlyRate,
            bookingStatus: "completed", // fixed enum match
            paymentStatus: "released", // Fixed Enum
            razorpayPaymentId: "pay_mock_completed"
        });

        // 2. Upcoming Booking
        await Booking.create({
            teacherId: demoTeacher._id,
            studentId: demoStudent._id,
            subject: demoTeacher.subjects[0],
            class: "10",
            scheduledDate: new Date(Date.now() + 86400000),
            scheduledTime: "16:00",
            date: new Date(Date.now() + 86400000),
            timeSlot: "16:00 - 17:00",
            bookingType: "monthly", // Fixed Enum
            amount: demoTeacher.hourlyRate,
            bookingStatus: "confirmed", // Match enum
            paymentStatus: "released", // Fixed Enum
            razorpayPaymentId: "pay_mock_future"
        });

        // 3. Demo Booking
        await Booking.create({
            teacherId: paymentTestTeacher._id,
            studentId: demoStudent._id,
            subject: "Physics",
            class: "10",
            scheduledDate: new Date(Date.now() + 172800000),
            scheduledTime: "18:00",
            date: new Date(Date.now() + 172800000),
            timeSlot: "18:00 - 19:00",
            bookingType: "demo",
            amount: 199,
            bookingStatus: "pending",
            paymentStatus: "held",
            razorpayPaymentId: "pay_mock_demo"
        });

        console.log('Database Seeded Successfully!');
        process.exit();

    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
