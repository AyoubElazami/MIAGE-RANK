import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Layout/Header';
import rankingService from '../../services/ranking.service';
import teamService from '../../services/team.service';
import challengeService from '../../services/challenge.service';
import { ROUTES } from '../../utils/constants';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [topTeams, setTopTeams] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [stats, ranking, challenges] = await Promise.all([
        rankingService.getStatistics(),
        rankingService.getRanking(5),
        challengeService.getActiveChallenges(),
      ]);

      setStatistics(stats);
      setTopTeams(ranking);
      setActiveChallenges(challenges.slice(0, 3));
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="main-layout">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <div className="dashboard-header">
          <h1>Bienvenue, {user?.name} !</h1>
          <p className="dashboard-subtitle">Voici un aperçu de votre activité</p>
        </div>

        <div className="dashboard-grid">
          {/* Statistiques */}
          {statistics && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#667eea20', color: '#667eea' }}>
                  👥
                </div>
                <div className="stat-content">
                  <h3>{statistics.teams.total}</h3>
                  <p>Équipes</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#48bb7820', color: '#48bb78' }}>
                  🎯
                </div>
                <div className="stat-content">
                  <h3>{statistics.challenges.total}</h3>
                  <p>Défis</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#ed893620', color: '#ed8936' }}>
                  📊
                </div>
                <div className="stat-content">
                  <h3>{statistics.scores.total}</h3>
                  <p>Scores</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#764ba220', color: '#764ba2' }}>
                  🏆
                </div>
                <div className="stat-content">
                  <h3>{statistics.scores.totalPoints}</h3>
                  <p>Points totaux</p>
                </div>
              </div>
            </div>
          )}

          {/* Top 5 Équipes */}
          <div className="card">
            <div className="card-header">
              <h2>Top 5 Équipes</h2>
              <Link to={ROUTES.RANKING} className="link">Voir tout →</Link>
            </div>
            <div className="ranking-list">
              {topTeams.map((item) => (
                <div key={item.team.id} className="ranking-item">
                  <div className="rank-badge" style={{ backgroundColor: item.team.color }}>
                    #{item.rank}
                  </div>
                  <div className="team-info">
                    <h4>{item.team.name}</h4>
                    <p>{item.membersCount} membres</p>
                  </div>
                  <div className="team-score">{item.totalScore} pts</div>
                </div>
              ))}
            </div>
          </div>

          {/* Défis Actifs */}
          <div className="card">
            <div className="card-header">
              <h2>Défis Actifs</h2>
              <Link to={ROUTES.CHALLENGES} className="link">Voir tout →</Link>
            </div>
            <div className="challenges-list">
              {activeChallenges.map((challenge) => (
                <div key={challenge.id} className="challenge-item">
                  <div className="challenge-header">
                    <h4>{challenge.title}</h4>
                    <span className={`badge badge-${challenge.difficulty}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="challenge-description">{challenge.description}</p>
                  <div className="challenge-footer">
                    <span className="challenge-points">{challenge.points} points</span>
                    <Link 
                      to={`/challenges/${challenge.id}`} 
                      className="btn btn-sm btn-primary"
                    >
                      Voir détails
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Rapides */}
          <div className="card">
            <h2>Actions Rapides</h2>
            <div className="quick-actions">
              <Link to={ROUTES.TEAMS} className="action-btn">
                <span className="action-icon">👥</span>
                <span>Gérer les équipes</span>
              </Link>
              <Link to={ROUTES.SCORES} className="action-btn">
                <span className="action-icon">📝</span>
                <span>Soumettre un score</span>
              </Link>
              <Link to="/scores/all" className="action-btn">
                <span className="action-icon">📊</span>
                <span>Voir tous les scores</span>
              </Link>
              <Link to={ROUTES.RANKING} className="action-btn">
                <span className="action-icon">🏆</span>
                <span>Voir le classement</span>
              </Link>
              {user?.role === 'admin' && (
                <Link to={ROUTES.ADMIN_DASHBOARD} className="action-btn">
                  <span className="action-icon">⚙️</span>
                  <span>Espace Admin</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

