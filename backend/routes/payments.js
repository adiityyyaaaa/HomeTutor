const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Teacher = require('../models/Teacher');
const { protect } = require('../middleware/auth');

// @route   GET /api/payments/wallet
// @desc    Get teacher wallet balance
// @access  Private (Teacher)
router.get('/wallet', protect, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const teacher = await Teacher.findById(req.user._id);
        res.json({
            balance: teacher.walletBalance,
            currency: 'INR'
        });
    } catch (error) {
        console.error('Wallet fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/payments/history
// @desc    Get transaction history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        res.json(transactions);
    } catch (error) {
        console.error('History fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/payments/withdraw
// @desc    Initiate withdrawal (Mock)
// @access  Private (Teacher)
router.post('/withdraw', protect, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { amount } = req.body;
        const teacher = await Teacher.findById(req.user._id);

        if (amount > teacher.walletBalance) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // Deduct from wallet
        teacher.walletBalance -= amount;
        await teacher.save();

        // Create transaction record
        await Transaction.create({
            userId: req.user._id,
            userRole: 'teacher',
            amount: amount,
            type: 'debit',
            description: 'Withdrawal to Bank Account',
            status: 'completed',
            balanceAfter: teacher.walletBalance
        });

        res.json({
            success: true,
            message: 'Withdrawal successful',
            newBalance: teacher.walletBalance
        });
    } catch (error) {
        console.error('Withdrawal error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
