import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import scoreService from '../../services/score.service';
import challengeService from '../../services/challenge.service';
import './Admin.css';
import './AdminExtended.css';

const MyParticipations = () => {
  const navigate = useNavigate();
  const [participations, setParticipations] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', challengeId: '' });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      const [participationsData, challengesData] = await Promise.all([
        scoreService.getMyChallengeScores(filter),
        challengeService.getMyChallenges(),
      ]);
      setParticipations(participationsData.data || []);
      setMyChallenges(challengesData);
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

  const pendingCount = participations.filter(p => p.status === 'pending').length;

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <div className="admin-header">
          <h1>Participations à Mes Défis</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            {pendingCount > 0 && (
              <span className="pending-badge">{pendingCount} en attente</span>
            )}
            <Link to="/admin/my-challenges" className="btn btn-sm">← Mes défis</Link>
          </div>
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

          <select
            value={filter.challengeId}
            onChange={(e) => setFilter({ ...filter, challengeId: e.target.value })}
            className="filter-select"
          >
            <option value="">Tous mes défis</option>
            {myChallenges.map((challenge) => (
              <option key={challenge.id} value={challenge.id}>
                {challenge.title}
              </option>
            ))}
          </select>
        </div>

        <div className="participations-grid">
          {participations.map((participation) => (
            <div key={participation.id} className="card participation-card">
              <div className="participation-header">
                <div>
                  <h3>{participation.team?.name}</h3>
                  <p className="challenge-title">{participation.challenge?.title}</p>
                </div>
                <div className="score-badge-large">
                  {participation.totalPoints}
                  <span>points</span>
                </div>
              </div>

              <div className="participation-content">
                <div className="participation-details">
                  <div className="detail-row">
                    <strong>Points de base:</strong>
                    <span>{participation.points} pts</span>
                  </div>
                  {participation.bonus > 0 && (
                    <div className="detail-row">
                      <strong>Bonus:</strong>
                      <span className="bonus-text">+{participation.bonus} pts</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <strong>Statut:</strong>
                    <span className={`badge badge-${participation.status}`}>
                      {participation.status === 'validated' && '✅ Validé'}
                      {participation.status === 'rejected' && '❌ Rejeté'}
                      {participation.status === 'pending' && '⏳ En attente'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <strong>Soumis le:</strong>
                    <span>{new Date(participation.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {participation.workSubmission && (
                  <div className="work-submission">
                    <strong>Travail soumis:</strong>
                    <div className="work-content">
                      {participation.workSubmission.startsWith('http') ? (
                        <a 
                          href={participation.workSubmission} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="work-link"
                        >
                          🔗 Voir le travail ({participation.workSubmission})
                        </a>
                      ) : (
                        <p>{participation.workSubmission}</p>
                      )}
                    </div>
                  </div>
                )}

                {participation.notes && (
                  <div className="participation-notes">
                    <strong>Notes de l'équipe:</strong>
                    <p>{participation.notes}</p>
                  </div>
                )}

                {participation.status === 'pending' && (
                  <div className="participation-actions">
                    <button
                      onClick={() => navigate(`/admin/participations/${participation.id}/validate`)}
                      className="btn btn-success"
                    >
                      ✅ Valider et Noter
                    </button>
                    <button
                      onClick={() => navigate(`/admin/participations/${participation.id}/reject`)}
                      className="btn btn-danger"
                    >
                      ❌ Rejeter
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {participations.length === 0 && (
          <div className="card">
            <div className="empty-state">
              <p>Aucune participation trouvée</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyParticipations;

