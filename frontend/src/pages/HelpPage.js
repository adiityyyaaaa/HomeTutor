import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, MessageCircle, Phone } from 'lucide-react';

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4 overflow-hidden">
            <button
                className="w-full px-6 py-4 text-left flex justify-between items-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium text-gray-900 dark:text-white">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {isOpen && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400">{answer}</p>
                </div>
            )}
        </div>
    );
};

const HelpPage = () => {
    const faqs = [
        {
            question: "How do I book a tutor?",
            answer: "Search for a tutor based on your subject and needs. Click 'View Profile' and then 'Book a Session'. Select your preferred time slot and complete the payment process."
        },
        {
            question: "What happens if I'm not satisfied with the demo?",
            answer: "If you're not satisfied with the demo session, you can mark it as 'Not Satisfactory' in your dashboard. The payment held in escrow will be refunded to you effortlessly."
        },
        {
            question: "How are payments secured?",
            answer: "We use a secure escrow system. Your payment is held safely until the session is completed satisfactorily. We use Razorpay for secure transaction processing."
        },
        {
            question: "Can I cancel a booking?",
            answer: "Yes, you can cancel a booking from your dashboard. If canceled more than 24 hours in advance, you receive a full refund. Late cancellations may incur a small fee."
        },
        {
            question: "How do I become a teacher?",
            answer: "Click 'Register as Teacher' on the login page. Complete your profile, add your subjects and experience, and wait for admin approval (usually within 24 hours)."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <div className="bg-primary text-white py-16">
                <div className="container-custom text-center">
                    <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
                    <p className="text-xl opacity-90">Find answers to common questions or get in touch with our team.</p>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* FAQ Section */}
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-2">
                            {faqs.map((faq, index) => (
                                <FaqItem key={index} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <div className="card bg-white dark:bg-gray-800 shadow-xl">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Contact Us</h2>
                            <div className="space-y-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Email Support</h3>
                                        <p className="text-sm text-gray-500 mb-1">Response within 24 hours</p>
                                        <a href="mailto:support@hometutor.com" className="text-primary hover:underline">support@hometutor.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Live Chat</h3>
                                        <p className="text-sm text-gray-500 mb-1">Available 9 AM - 6 PM</p>
                                        <button className="text-primary hover:underline">Start Chat</button>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                                        <p className="text-sm text-gray-500 mb-1">Mon-Fri, 9am-6pm</p>
                                        <a href="tel:+911234567890" className="text-primary hover:underline">+91 123 456 7890</a>
                                    </div>
                                </div>
                            </div>

                            <form className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Send us a message</h3>
                                <input type="text" placeholder="Your Name" className="input w-full" />
                                <input type="email" placeholder="Your Email" className="input w-full" />
                                <textarea placeholder="How can we help?" className="textarea w-full h-32"></textarea>
                                <button className="btn btn-primary w-full">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
