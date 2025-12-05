import { useEffect, useState } from 'react';
import Header from '../../components/Layout/Header';
import rankingService from '../../services/ranking.service';
import socketService from '../../services/socket.service';
import { CHALLENGE_CATEGORIES } from '../../utils/constants';
import './Ranking.css';

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    loadRanking();
    setupWebSocket();

    return () => {
      socketService.disconnect();
    };
  }, [selectedCategory]);

  const loadRanking = async () => {
    try {
      let data;
      if (selectedCategory === 'all') {
        data = await rankingService.getRanking();
      } else {
        data = await rankingService.getRankingByCategory(selectedCategory);
      }
      setRanking(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    socketService.joinRanking((data) => {
      setRanking(data.data);
      setLastUpdate(new Date(data.timestamp));
    });

    socketService.onRankingRefresh(() => {
      loadRanking();
    });
  };

  if (loading) {
    return (
      <div className="main-layout">
        <Header />
        <div className="loading-container">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <div className="ranking-header">
          <h1>Classement</h1>
          {lastUpdate && (
            <p className="last-update">
              Mis à jour : {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="category-filter">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          >
            Tous
          </button>
          {CHALLENGE_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="ranking-container">
          {ranking.map((item, index) => (
            <div
              key={item.team.id}
              className={`ranking-card ${index < 3 ? `top-${index + 1}` : ''}`}
            >
              <div className="rank-number">{item.rank}</div>
              <div
                className="team-color-bar"
                style={{ backgroundColor: item.team.color }}
              />
              <div className="team-content">
                <h3>{item.team.name}</h3>
                <p>{item.team.membersCount} membres • {item.validatedScores} scores validés</p>
              </div>
              <div className="team-score-large">
                {item.totalScore}
                <span>points</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Ranking;

