import api from './api';
class ScoreService {
  async getScores(params = {}) {
    const response = await api.get('/scores', { params });
    return response.data;
  }
  async getScoreById(id) {
    const response = await api.get(`/scores/${id}`);
    return response.data.data;
  }
  async submitScore(data) {
    const response = await api.post('/scores/submit', data);
    return response.data.data;
  }
  async validateScore(id, data) {
    const response = await api.put(`/scores/${id}/validate`, data);
    return response.data.data;
  }
  async getMyChallengeScores(params = {}) {
    const response = await api.get('/scores/admin/my-participations', { params });
    return response.data;
  }
  async updateScore(id, data) {
    const response = await api.put(`/scores/${id}`, data);
    return response.data.data;
  }
}
export default new ScoreService();