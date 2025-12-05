import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

class AuthService {
  // Login
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    this.setAuthData(response.data);
    return response.data;
  }

  // Register
  async register(data) {
    const response = await api.post('/auth/register', data);
    this.setAuthData(response.data);
    return response.data;
  }

  // Déconnexion
  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.href = '/login';
  }

  // Sauvegarder les données d'authentification
  setAuthData(data) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
  }

  // Récupérer le token
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  // Récupérer l'utilisateur
  getUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!this.getToken();
  }

  // Vérifier si l'utilisateur est admin
  isAdmin() {
    const user = this.getUser();
    return user?.role === 'admin';
  }
}

export default new AuthService();

