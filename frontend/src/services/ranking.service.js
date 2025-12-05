import api from './api';

class RankingService {
  async getRanking(limit) {
    const params = limit ? { limit } : {};
    const response = await api.get('/ranking', { params });
    return response.data.data;
  }

  async getRankingByCategory(category, limit) {
    const params = limit ? { limit } : {};
    const response = await api.get(`/ranking/category/${category}`, { params });
    return response.data.data;
  }

  async getStatistics() {
    const response = await api.get('/ranking/statistics');
    return response.data.data;
  }

  async getHistory(days = 30) {
    const response = await api.get('/ranking/history', { params: { days } });
    return response.data.data;
  }
}

export default new RankingService();

