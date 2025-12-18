const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { receiverId, receiverType, message, messageType } = req.body;

        // Validate required fields
        if (!receiverId || !receiverType || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide receiver ID, receiver type, and message'
            });
        }

        // Create message
        const newMessage = await Message.create({
            senderId: req.user._id,
            senderType: req.user.role === 'student' ? 'User' : 'Teacher',
            receiverId,
            receiverType,
            message,
            messageType: messageType || 'text',
            read: false
        });

        // Populate sender and receiver details
        await newMessage.populate('senderId', 'name photo');
        await newMessage.populate('receiverId', 'name photo');

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: newMessage
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending message',
            error: error.message
        });
    }
});

// @route   GET /api/messages/:userId
// @desc    Get conversation with a specific user
// @access  Private
router.get('/:userId', protect, async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50, skip = 0 } = req.query;

        // Get messages where current user is sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: req.user._id, receiverId: userId },
                { senderId: userId, receiverId: req.user._id }
            ]
        })
            .populate('senderId', 'name photo')
            .populate('receiverId', 'name photo')
            .sort({ createdAt: 1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        res.status(200).json({
            success: true,
            count: messages.length,
            messages
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching messages',
            error: error.message
        });
    }
});

// @route   GET /api/messages/conversations/list
// @desc    Get list of all conversations for current user
// @access  Private
router.get('/conversations/list', protect, async (req, res) => {
    try {
        // Get all unique conversations
        const messages = await Message.find({
            $or: [
                { senderId: req.user._id },
                { receiverId: req.user._id }
            ]
        })
            .populate('senderId', 'name photo role')
            .populate('receiverId', 'name photo role')
            .sort({ createdAt: -1 });

        // Group messages by conversation
        const conversationsMap = new Map();

        messages.forEach(msg => {
            const otherUserId = msg.senderId._id.toString() === req.user._id.toString()
                ? msg.receiverId._id.toString()
                : msg.senderId._id.toString();

            if (!conversationsMap.has(otherUserId) ||
                new Date(msg.createdAt) > new Date(conversationsMap.get(otherUserId).lastMessage.createdAt)) {

                const otherUser = msg.senderId._id.toString() === req.user._id.toString()
                    ? msg.receiverId
                    : msg.senderId;

                conversationsMap.set(otherUserId, {
                    user: otherUser,
                    lastMessage: msg,
                    unreadCount: 0
                });
            }
        });

        // Count unread messages for each conversation
        for (const [userId, conversation] of conversationsMap) {
            const unreadCount = await Message.countDocuments({
                senderId: userId,
                receiverId: req.user._id,
                read: false
            });
            conversation.unreadCount = unreadCount;
        }

        const conversations = Array.from(conversationsMap.values());

        res.status(200).json({
            success: true,
            count: conversations.length,
            conversations
        });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching conversations',
            error: error.message
        });
    }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        // Verify user is the receiver
        if (message.receiverId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to mark this message as read'
            });
        }

        message.read = true;
        await message.save();

        res.status(200).json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking message as read',
            error: error.message
        });
    }
});

// @route   PUT /api/messages/conversation/:userId/read-all
// @desc    Mark all messages in a conversation as read
// @access  Private
router.put('/conversation/:userId/read-all', protect, async (req, res) => {
    try {
        await Message.updateMany(
            {
                senderId: req.params.userId,
                receiverId: req.user._id,
                read: false
            },
            { read: true }
        );

        res.status(200).json({
            success: true,
            message: 'All messages marked as read'
        });
    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking messages as read',
            error: error.message
        });
    }
});

module.exports = router;
