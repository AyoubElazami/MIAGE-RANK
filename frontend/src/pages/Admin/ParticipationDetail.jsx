import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import scoreService from '../../services/score.service';
import './Admin.css';
import './AdminExtended.css';

const ParticipationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [validationData, setValidationData] = useState({
    status: 'validated',
    points: '',
    bonus: 0,
    notes: '',
  });

  useEffect(() => {
    loadScore();
  }, [id]);

  const loadScore = async () => {
    try {
      const data = await scoreService.getScoreById(id);
      setScore(data);
      setValidationData({
        status: data.status === 'pending' ? 'validated' : data.status,
        points: data.points.toString(),
        bonus: data.bonus || 0,
        notes: data.notes || '',
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!validationData.points) {
      alert('Veuillez entrer les points attribués');
      return;
    }

    if (!window.confirm(`Êtes-vous sûr de vouloir ${validationData.status === 'validated' ? 'valider' : 'rejeter'} cette participation ?`)) {
      return;
    }

    setValidating(true);
    try {
      // Mettre à jour les points si modifiés
      const totalPoints = parseInt(validationData.points) + (parseInt(validationData.bonus) || 0);
      
      // D'abord mettre à jour les points si nécessaire
      if (score.points !== parseInt(validationData.points) || score.bonus !== parseInt(validationData.bonus)) {
        await scoreService.updateScore(id, {
          points: parseInt(validationData.points),
          bonus: parseInt(validationData.bonus) || 0,
          totalPoints,
        });
      }

      // Puis valider ou rejeter
      await scoreService.validateScore(id, {
        status: validationData.status,
        notes: validationData.notes || undefined,
      });

      alert(`Participation ${validationData.status === 'validated' ? 'validée' : 'rejetée'} avec succès !`);
      navigate('/admin/participations');
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

  if (!score) return null;

  const isCreator = score.challenge?.createdBy === score.challenge?.creator?.id;

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Link to="/admin/participations" className="back-link">← Retour aux participations</Link>

        <div className="score-detail-card">
          <div className="score-detail-header">
            <div>
              <h1>Participation de {score.team?.name}</h1>
              <p className="challenge-subtitle">Défi : {score.challenge?.title}</p>
            </div>
            <div className="score-total-large">
              {score.totalPoints}
              <span>points</span>
            </div>
          </div>

          <div className="score-detail-content">
            <div className="detail-section">
              <h3>Travail Soumis</h3>
              {score.workSubmission ? (
                <div className="work-submission-box">
                  {score.workSubmission.startsWith('http') ? (
                    <a
                      href={score.workSubmission}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="work-link-large"
                    >
                      🔗 Voir le travail →
                      <span className="work-url">{score.workSubmission}</span>
                    </a>
                  ) : (
                    <p className="work-text">{score.workSubmission}</p>
                  )}
                </div>
              ) : (
                <p className="no-work">Aucun travail soumis</p>
              )}
            </div>

            <div className="detail-section">
              <h3>Détails de la Participation</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Équipe:</strong>
                  <span>{score.team?.name}</span>
                </div>
                <div className="detail-item">
                  <strong>Défi:</strong>
                  <span>{score.challenge?.title}</span>
                </div>
                <div className="detail-item">
                  <strong>Catégorie:</strong>
                  <span className={`badge badge-${score.challenge?.category}`}>
                    {score.challenge?.category}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Statut actuel:</strong>
                  <span className={`badge badge-${score.status}`}>
                    {score.status === 'validated' && '✅ Validé'}
                    {score.status === 'rejected' && '❌ Rejeté'}
                    {score.status === 'pending' && '⏳ En attente'}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Soumis le:</strong>
                  <span>{new Date(score.created_at).toLocaleString('fr-FR')}</span>
                </div>
              </div>
            </div>

            {score.notes && (
              <div className="detail-section">
                <h3>Notes de l'Équipe</h3>
                <div className="notes-box">
                  <p>{score.notes}</p>
                </div>
              </div>
            )}

            {score.status === 'pending' && (
              <div className="detail-section">
                <h3>Validation et Notation</h3>
                <div className="validation-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="validation-points">Points attribués *</label>
                      <input
                        type="number"
                        id="validation-points"
                        value={validationData.points}
                        onChange={(e) => setValidationData({ ...validationData, points: e.target.value })}
                        min="0"
                        max="2000"
                        required
                      />
                      <p className="form-hint">Points de base du défi : {score.challenge?.points || 0}</p>
                    </div>
                    <div className="form-group">
                      <label htmlFor="validation-bonus">Bonus</label>
                      <input
                        type="number"
                        id="validation-bonus"
                        value={validationData.bonus}
                        onChange={(e) => setValidationData({ ...validationData, bonus: e.target.value })}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Action</label>
                    <div className="radio-group">
                      <label>
                        <input
                          type="radio"
                          value="validated"
                          checked={validationData.status === 'validated'}
                          onChange={(e) => setValidationData({ ...validationData, status: e.target.value })}
                        />
                        ✅ Valider
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="rejected"
                          checked={validationData.status === 'rejected'}
                          onChange={(e) => setValidationData({ ...validationData, status: e.target.value })}
                        />
                        ❌ Rejeter
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="validation-notes">Notes de validation (optionnel)</label>
                    <textarea
                      id="validation-notes"
                      value={validationData.notes}
                      onChange={(e) => setValidationData({ ...validationData, notes: e.target.value })}
                      rows={3}
                      placeholder="Commentaires sur la participation..."
                    />
                  </div>

                  <div className="validation-actions">
                    <button
                      onClick={handleValidate}
                      className={`btn btn-large ${validationData.status === 'validated' ? 'btn-success' : 'btn-danger'}`}
                      disabled={validating}
                    >
                      {validating ? 'Traitement...' : (validationData.status === 'validated' ? '✅ Valider' : '❌ Rejeter')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParticipationDetail;

