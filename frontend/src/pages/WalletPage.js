import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { paymentsAPI } from '../services/api';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Clock, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { Link } from 'react-router-dom';

const WalletPage = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0); // Add currency?
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawing, setWithdrawing] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            const [walletRes, historyRes] = await Promise.all([
                paymentsAPI.getWallet(),
                paymentsAPI.getHistory()
            ]);
            setBalance(walletRes.data.balance);
            setTransactions(historyRes.data);
        } catch (error) {
            console.error('Error fetching wallet data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) return;
        if (parseFloat(withdrawAmount) > balance) {
            setMessage({ type: 'error', text: 'Insufficient balance' });
            return;
        }

        setWithdrawing(true);
        try {
            await paymentsAPI.withdraw(parseFloat(withdrawAmount));
            setMessage({ type: 'success', text: 'Withdrawal successful!' });
            setWithdrawAmount('');
            fetchWalletData(); // Refresh data
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Withdrawal failed' });
        } finally {
            setWithdrawing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container-custom">
                <Link to="/teacher-dashboard" className="text-primary hover:text-primary-600 mb-4 inline-block">
                    &larr; Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                    <Wallet className="w-8 h-8 mr-3 text-primary" />
                    My Wallet
                </h1>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Balance Card */}
                    <div className="card bg-gradient-to-r from-primary-600 to-primary-800 text-white md:col-span-1">
                        <p className="text-primary-100 mb-2">Available Balance</p>
                        <h2 className="text-4xl font-bold mb-4">{formatCurrency(balance)}</h2>
                        <p className="text-sm text-primary-200">
                            Earnings are released after class completion.
                        </p>
                    </div>

                    {/* Withdraw Form */}
                    <div className="card md:col-span-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Withdraw Funds</h3>
                        {message && (
                            <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}
                        <form onSubmit={handleWithdraw} className="flex gap-4">
                            <div className="flex-grow">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Amount to Withdraw
                                </label>
                                <input
                                    type="number"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    className="input"
                                    placeholder="Enter amount"
                                    min="1"
                                    max={balance}
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={withdrawing || balance === 0}
                                    className="btn btn-primary h-[42px]"
                                >
                                    {withdrawing ? 'Processing...' : 'Withdraw'}
                                </button>
                            </div>
                        </form>
                        <p className="text-xs text-gray-500 mt-2">
                            * Withdrawals are processed immediately to your linked bank account (Mock).
                        </p>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="card">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Transactions</h3>

                    {transactions.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No transactions yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b dark:border-gray-700 text-sm font-medium text-gray-500 uppercase">
                                        <th className="py-3 px-4">Date</th>
                                        <th className="py-3 px-4">Description</th>
                                        <th className="py-3 px-4">Type</th>
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
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tx.type === 'credit'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                    }`}>
                                                    {tx.type === 'credit' ? <ArrowDownCircle className="w-3 h-3 mr-1" /> : <ArrowUpCircle className="w-3 h-3 mr-1" />}
                                                    {tx.type === 'credit' ? 'Credit' : 'Debit'}
                                                </span>
                                            </td>
                                            <td className={`py-3 px-4 text-right font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <span className="text-xs text-gray-500 flex items-center justify-end gap-1">
                                                    {tx.status} {tx.status === 'completed' && <CheckCircle className="w-3 h-3 text-green-500" />}
                                                </span>
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

export default WalletPage;
