import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import { useAuth } from '../../context/AuthContext';
import scoreService from '../../services/score.service';
import challengeService from '../../services/challenge.service';
import teamService from '../../services/team.service';
import { ROUTES } from '../../utils/constants';
import './Scores.css';

const ScoreForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const challengeIdFromUrl = searchParams.get('challengeId');
  
  const [formData, setFormData] = useState({
    challengeId: challengeIdFromUrl || '',
    teamId: '',
    points: '',
    bonus: '0',
    notes: '',
    workSubmission: '',
  });
  const [challenges, setChallenges] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [challengeIdFromUrl]);

  const loadData = async () => {
    try {
      const [challengesData, teamsData] = await Promise.all([
        challengeService.getActiveChallenges(),
        teamService.getTeams({ limit: 100 }),
      ]);
      setChallenges(challengesData);
      
      // Filtrer les équipes où l'utilisateur est membre
      const teams = teamsData.data || [];
      const filtered = teams.filter(team => 
        team.members?.some(m => m.id === user?.id)
      );
      setUserTeams(filtered);

      // Si un challengeId est fourni dans l'URL, pré-remplir le formulaire
      if (challengeIdFromUrl && challengesData.length > 0) {
        const challenge = challengesData.find(c => c.id === parseInt(challengeIdFromUrl));
        if (challenge) {
          setSelectedChallenge(challenge);
          setFormData(prev => ({
            ...prev,
            challengeId: challengeIdFromUrl,
            points: challenge.points.toString()
          }));
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await scoreService.submitScore({
        challengeId: parseInt(formData.challengeId),
        teamId: parseInt(formData.teamId),
        points: parseInt(formData.points),
        bonus: parseInt(formData.bonus) || 0,
        notes: formData.notes || undefined,
        workSubmission: formData.workSubmission || undefined,
      });
      
      alert('Score soumis avec succès !');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <div className="page-header">
          <h1>Soumettre un Score</h1>
        </div>

        <div className="card form-card">
          {error && <div className="error-message" role="alert">{error}</div>}

          {userTeams.length === 0 ? (
            <div className="warning-box">
              <p>Vous devez être membre d'une équipe pour soumettre un score.</p>
              <a href={ROUTES.TEAMS} className="btn btn-primary">Voir les équipes</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="challengeId">Défi *</label>
                <select
                  id="challengeId"
                  value={formData.challengeId}
                  onChange={(e) => {
                    const challenge = challenges.find(c => c.id === parseInt(e.target.value));
                    setSelectedChallenge(challenge);
                    setFormData({ 
                      ...formData, 
                      challengeId: e.target.value,
                      points: challenge ? challenge.points.toString() : ''
                    });
                  }}
                  required
                >
                  <option value="">Sélectionner un défi</option>
                  {challenges.map((challenge) => (
                    <option key={challenge.id} value={challenge.id}>
                      {challenge.title} ({challenge.points} pts - {challenge.difficulty})
                    </option>
                  ))}
                </select>
                {selectedChallenge && (
                  <p className="form-hint">
                    Points de base du défi : <strong>{selectedChallenge.points} pts</strong>
                    {selectedChallenge.description && (
                      <span className="challenge-hint"> - {selectedChallenge.description.substring(0, 100)}...</span>
                    )}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="teamId">Équipe *</label>
                <select
                  id="teamId"
                  value={formData.teamId}
                  onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                  required
                >
                  <option value="">Sélectionner votre équipe</option>
                  {userTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="points">Points *</label>
                  <input
                    type="number"
                    id="points"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bonus">Bonus</label>
                  <input
                    type="number"
                    id="bonus"
                    value={formData.bonus}
                    onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="workSubmission">Lien vers votre travail *</label>
                <input
                  type="url"
                  id="workSubmission"
                  value={formData.workSubmission}
                  onChange={(e) => setFormData({ ...formData, workSubmission: e.target.value })}
                  placeholder="https://github.com/votre-repo, https://drive.google.com/..., etc."
                  required
                />
                <p className="form-hint">
                  Fournissez un lien vers votre travail (GitHub, Google Drive, site web, etc.)
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes explicatives (optionnel)</label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  maxLength={500}
                  placeholder="Décrivez votre réalisation, les technologies utilisées, les difficultés rencontrées..."
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Soumission...' : 'Soumettre le score'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ScoreForm;

