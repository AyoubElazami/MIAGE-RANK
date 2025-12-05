import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import { useAuth } from '../../context/AuthContext';
import teamService from '../../services/team.service';
import { ROUTES } from '../../utils/constants';
import './Teams.css';

const TeamList = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
  });

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const response = await teamService.getTeams({ limit: 50 });
      setTeams(response.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await teamService.createTeam(formData);
      setShowForm(false);
      setFormData({ name: '', description: '', color: '#3B82F6' });
      loadTeams();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase()) ||
    team.description?.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1>Équipes</h1>
          {isAuthenticated && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn-primary"
            >
              {showForm ? 'Annuler' : '+ Créer une équipe'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="card form-card">
            <h2>Créer une nouvelle équipe</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Nom de l'équipe *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  maxLength={50}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  maxLength={500}
                />
              </div>
              <div className="form-group">
                <label>Couleur</label>
                <div className="color-picker">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Créer l'équipe
              </button>
            </form>
          </div>
        )}

        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher une équipe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="teams-grid">
          {filteredTeams.map((team) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="team-card"
              style={{ borderTopColor: team.color }}
            >
              <div className="team-header">
                <h3>{team.name}</h3>
                <div className="team-rank">#{team.rank}</div>
              </div>
              {team.description && (
                <p className="team-description">{team.description}</p>
              )}
              <div className="team-footer">
                <div className="team-members">
                  👥 {team.members?.length || 0} membres
                </div>
                <div className="team-score">{team.totalScore} points</div>
              </div>
            </Link>
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <div className="empty-state">
            <p>Aucune équipe trouvée</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeamList;

