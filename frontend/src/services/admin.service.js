import api from './api';
class AdminService {
  async getDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data.data;
  }
  async createUser(data) {
    const response = await api.post('/admin/users', data);
    return response.data.data;
  }
  async updateUserRole(userId, role) {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data.data;
  }
  async assignUserToTeam(userId, teamId) {
    const response = await api.put(`/admin/users/${userId}/team`, { team_id: teamId });
    return response.data.data;
  }
}
export default new AdminService();