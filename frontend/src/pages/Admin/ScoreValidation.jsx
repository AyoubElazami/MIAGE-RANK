import { useEffect, useState } from 'react';
import Header from '../../components/Layout/Header';
import scoreService from '../../services/score.service';
import { Link } from 'react-router-dom';
import './Admin.css';

const ScoreValidation = () => {
  const [pendingScores, setPendingScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validatingId, setValidatingId] = useState(null);

  useEffect(() => {
    loadPendingScores();
  }, []);

  const loadPendingScores = async () => {
    try {
      const response = await scoreService.getScores({ status: 'pending' });
      setPendingScores(response.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (scoreId, status) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir ${status === 'validated' ? 'valider' : 'rejeter'} ce score ?`)) {
      return;
    }

    setValidatingId(scoreId);
    try {
      await scoreService.validateScore(scoreId, { status });
      await loadPendingScores();
      alert(`Score ${status === 'validated' ? 'validé' : 'rejeté'} avec succès !`);
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la validation');
    } finally {
      setValidatingId(null);
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
        <div className="admin-header">
          <h1>Validation des Scores</h1>
          <Link to="/admin/dashboard" className="btn btn-sm">← Retour</Link>
        </div>

        {pendingScores.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <p>✅ Aucun score en attente de validation</p>
            </div>
          </div>
        ) : (
          <div className="scores-validation-grid">
            {pendingScores.map((score) => (
              <div key={score.id} className="card score-validation-card">
                <div className="score-header">
                  <div>
                    <h3>{score.team?.name}</h3>
                    <p className="challenge-title">{score.challenge?.title}</p>
                  </div>
                  <div className="score-points-badge">
                    {score.totalPoints}
                    <span>points</span>
                  </div>
                </div>

                <div className="score-details">
                  <div className="detail-row">
                    <strong>Points de base :</strong>
                    <span>{score.points} pts</span>
                  </div>
                  {score.bonus > 0 && (
                    <div className="detail-row">
                      <strong>Bonus :</strong>
                      <span className="bonus-text">+{score.bonus} pts</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <strong>Total :</strong>
                    <span className="total-text">{score.totalPoints} pts</span>
                  </div>
                  <div className="detail-row">
                    <strong>Catégorie :</strong>
                    <span className={`badge badge-${score.challenge?.category}`}>
                      {score.challenge?.category}
                    </span>
                  </div>
                  <div className="detail-row">
                    <strong>Soumis le :</strong>
                    <span>{new Date(score.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {score.notes && (
                  <div className="score-notes">
                    <strong>Notes de l'équipe :</strong>
                    <p>{score.notes}</p>
                  </div>
                )}

                <div className="validation-actions">
                  <button
                    onClick={() => handleValidate(score.id, 'validated')}
                    className="btn btn-success"
                    disabled={validatingId === score.id}
                  >
                    {validatingId === score.id ? 'Validation...' : '✅ Valider'}
                  </button>
                  <button
                    onClick={() => handleValidate(score.id, 'rejected')}
                    className="btn btn-danger"
                    disabled={validatingId === score.id}
                  >
                    {validatingId === score.id ? 'Rejet...' : '❌ Rejeter'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="card" style={{ marginTop: '32px' }}>
          <h2>Statistiques</h2>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-value">{pendingScores.length}</div>
              <div className="stat-label">Scores en attente</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {pendingScores.reduce((sum, s) => sum + s.totalPoints, 0)}
              </div>
              <div className="stat-label">Points totaux en attente</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScoreValidation;

