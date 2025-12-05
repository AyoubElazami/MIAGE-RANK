import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import adminService from '../../services/admin.service';
import { ROUTES } from '../../utils/constants';
import './Admin.css';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setError('');
      setLoading(true);
      const data = await adminService.getDashboard();
      console.log('Dashboard data:', data);
      setDashboard(data);
    } catch (error) {
      console.error('Erreur complète:', error);
      console.error('Erreur response:', error.response);
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Erreur lors du chargement du dashboard';
      setError(errorMessage);
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

  if (error) {
    return (
      <div className="main-layout">
        <Header />
        <main className="main-content">
          <div className="error-container">
            <h2>Erreur</h2>
            <p>{error}</p>
            <button onClick={loadDashboard} className="btn btn-primary">
              Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="main-layout">
        <Header />
        <main className="main-content">
          <div className="error-container">
            <h2>Chargement...</h2>
            <p>Récupération des données en cours...</p>
            <button onClick={loadDashboard} className="btn btn-primary">
              Recharger
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Valeurs par défaut si certaines données sont manquantes
  const stats = dashboard.statistics || {
    users: { total: 0, admins: 0, regular: 0 },
    teams: { total: 0 },
    challenges: { total: 0 },
    scores: { total: 0, pending: 0 }
  };

  const recentUsers = dashboard.recentUsers || [];
  const recentPendingScores = dashboard.recentPendingScores || [];

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <div className="admin-header">
          <h1>Espace Administrateur</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/admin/scores" className="btn btn-primary">
              {stats.scores.pending > 0 && (
                <span style={{ background: '#f56565', borderRadius: '50%', padding: '2px 8px', marginRight: '8px' }}>
                  {stats.scores.pending}
                </span>
              )}
              Valider les scores
            </Link>
          <Link to="/admin/my-challenges" className="btn btn-primary">
            Mes défis
          </Link>
          <Link to={ROUTES.ADMIN_USERS} className="btn btn-primary">
            Gérer les utilisateurs
          </Link>
          </div>
        </div>

        <div className="admin-grid">
          {/* Statistiques */}
          <div className="admin-stats-grid">
            <div className="stat-card">
              <h3>{stats.users.total}</h3>
              <p>Total Utilisateurs</p>
              <span className="stat-detail">{stats.users.admins} admins</span>
            </div>
            <div className="stat-card">
              <h3>{stats.teams.total}</h3>
              <p>Équipes</p>
            </div>
            <div className="stat-card">
              <h3>{stats.challenges.total}</h3>
              <p>Défis</p>
            </div>
            <div className="stat-card">
              <h3>{stats.scores.total}</h3>
              <p>Scores validés</p>
              <span className="stat-detail alert">
                {stats.scores.pending} en attente
              </span>
            </div>
          </div>

          {/* Derniers utilisateurs */}
          <div className="card">
            <h2>Derniers utilisateurs</h2>
            <div className="users-list">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.id} className="user-item">
                    <div>
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                    <span className={`badge badge-${user.role}`}>{user.role}</span>
                  </div>
                ))
              ) : (
                <p>Aucun utilisateur récent</p>
              )}
            </div>
          </div>

          {/* Scores en attente */}
          <div className="card">
            <h2>Scores en attente de validation</h2>
            <div className="scores-list">
              {recentPendingScores.length === 0 ? (
                <p>Aucun score en attente</p>
              ) : (
                recentPendingScores.map((score) => (
                  <div key={score.id} className="score-item">
                    <div>
                      <h4>{score.team?.name || 'Équipe inconnue'}</h4>
                      <p>{score.challenge?.title || 'Défi inconnu'}</p>
                    </div>
                    <div className="score-actions">
                      <span className="score-points">{score.totalPoints || 0} pts</span>
                      <Link to={`/scores/${score.id}`} className="btn btn-sm btn-primary">
                        Voir détails
                      </Link>
                      <Link to="/admin/scores" className="btn btn-sm" style={{ background: '#48bb78', color: 'white' }}>
                        Valider
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

