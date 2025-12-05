import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import { useAuth } from '../../context/AuthContext';
import scoreService from '../../services/score.service';
import { ROUTES } from '../../utils/constants';
import './Scores.css';

const ScoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    loadScore();
  }, [id]);

  const loadScore = async () => {
    try {
      const data = await scoreService.getScoreById(id);
      setScore(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (status) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir ${status === 'validated' ? 'valider' : 'rejeter'} ce score ?`)) {
      return;
    }

    setValidating(true);
    try {
      await scoreService.validateScore(id, { status });
      await loadScore();
      alert(`Score ${status === 'validated' ? 'validé' : 'rejeté'} avec succès !`);
      if (status === 'validated') {
        navigate(ROUTES.RANKING);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la validation');
    } finally {
      setValidating(false);
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

  if (!score) {
    return (
      <div className="main-layout">
        <Header />
        <div className="error-container">Score non trouvé</div>
      </div>
    );
  }

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Link to={score.status === 'pending' && isAdmin ? '/admin/scores' : '/scores/all'} className="back-link">
          ← Retour
        </Link>

        <div className="score-detail-card">
          <div className="score-detail-header">
            <div>
              <h1>{score.team?.name}</h1>
              <p className="challenge-subtitle">{score.challenge?.title}</p>
            </div>
            <div className="score-total-large">
              {score.totalPoints}
              <span>points</span>
            </div>
          </div>

          <div className="score-detail-content">
            <div className="detail-section">
              <h3>Détails du Score</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Points de base :</strong>
                  <span>{score.points} pts</span>
                </div>
                <div className="detail-item">
                  <strong>Bonus :</strong>
                  <span>{score.bonus > 0 ? `+${score.bonus} pts` : 'Aucun'}</span>
                </div>
                <div className="detail-item">
                  <strong>Total :</strong>
                  <span className="total-highlight">{score.totalPoints} pts</span>
                </div>
                <div className="detail-item">
                  <strong>Statut :</strong>
                  <span className={`badge badge-${score.status}`}>
                    {score.status === 'validated' && '✅ Validé'}
                    {score.status === 'rejected' && '❌ Rejeté'}
                    {score.status === 'pending' && '⏳ En attente'}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Catégorie :</strong>
                  <span className={`badge badge-${score.challenge?.category}`}>
                    {score.challenge?.category}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Difficulté :</strong>
                  <span className={`badge badge-${score.challenge?.difficulty}`}>
                    {score.challenge?.difficulty}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Soumis le :</strong>
                  <span>{new Date(score.created_at).toLocaleString('fr-FR')}</span>
                </div>
                {score.validatedAt && (
                  <div className="detail-item">
                    <strong>Validé le :</strong>
                    <span>{new Date(score.validatedAt).toLocaleString('fr-FR')}</span>
                  </div>
                )}
                {score.validator && (
                  <div className="detail-item">
                    <strong>Validé par :</strong>
                    <span>{score.validator.name}</span>
                  </div>
                )}
              </div>
            </div>

            {score.notes && (
              <div className="detail-section">
                <h3>Notes</h3>
                <div className="notes-box">
                  <p>{score.notes}</p>
                </div>
              </div>
            )}

            {score.status === 'pending' && isAdmin && (
              <div className="detail-section">
                <h3>Actions Admin</h3>
                <div className="validation-actions">
                  <button
                    onClick={() => handleValidate('validated')}
                    className="btn btn-success btn-large"
                    disabled={validating}
                  >
                    {validating ? 'Validation...' : '✅ Valider ce score'}
                  </button>
                  <button
                    onClick={() => handleValidate('rejected')}
                    className="btn btn-danger btn-large"
                    disabled={validating}
                  >
                    {validating ? 'Rejet...' : '❌ Rejeter ce score'}
                  </button>
                </div>
              </div>
            )}

            <div className="detail-section">
              <h3>Équipe</h3>
              <Link to={`/teams/${score.team?.id}`} className="team-link">
                <div
                  className="team-color-bar"
                  style={{ backgroundColor: score.team?.color }}
                />
                {score.team?.name}
              </Link>
            </div>

            <div className="detail-section">
              <h3>Défi</h3>
              <Link to={`/challenges/${score.challenge?.id}`} className="challenge-link">
                {score.challenge?.title}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScoreDetail;

