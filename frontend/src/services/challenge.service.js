import api from './api';
class ChallengeService {
  async getChallenges(params = {}) {
    const response = await api.get('/challenges', { params });
    return response.data;
  }
  async getActiveChallenges() {
    const response = await api.get('/challenges/active');
    return response.data.data;
  }
  async getChallengeById(id) {
    const response = await api.get(`/challenges/${id}`);
    return response.data.data;
  }
  async createChallenge(data) {
    const response = await api.post('/challenges', data);
    return response.data.data;
  }
  async updateChallenge(id, data) {
    const response = await api.put(`/challenges/${id}`, data);
    return response.data.data;
  }
  async deleteChallenge(id) {
    await api.delete(`/challenges/${id}`);
  }
  async getMyChallenges() {
    const response = await api.get('/challenges/admin/my-challenges');
    return response.data.data;
  }
}
export default new ChallengeService();