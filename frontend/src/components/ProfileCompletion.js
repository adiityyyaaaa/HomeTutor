import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Trophy, ChevronRight, CheckCircle } from 'lucide-react';

const ProfileCompletion = ({ user }) => {
    const navigate = useNavigate();

    if (!user) return null;

    // Weightage for different profile sections
    const criteria = [
        {
            id: 'photo',
            label: 'Profile Photo',
            description: 'Add a professional photo to build trust',
            weight: 10,
            isComplete: !!user.photo,
            action: '/edit-profile'
        },
        {
            id: 'videoIntro',
            label: 'Video Introduction',
            description: 'Teachers with videos get 3x more bookings',
            weight: 20,
            isComplete: !!user.videoIntro,
            action: '/edit-profile'
        },
        {
            id: 'teachingVideo',
            label: 'Teaching Demo',
            description: 'Showcase your teaching style',
            weight: 15,
            isComplete: !!user.teachingVideo,
            action: '/edit-profile'
        },
        {
            id: 'about',
            label: 'Basic Details',
            description: 'Experience, subjects, and boards',
            weight: 15,
            isComplete: user.experience > 0 && user.subjects?.length > 0 && user.boards?.length > 0,
            action: '/edit-profile'
        },
        {
            id: 'availability',
            label: 'Availability',
            description: 'Set your teaching hours',
            weight: 20,
            isComplete: user.availability?.length > 0,
            action: '/edit-profile'
        },
        {
            id: 'pricing',
            label: 'Pricing',
            description: 'Set your hourly and monthly rates',
            weight: 10,
            isComplete: user.hourlyRate > 0 && user.monthlyRate > 0,
            action: '/edit-profile'
        },
        {
            id: 'aadhaar',
            label: 'ID Verification',
            description: 'Verify your Aadhaar for "Verified" badge',
            weight: 10,
            isComplete: user.aadhaarVerified,
            action: '/edit-profile'
        }
    ];

    const completedWeight = criteria.reduce((acc, item) => acc + (item.isComplete ? item.weight : 0), 0);
    const totalWeight = criteria.reduce((acc, item) => acc + item.weight, 0);
    const completionPercentage = Math.round((completedWeight / totalWeight) * 100);

    const incompleteItems = criteria.filter(item => !item.isComplete);

    if (completionPercentage === 100) return null;

    return (
        <div className="card bg-white dark:bg-gray-800 border-l-4 border-l-primary shadow-lg mb-8 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 dark:bg-primary-900/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Profile Strength</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Complete your profile to rank higher</p>
                    </div>
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                className="text-gray-200 dark:text-gray-700"
                            />
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                strokeDasharray={175.93}
                                strokeDashoffset={175.93 - (175.93 * completionPercentage) / 100}
                                className="text-primary transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <span className="absolute text-sm font-bold text-gray-900 dark:text-white">{completionPercentage}%</span>
                    </div>
                </div>

                <div className="space-y-3">
                    {incompleteItems.slice(0, 3).map(item => (
                        <div
                            key={item.id}
                            className="group flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                            onClick={() => navigate(item.action)}
                        >
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                        {item.label}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                            <button className="btn btn-sm btn-ghost text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="font-semibold text-xs uppercase mr-1">Add</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileCompletion;
