import api from './api';
import { STORAGE_KEYS } from '../utils/constants';
class AuthService {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    this.setAuthData(response.data);
    return response.data;
  }
  async register(data) {
    const response = await api.post('/auth/register', data);
    this.setAuthData(response.data);
    return response.data;
  }
  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.href = '/login';
  }
  setAuthData(data) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
  }
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
  getUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  isAuthenticated() {
    return !!this.getToken();
  }
  isAdmin() {
    const user = this.getUser();
    return user?.role === 'admin';
  }
}
export default new AuthService();