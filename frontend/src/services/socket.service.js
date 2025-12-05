import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';
class SocketService {
  constructor() {
    this.socket = null;
  }
  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });
      this.socket.on('connect', () => {
        console.log('✅ Connecté au serveur WebSocket');
      });
      this.socket.on('disconnect', () => {
        console.log('❌ Déconnecté du serveur WebSocket');
      });
    }
    return this.socket;
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  joinRanking(callback) {
    if (!this.socket) this.connect();
    this.socket.emit('join:ranking');
    this.socket.on('ranking:update', callback);
  }
  joinTeam(teamId, callback) {
    if (!this.socket) this.connect();
    this.socket.emit('join:team', teamId);
    this.socket.on('team:update', callback);
  }
  joinChallenge(challengeId, callback) {
    if (!this.socket) this.connect();
    this.socket.emit('join:challenge', challengeId);
    this.socket.on('challenge:update', callback);
  }
  onNotification(callback) {
    if (!this.socket) this.connect();
    this.socket.on('notification', callback);
  }
  onRankingRefresh(callback) {
    if (!this.socket) this.connect();
    this.socket.on('ranking:refresh', callback);
  }
  leaveRoom(room) {
    if (this.socket) {
      this.socket.leave(room);
    }
  }
  isConnected() {
    return this.socket?.connected || false;
  }
}
export default new SocketService();