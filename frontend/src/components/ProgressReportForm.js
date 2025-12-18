import React, { useState } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import { progressAPI } from '../services/api';

const ProgressReportForm = ({ booking, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        bookingId: booking._id,
        studentId: booking.studentId._id,
        date: new Date().toISOString().split('T')[0],
        topics: '',
        performance: 'Good',
        homework: '',
        remarks: '',
        attendance: true,
        testScores: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleAddTestScore = () => {
        setFormData({
            ...formData,
            testScores: [...formData.testScores, { subject: booking.subject, score: '', maxScore: '' }]
        });
    };

    const handleTestScoreChange = (index, field, value) => {
        const newScores = [...formData.testScores];
        newScores[index][field] = value;
        setFormData({ ...formData, testScores: newScores });
    };

    const removeTestScore = (index) => {
        const newScores = formData.testScores.filter((_, i) => i !== index);
        setFormData({ ...formData, testScores: newScores });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Process topics array
            const payload = {
                ...formData,
                topics: formData.topics.split(',').map(t => t.trim()).filter(Boolean)
            };

            const response = await progressAPI.add(payload);
            if (response.data.success) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            console.error('Error adding progress:', err);
            setError(err.response?.data?.message || 'Failed to submit report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-lg dark:text-white">Add Progress Report</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
                    {error && <div className="alert alert-error mb-4">{error}</div>}

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="label">Student</label>
                            <input type="text" className="input bg-gray-100" value={booking.studentId.name} disabled />
                        </div>
                        <div>
                            <label className="label">Date</label>
                            <input
                                type="date"
                                name="date"
                                className="input"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="label flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="attendance"
                                className="checkbox checkbox-primary"
                                checked={formData.attendance}
                                onChange={handleChange}
                            />
                            <span>Student Present?</span>
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="label">Topics Covered (comma separated)</label>
                        <input
                            type="text"
                            name="topics"
                            className="input"
                            placeholder="e.g. Algebra Basics, Quadratic Equations"
                            value={formData.topics}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="label">Performance Rating</label>
                            <select
                                name="performance"
                                className="input"
                                value={formData.performance}
                                onChange={handleChange}
                            >
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Average">Average</option>
                                <option value="Needs Improvement">Needs Improvement</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Homework Assigned</label>
                            <input
                                type="text"
                                name="homework"
                                className="input"
                                value={formData.homework}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Test Scores Section */}
                    <div className="mb-4 border p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                            <label className="label font-semibold m-0">Test Scores (Optional)</label>
                            <button type="button" onClick={handleAddTestScore} className="btn btn-xs btn-outline-primary flex items-center gap-1">
                                <Plus className="w-3 h-3" /> Add Score
                            </button>
                        </div>

                        {formData.testScores.length === 0 && <p className="text-sm text-gray-500 italic">No tests recorded today.</p>}

                        {formData.testScores.map((score, index) => (
                            <div key={index} className="flex gap-2 items-end mb-2">
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500">Subject</label>
                                    <input
                                        type="text"
                                        className="input input-sm"
                                        value={score.subject}
                                        onChange={(e) => handleTestScoreChange(index, 'subject', e.target.value)}
                                        placeholder="Subject"
                                    />
                                </div>
                                <div className="w-20">
                                    <label className="text-xs text-gray-500">Score</label>
                                    <input
                                        type="number"
                                        className="input input-sm"
                                        value={score.score}
                                        onChange={(e) => handleTestScoreChange(index, 'score', e.target.value)}
                                        placeholder="Score"
                                    />
                                </div>
                                <div className="w-20">
                                    <label className="text-xs text-gray-500">Max</label>
                                    <input
                                        type="number"
                                        className="input input-sm"
                                        value={score.maxScore}
                                        onChange={(e) => handleTestScoreChange(index, 'maxScore', e.target.value)}
                                        placeholder="Max"
                                    />
                                </div>
                                <button type="button" onClick={() => removeTestScore(index)} className="btn btn-sq btn-ghost text-red-500">
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mb-6">
                        <label className="label">Remarks</label>
                        <textarea
                            name="remarks"
                            className="textarea h-24"
                            placeholder="Detailed feedback about the session..."
                            value={formData.remarks}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary w-full">
                        {loading ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProgressReportForm;
