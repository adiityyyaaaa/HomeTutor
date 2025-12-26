import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, MapPin, Star, Users, Clock, Shield, Video, TrendingUp } from 'lucide-react';

const Landing = () => {
    const { user } = useAuth();
    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="w-8 h-8 text-primary" />
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">TutorX</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <Link to={user.role === 'teacher' ? '/teacher-dashboard' : '/dashboard'} className="btn btn-primary">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-secondary">
                                        Login
                                    </Link>
                                    <Link to="/register/student" className="btn btn-primary">
                                        Get Started
                                    </Link>
                                </>
                            )}
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
                                Learn Anything.{' '}
                                <span className="text-primary">Teach Anything.</span>{' '}
                                Grow Together.
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                Connect with expert instructors for any skill you want to learn. Or share your expertise and earn money teaching what you love. Online, offline, or hybrid - you choose.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/search" className="btn btn-primary btn-lg">
                                    Find an Instructor
                                </Link>
                                <Link to="/register/teacher" className="btn btn-outline btn-lg">
                                    Become an Instructor
                                </Link>
                            </div>
                            <div className="flex items-center space-x-8 pt-4">
                                <div>
                                    <div className="text-3xl font-bold text-primary">10,000+</div>
                                    <div className="text-gray-600 dark:text-gray-400">Instructors</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary">50,000+</div>
                                    <div className="text-gray-600 dark:text-gray-400">Active Learners</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary">100+</div>
                                    <div className="text-gray-600 dark:text-gray-400">Skills</div>
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
                            Why Choose TutorX?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            The ultimate two-sided marketplace for learners and instructors
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <BookOpen className="w-12 h-12" />,
                                title: 'Learn Any Skill',
                                description: 'From music to coding, cooking to yoga - find expert instructors for any skill you want to master.'
                            },
                            {
                                icon: <Video className="w-12 h-12" />,
                                title: 'Flexible Learning Modes',
                                description: 'Choose online classes, in-person sessions, or hybrid learning based on your preference and schedule.'
                            },
                            {
                                icon: <Star className="w-12 h-12" />,
                                title: 'Verified Instructors',
                                description: 'All instructors are verified with detailed profiles, portfolios, ratings, and genuine student reviews.'
                            },
                            {
                                icon: <TrendingUp className="w-12 h-12" />,
                                title: 'Earn Teaching',
                                description: 'Share your expertise and earn money. Set your own rates, manage your schedule, and grow your income.'
                            },
                            {
                                icon: <Users className="w-12 h-12" />,
                                title: 'Free Demo Sessions',
                                description: 'Try before you commit. Book free demo sessions to find the perfect instructor for your learning goals.'
                            },
                            {
                                icon: <Shield className="w-12 h-12" />,
                                title: 'Secure & Trusted',
                                description: 'Safe payment processing, verified profiles, and trusted by thousands of learners and instructors.'
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
                            For learners and instructors - get started in 3 simple steps
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '1',
                                title: 'Sign Up & Browse',
                                description: 'Create your free account. Learners: browse 100+ skills. Instructors: list your expertise and set your rates.'
                            },
                            {
                                step: '2',
                                title: 'Connect & Book',
                                description: 'Find the perfect match. Book free demo sessions to try before committing. Choose online, offline, or hybrid.'
                            },
                            {
                                step: '3',
                                title: 'Learn & Earn',
                                description: 'Learners: master new skills with expert guidance. Instructors: teach what you love and earn money doing it.'
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
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-primary-100 mb-8">
                        Join 50,000+ learners mastering new skills and 10,000+ instructors earning money
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/search" className="btn bg-white text-primary hover:bg-gray-100">
                            Start Learning
                        </Link>
                        <Link to="/register/teacher" className="btn bg-primary-700 text-white hover:bg-primary-800">
                            Start Teaching
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
                                <span className="text-xl font-bold text-white">TutorX</span>
                            </div>
                            <p className="text-sm">
                                Your trusted marketplace for learning and teaching any skill.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">For Learners</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/search" className="hover:text-primary">Browse Skills</Link></li>
                                <li><Link to="/register/student" className="hover:text-primary">Sign Up</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">For Instructors</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/register/teacher" className="hover:text-primary">Start Teaching</Link></li>
                                <li><Link to="/teacher-dashboard" className="hover:text-primary">Instructor Dashboard</Link></li>
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
                        <p>&copy; 2024 TutorX. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
