import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import challengeService from '../../services/challenge.service';
import { CHALLENGE_CATEGORIES, CHALLENGE_DIFFICULTIES } from '../../utils/constants';
import './Admin.css';
import './AdminExtended.css';

const CreateChallenge = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technique',
    points: 100,
    difficulty: 'moyen',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    maxTeams: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const challengeData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        maxTeams: formData.maxTeams ? parseInt(formData.maxTeams) : null,
      };

      await challengeService.createChallenge(challengeData);
      alert('Défi créé avec succès !');
      navigate('/admin/my-challenges');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du défi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <div className="admin-header">
          <h1>Créer un Nouveau Défi</h1>
          <Link to="/admin/my-challenges" className="btn btn-sm">← Retour</Link>
        </div>

        <div className="card form-card">
          {error && <div className="error-message" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="title">Titre du défi *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                maxLength={100}
                placeholder="Ex: Développement API REST"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={6}
                placeholder="Décrivez le défi en détail..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Catégorie *</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {CHALLENGE_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="difficulty">Difficulté *</label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  required
                >
                  {CHALLENGE_DIFFICULTIES.map((diff) => (
                    <option key={diff.value} value={diff.value}>
                      {diff.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="points">Points *</label>
                <input
                  type="number"
                  id="points"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  required
                  min="1"
                  max="2000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxTeams">Équipes max (optionnel)</label>
                <input
                  type="number"
                  id="maxTeams"
                  value={formData.maxTeams}
                  onChange={(e) => setFormData({ ...formData, maxTeams: e.target.value })}
                  min="1"
                  placeholder="Illimité si vide"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Date de début *</label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">Date de fin (optionnel)</label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Défi actif (visible par les équipes)
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Création...' : 'Créer le défi'}
              </button>
              <Link to="/admin/my-challenges" className="btn">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateChallenge;

