import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001';

class SocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    connect(userId) {
        if (this.connected && this.socket) {
            return this.socket;
        }

        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket.id);
            this.connected = true;
            this.socket.emit('join', userId);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.connected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
        }
    }

    // Chat methods
    sendMessage(data) {
        if (this.socket && this.connected) {
            this.socket.emit('send-message', data);
        }
    }

    onReceiveMessage(callback) {
        if (this.socket) {
            this.socket.on('receive-message', callback);
        }
    }

    onMessageSent(callback) {
        if (this.socket) {
            this.socket.on('message-sent', callback);
        }
    }

    onMessageError(callback) {
        if (this.socket) {
            this.socket.on('message-error', callback);
        }
    }

    // Typing indicators
    sendTyping(receiverId) {
        if (this.socket && this.connected) {
            this.socket.emit('typing', { receiverId });
        }
    }

    stopTyping(receiverId) {
        if (this.socket && this.connected) {
            this.socket.emit('stop-typing', { receiverId });
        }
    }

    onTyping(callback) {
        if (this.socket) {
            this.socket.on('typing', callback);
        }
    }

    onStopTyping(callback) {
        if (this.socket) {
            this.socket.on('stop-typing', callback);
        }
    }

    // Read receipts
    sendReadReceipt(messageId, senderId) {
        if (this.socket && this.connected) {
            this.socket.emit('read-receipt', { messageId, senderId });
        }
    }

    onMessageRead(callback) {
        if (this.socket) {
            this.socket.on('message-read', callback);
        }
    }

    // Online/Offline status
    onUserOnline(callback) {
        if (this.socket) {
            this.socket.on('user-online', callback);
        }
    }

    onUserOffline(callback) {
        if (this.socket) {
            this.socket.on('user-offline', callback);
        }
    }

    // Audio call methods
    callUser(data) {
        if (this.socket && this.connected) {
            this.socket.emit('call-user', data);
        }
    }

    onIncomingCall(callback) {
        if (this.socket) {
            this.socket.on('incoming-call', callback);
        }
    }

    acceptCall(data) {
        if (this.socket && this.connected) {
            this.socket.emit('accept-call', data);
        }
    }

    onCallAccepted(callback) {
        if (this.socket) {
            this.socket.on('call-accepted', callback);
        }
    }

    rejectCall(data) {
        if (this.socket && this.connected) {
            this.socket.emit('reject-call', data);
        }
    }

    onCallRejected(callback) {
        if (this.socket) {
            this.socket.on('call-rejected', callback);
        }
    }

    sendIceCandidate(data) {
        if (this.socket && this.connected) {
            this.socket.emit('ice-candidate', data);
        }
    }

    onIceCandidate(callback) {
        if (this.socket) {
            this.socket.on('ice-candidate', callback);
        }
    }

    endCall(data) {
        if (this.socket && this.connected) {
            this.socket.emit('end-call', data);
        }
    }

    onCallEnded(callback) {
        if (this.socket) {
            this.socket.on('call-ended', callback);
        }
    }

    // Remove all listeners
    removeAllListeners() {
        if (this.socket) {
            this.socket.removeAllListeners();
        }
    }

    removeListener(event) {
        if (this.socket) {
            this.socket.off(event);
        }
    }
}

const socketService = new SocketService();
export default socketService;
