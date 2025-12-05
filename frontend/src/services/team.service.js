import api from './api';
class TeamService {
  async getTeams(params = {}) {
    const response = await api.get('/teams', { params });
    return response.data;
  }
  async getTeamById(id) {
    const response = await api.get(`/teams/${id}`);
    return response.data.data;
  }
  async createTeam(data) {
    const response = await api.post('/teams', data);
    return response.data.data;
  }
  async updateTeam(id, data) {
    const response = await api.put(`/teams/${id}`, data);
    return response.data.data;
  }
  async addMember(teamId, userId) {
    await api.post(`/teams/${teamId}/members`, { userId });
  }
  async removeMember(teamId, memberId) {
    await api.delete(`/teams/${teamId}/members/${memberId}`);
  }
  async deleteTeam(id) {
    await api.delete(`/teams/${id}`);
  }
}
export default new TeamService();