import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MapPin, Star, Users, Clock, Shield, Video, TrendingUp } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="w-8 h-8 text-primary" />
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">HomeTutor</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="btn btn-secondary">
                                Login
                            </Link>
                            <Link to="/register/student" className="btn btn-primary">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900 py-20">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 animate-slideIn">
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                                Find the Perfect{' '}
                                <span className="text-primary">Home Tutor</span> Near You
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                Connect with verified, experienced tutors. Book free demo classes. Pay only when satisfied.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/register/student" className="btn btn-primary btn-lg">
                                    Find a Tutor
                                </Link>
                                <Link to="/register/teacher" className="btn btn-outline btn-lg">
                                    Become a Tutor
                                </Link>
                            </div>
                            <div className="flex items-center space-x-8 pt-4">
                                <div>
                                    <div className="text-3xl font-bold text-primary">10,000+</div>
                                    <div className="text-gray-600 dark:text-gray-400">Verified Tutors</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary">50,000+</div>
                                    <div className="text-gray-600 dark:text-gray-400">Happy Students</div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-600 rounded-3xl transform rotate-3"></div>
                                <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                                <Star className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">4.9 Average Rating</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Based on 15,000+ reviews</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                                                <MapPin className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">Location-Based</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Find tutors within 5km</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                                <Shield className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">100% Verified</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Aadhaar verified tutors</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Why Choose HomeTutor?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            The most trusted platform for home tuition
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <MapPin className="w-12 h-12" />,
                                title: 'Location-Based Search',
                                description: 'Find tutors near you with GPS-based distance calculation. Filter by 5km, 10km, or 20km radius.'
                            },
                            {
                                icon: <Video className="w-12 h-12" />,
                                title: 'Free Demo Classes',
                                description: 'Book a free demo class. Payment is held during demo and only released when you\'re satisfied.'
                            },
                            {
                                icon: <Star className="w-12 h-12" />,
                                title: 'Verified Teachers',
                                description: 'All tutors are Aadhaar verified with detailed qualifications, experience, and student reviews.'
                            },
                            {
                                icon: <TrendingUp className="w-12 h-12" />,
                                title: 'Progress Tracking',
                                description: 'Track your child\'s progress with detailed reports, test scores, and performance analytics.'
                            },
                            {
                                icon: <Users className="w-12 h-12" />,
                                title: 'Real-Time Chat',
                                description: 'Chat with tutors in real-time. Make audio calls to discuss schedules and requirements.'
                            },
                            {
                                icon: <Clock className="w-12 h-12" />,
                                title: 'Flexible Scheduling',
                                description: 'Book classes at your convenience. Reschedule or cancel with our flexible booking system.'
                            }
                        ].map((feature, index) => (
                            <div key={index} className="card-hover text-center">
                                <div className="text-primary mb-4 flex justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Get started in 3 simple steps
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '1',
                                title: 'Search & Filter',
                                description: 'Enter your requirements - subject, class, board. Filter by location, price, rating, and experience.'
                            },
                            {
                                step: '2',
                                title: 'Book Demo Class',
                                description: 'Choose a tutor and book a free demo class. Payment is held securely until you\'re satisfied.'
                            },
                            {
                                step: '3',
                                title: 'Start Learning',
                                description: 'If satisfied with the demo, continue with regular classes. Track progress and communicate via chat.'
                            }
                        ].map((step, index) => (
                            <div key={index} className="relative">
                                <div className="card text-center">
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                            {step.step}
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary to-primary-600">
                <div className="container-custom text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Ready to Start Learning?
                    </h2>
                    <p className="text-xl text-primary-100 mb-8">
                        Join thousands of students finding success with verified home tutors
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register/student" className="btn bg-white text-primary hover:bg-gray-100">
                            Find a Tutor Now
                        </Link>
                        <Link to="/register/teacher" className="btn bg-primary-700 text-white hover:bg-primary-800">
                            Apply as a Tutor
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12">
                <div className="container-custom">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <BookOpen className="w-6 h-6 text-primary" />
                                <span className="text-xl font-bold text-white">HomeTutor</span>
                            </div>
                            <p className="text-sm">
                                India's most trusted platform for finding verified home tutors.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">For Students</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/search" className="hover:text-primary">Find Tutors</Link></li>
                                <li><Link to="/register/student" className="hover:text-primary">Register</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">For Teachers</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/register/teacher" className="hover:text-primary">Become a Tutor</Link></li>
                                <li><Link to="/teacher-dashboard" className="hover:text-primary">Teacher Dashboard</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/help" className="hover:text-primary">Help Center</Link></li>
                                <li><Link to="/help" className="hover:text-primary">Contact Us</Link></li>
                                <li><button className="text-left hover:text-primary bg-transparent border-none p-0 cursor-pointer text-gray-300">Privacy Policy</button></li>
                                <li><button className="text-left hover:text-primary bg-transparent border-none p-0 cursor-pointer text-gray-300">Terms of Service</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                        <p>&copy; 2024 HomeTutor. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
