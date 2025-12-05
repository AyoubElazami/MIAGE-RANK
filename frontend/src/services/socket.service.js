import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

class SocketService {
  constructor() {
    this.socket = null;
  }

  // Connexion au serveur WebSocket
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

  // Déconnexion
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Rejoindre la room du classement
  joinRanking(callback) {
    if (!this.socket) this.connect();
    this.socket.emit('join:ranking');
    this.socket.on('ranking:update', callback);
  }

  // Rejoindre la room d'une équipe
  joinTeam(teamId, callback) {
    if (!this.socket) this.connect();
    this.socket.emit('join:team', teamId);
    this.socket.on('team:update', callback);
  }

  // Rejoindre la room d'un défi
  joinChallenge(challengeId, callback) {
    if (!this.socket) this.connect();
    this.socket.emit('join:challenge', challengeId);
    this.socket.on('challenge:update', callback);
  }

  // Écouter les notifications
  onNotification(callback) {
    if (!this.socket) this.connect();
    this.socket.on('notification', callback);
  }

  // Écouter les mises à jour de classement
  onRankingRefresh(callback) {
    if (!this.socket) this.connect();
    this.socket.on('ranking:refresh', callback);
  }

  // Quitter une room
  leaveRoom(room) {
    if (this.socket) {
      this.socket.leave(room);
    }
  }

  // Vérifier si connecté
  isConnected() {
    return this.socket?.connected || false;
  }
}

export default new SocketService();

