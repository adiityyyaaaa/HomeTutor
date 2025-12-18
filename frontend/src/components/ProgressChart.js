import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const ProgressChart = ({ stats, progressEntries }) => {
    // Process data for charts
    const testScoreDates = progressEntries
        .filter(entry => entry.testScores && entry.testScores.length > 0)
        .map(entry => {
            const avgScore = entry.testScores.reduce((sum, s) => sum + (s.score / s.maxScore) * 100, 0) / entry.testScores.length;
            return {
                date: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                score: Math.round(avgScore),
                topics: entry.topics.join(', ')
            };
        })
        .reverse(); // Show oldest first

    const performanceData = Object.keys(stats.performanceDistribution || {}).map(key => ({
        name: key,
        value: stats.performanceDistribution[key]
    })).filter(d => d.value > 0);

    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Test Performance Trend */}
            <div className="card">
                <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4">Test Performance Trend</h3>
                {testScoreDates.length > 0 ? (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={testScoreDates}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ stroke: '#3B82F6', strokeWidth: 1 }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#3B82F6" fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        No test data available yet
                    </div>
                )}
            </div>

            {/* Performance Distribution */}
            <div className="card">
                <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4">Performance Summary</h3>
                {performanceData.length > 0 ? (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={performanceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {performanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        No evaluations recorded yet
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressChart;
