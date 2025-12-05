import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import { useAuth } from '../../context/AuthContext';
import challengeService from '../../services/challenge.service';
import { CHALLENGE_CATEGORIES, CHALLENGE_DIFFICULTIES } from '../../utils/constants';
import './Challenges.css';

const ChallengeList = () => {
  const { isAdmin } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: '', difficulty: '', isActive: '' });

  useEffect(() => {
    loadChallenges();
  }, [filter]);

  const loadChallenges = async () => {
    try {
      const params = {};
      if (filter.category) params.category = filter.category;
      if (filter.difficulty) params.difficulty = filter.difficulty;
      if (filter.isActive !== '') params.isActive = filter.isActive;
      
      const response = await challengeService.getChallenges(params);
      setChallenges(response.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
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
        <div className="page-header">
          <h1>Défis</h1>
        </div>

        <div className="filters">
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="filter-select"
          >
            <option value="">Toutes les catégories</option>
            {CHALLENGE_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          <select
            value={filter.difficulty}
            onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
            className="filter-select"
          >
            <option value="">Toutes les difficultés</option>
            {CHALLENGE_DIFFICULTIES.map((diff) => (
              <option key={diff.value} value={diff.value}>
                {diff.label}
              </option>
            ))}
          </select>

          <select
            value={filter.isActive}
            onChange={(e) => setFilter({ ...filter, isActive: e.target.value })}
            className="filter-select"
          >
            <option value="">Tous</option>
            <option value="true">Actifs</option>
            <option value="false">Inactifs</option>
          </select>
        </div>

        <div className="challenges-grid">
          {challenges.map((challenge) => (
            <Link
              key={challenge.id}
              to={`/challenges/${challenge.id}`}
              className="challenge-card"
            >
              <div className="challenge-header-card">
                <h3>{challenge.title}</h3>
                <div className="challenge-badges">
                  <span className={`badge badge-${challenge.difficulty}`}>
                    {challenge.difficulty}
                  </span>
                  <span className="badge badge-category">
                    {CHALLENGE_CATEGORIES.find(c => c.value === challenge.category)?.label}
                  </span>
                </div>
              </div>
              <p className="challenge-description-card">
                {challenge.description}
              </p>
              <div className="challenge-footer-card">
                <div className="challenge-info-footer">
                  <div className="challenge-points-large">{challenge.points} points</div>
                  {challenge.creator && (
                    <div className="challenge-creator">
                      <span className="creator-label">Créé par:</span>
                      <span className="creator-name">{challenge.creator.name}</span>
                    </div>
                  )}
                </div>
                <span className={`status-badge ${challenge.isActive ? 'active' : 'inactive'}`}>
                  {challenge.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {challenges.length === 0 && (
          <div className="empty-state">Aucun défi trouvé</div>
        )}
      </main>
    </div>
  );
};

export default ChallengeList;

