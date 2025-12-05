import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import { useAuth } from '../../context/AuthContext';
import challengeService from '../../services/challenge.service';
import scoreService from '../../services/score.service';
import teamService from '../../services/team.service';
import { CHALLENGE_CATEGORIES } from '../../utils/constants';
import './Challenges.css';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [scores, setScores] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenge();
  }, [id]);

  const loadChallenge = async () => {
    try {
      const [challengeData, scoresData, teamsData] = await Promise.all([
        challengeService.getChallengeById(id),
        scoreService.getScores({ challengeId: id }),
        user ? teamService.getTeams({ limit: 100 }).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
      ]);
      setChallenge(challengeData);
      setScores(scoresData.data || []);
      
      // Filtrer les équipes où l'utilisateur est membre
      if (user && teamsData.data) {
        const filtered = teamsData.data.filter(team => 
          team.members?.some(m => m.id === user.id)
        );
        setUserTeams(filtered);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = () => {
    // Rediriger vers le formulaire de soumission avec le défi pré-sélectionné
    navigate(`/scores/submit?challengeId=${id}`);
  };

  if (loading) {
    return (
      <div className="main-layout">
        <Header />
        <div className="loading-container">Chargement...</div>
      </div>
    );
  }

  if (!challenge) return null;

  const isActive = challenge.isActive && 
    new Date(challenge.startDate) <= new Date() &&
    (!challenge.endDate || new Date(challenge.endDate) >= new Date());

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Link to="/challenges" className="back-link">← Retour aux défis</Link>

        <div className="challenge-detail-header">
          <div>
            <h1>{challenge.title}</h1>
            <div className="challenge-meta">
              <span className={`badge badge-${challenge.difficulty}`}>
                {challenge.difficulty}
              </span>
              <span className="badge badge-category">
                {CHALLENGE_CATEGORIES.find(c => c.value === challenge.category)?.label}
              </span>
              <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                {isActive ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
          <div className="challenge-points-header">
            <div className="points-value">{challenge.points}</div>
            <div className="points-label">points</div>
          </div>
        </div>

        <div className="challenge-detail-content">
          {/* Bouton pour participer */}
          {isActive && user && user.role !== 'admin' && (
            <div className="card participation-card">
              {userTeams.length > 0 ? (
                <div>
                  <h3>Participer à ce défi</h3>
                  <p>Vous êtes membre de {userTeams.length} équipe{userTeams.length > 1 ? 's' : ''}. Soumettez votre travail pour ce défi !</p>
                  <button onClick={handleParticipate} className="btn btn-primary btn-large">
                    🚀 Participer à ce défi
                  </button>
                </div>
              ) : (
                <div>
                  <h3>Participer à ce défi</h3>
                  <p>Vous devez être membre d'une équipe pour participer à ce défi.</p>
                  <Link to="/teams" className="btn btn-primary">
                    Voir les équipes
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="card">
            <h2>Description</h2>
            <p>{challenge.description}</p>
            
            <div className="challenge-info-grid">
              <div className="info-item">
                <strong>Date de début:</strong>
                <span>{new Date(challenge.startDate).toLocaleDateString('fr-FR')}</span>
              </div>
              {challenge.endDate && (
                <div className="info-item">
                  <strong>Date de fin:</strong>
                  <span>{new Date(challenge.endDate).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
              {challenge.maxTeams && (
                <div className="info-item">
                  <strong>Équipes max:</strong>
                  <span>{challenge.maxTeams}</span>
                </div>
              )}
              {challenge.creator && (
                <div className="info-item creator-info">
                  <strong>Créé par:</strong>
                  <span className="creator-name-badge">{challenge.creator.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2>Scores soumis ({scores.length})</h2>
            <div className="scores-list">
              {scores.map((score) => (
                <div key={score.id} className="score-item-detail">
                  <div>
                    <h4>{score.team?.name}</h4>
                    <p>{new Date(score.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <span className={`badge badge-${score.status}`}>
                      {score.status === 'validated' ? '✓ Validé' : 
                       score.status === 'rejected' ? '✗ Rejeté' : '⏳ En attente'}
                    </span>
                    <div className="score-points">{score.totalPoints} pts</div>
                  </div>
                </div>
              ))}
            </div>
            {scores.length === 0 && <p>Aucun score soumis</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChallengeDetail;

