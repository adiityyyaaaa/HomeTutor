import React, { useEffect, useState } from 'react';

import { paymentsAPI } from '../services/api';
import { FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { Link } from 'react-router-dom';

const PaymentHistory = () => {
    // const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        paymentsAPI.getHistory()
            .then(res => setTransactions(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container-custom">
                <Link to="/dashboard" className="text-primary hover:text-primary-600 mb-4 inline-block">
                    &larr; Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                    <FileText className="w-8 h-8 mr-3 text-primary" />
                    Payment History
                </h1>

                <div className="card">
                    {transactions.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No payments made yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b dark:border-gray-700 text-sm font-medium text-gray-500 uppercase">
                                        <th className="py-3 px-4">Date</th>
                                        <th className="py-3 px-4">Description</th>
                                        <th className="py-3 px-4 text-right">Amount</th>
                                        <th className="py-3 px-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {transactions.map((tx) => (
                                        <tr key={tx._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(tx.createdAt)}
                                            </td>
                                            <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                                                {tx.description}
                                            </td>
                                            <td className="py-3 px-4 text-right font-bold text-red-600">
                                                -{formatCurrency(tx.amount)}
                                            </td>
                                            <td className="py-3 px-4 text-right text-sm text-gray-500">
                                                {tx.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;
