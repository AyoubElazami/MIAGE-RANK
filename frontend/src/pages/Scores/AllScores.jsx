import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import { useAuth } from '../../context/AuthContext';
import scoreService from '../../services/score.service';
import { ROUTES } from '../../utils/constants';
import './Scores.css';

const AllScores = () => {
  const { user, isAdmin } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', teamId: '', challengeId: '' });

  useEffect(() => {
    loadScores();
  }, [filter]);

  const loadScores = async () => {
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.teamId) params.teamId = filter.teamId;
      if (filter.challengeId) params.challengeId = filter.challengeId;
      
      const response = await scoreService.getScores(params);
      setScores(response.data || []);
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
          <h1>Tous les Scores</h1>
          <Link to={ROUTES.SCORES} className="btn btn-primary">
            + Soumettre un score
          </Link>
        </div>

        <div className="filters">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="filter-select"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="validated">Validés</option>
            <option value="rejected">Rejetés</option>
          </select>
        </div>

        <div className="scores-table-container">
          <table className="scores-table">
            <thead>
              <tr>
                <th>Équipe</th>
                <th>Défi</th>
                <th>Points</th>
                <th>Bonus</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score) => (
                <tr key={score.id}>
                  <td>
                    <div className="team-cell">
                      <div
                        className="team-color-dot"
                        style={{ backgroundColor: score.team?.color }}
                      />
                      {score.team?.name}
                    </div>
                  </td>
                  <td>{score.challenge?.title}</td>
                  <td>{score.points} pts</td>
                  <td>{score.bonus > 0 ? `+${score.bonus}` : '-'}</td>
                  <td className="total-points">{score.totalPoints} pts</td>
                  <td>
                    <span className={`badge badge-${score.status}`}>
                      {score.status === 'validated' && '✅ Validé'}
                      {score.status === 'rejected' && '❌ Rejeté'}
                      {score.status === 'pending' && '⏳ En attente'}
                    </span>
                  </td>
                  <td>{new Date(score.created_at).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <Link to={`/scores/${score.id}`} className="btn btn-sm btn-primary">
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {scores.length === 0 && (
            <div className="empty-state">
              <p>Aucun score trouvé</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllScores;

