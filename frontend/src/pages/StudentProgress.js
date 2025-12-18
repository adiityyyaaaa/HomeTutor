import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressAPI } from '../services/api';
import ProgressChart from '../components/ProgressChart';
import { CheckCircle, XCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentProgress = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState([]);
    const [expandedEntry, setExpandedEntry] = useState(null);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await progressAPI.getByStudent(user._id);
                if (response.data.success) {
                    setStats(response.data.stats);
                    setEntries(response.data.progressEntries);
                }
            } catch (error) {
                console.error('Error fetching progress:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [user._id]);

    const toggleEntry = (id) => {
        if (expandedEntry === id) setExpandedEntry(null);
        else setExpandedEntry(id);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <div className="container-custom py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Academic Progress</h1>
                        <p className="text-gray-600 dark:text-gray-400">Track your learning journey and performance</p>
                    </div>
                    <Link to="/dashboard" className="btn btn-outline">Back to Dashboard</Link>
                </div>

                {/* KPI Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Classes</p>
                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalClasses}</p>
                        </div>
                        <div className="card bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.attendanceRate}%</p>
                        </div>
                        <div className="card bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Test Score</p>
                            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.averageTestScore}%</p>
                        </div>
                        <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Latest Rating</p>
                            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                                {entries[0]?.performance || 'N/A'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Charts */}
                {stats && <div className="mb-8"><ProgressChart stats={stats} progressEntries={entries} /></div>}

                {/* Detailed Timeline */}
                <h2 className="text-xl font-bold mb-4">Daily Reports</h2>
                <div className="space-y-4">
                    {entries.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No progress reports available yet.</p>
                        </div>
                    ) : (
                        entries.map(entry => (
                            <div key={entry._id} className="card hover:shadow-md transition-shadow">
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleEntry(entry._id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${entry.attendance ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {entry.attendance ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                {entry.bookingId?.subject || 'Class'} • {entry.teacherId?.name || 'Teacher'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${entry.performance === 'Excellent' ? 'bg-green-100 text-green-700' :
                                            entry.performance === 'Good' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {entry.performance}
                                        </span>
                                        {expandedEntry === entry._id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                    </div>
                                </div>

                                {expandedEntry === entry._id && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 pl-16 grid md:grid-cols-2 gap-6 animate-fadeIn">
                                        <div>
                                            <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Topics Covered</h5>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {entry.topics.map((topic, i) => (
                                                    <span key={i} className="badge badge-secondary">{topic}</span>
                                                ))}
                                            </div>

                                            <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Homework</h5>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">{entry.homework || 'None assigned'}</p>
                                        </div>

                                        <div>
                                            {entry.testScores.length > 0 && (
                                                <div className="mb-4">
                                                    <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Test Results</h5>
                                                    <div className="space-y-2">
                                                        {entry.testScores.map((score, i) => (
                                                            <div key={i} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                                                                <span>{score.subject}</span>
                                                                <span className="font-mono font-bold">{score.score}/{score.maxScore}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Teacher Remarks</h5>
                                            <p className="text-gray-600 dark:text-gray-400 italic">"{entry.remarks}"</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentProgress;
