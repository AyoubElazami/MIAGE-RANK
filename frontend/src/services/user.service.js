import api from './api';
class UserService {
  async getUsers() {
    const response = await api.get('/users');
    return response.data.data;
  }
  async getUserById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  }
  async updateUser(id, data) {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  }
  async deleteUser(id) {
    await api.delete(`/users/${id}`);
  }
}
export default new UserService();