import { io } from 'socket.io-client';
import { auth } from './firebase';

const SOCKET_SERVER_URL = 'your-socket-server-url';

class SocketService {
  socket = null;

  connect() {
    this.socket = io(SOCKET_SERVER_URL, {
      auth: {
        token: auth.currentUser?.uid
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  subscribeToMessages(chatId, callback) {
    if (!this.socket) return;
    
    this.socket.on(`message:${chatId}`, callback);
  }

  sendMessage(chatId, message) {
    if (!this.socket) return;
    
    this.socket.emit('send_message', {
      chatId,
      message,
      senderId: auth.currentUser?.uid
    });
  }
}

export const socketService = new SocketService(); 