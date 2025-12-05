import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import challengeService from '../../services/challenge.service';
import { ROUTES } from '../../utils/constants';
import './Admin.css';
import './AdminExtended.css';

const MyChallenges = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyChallenges();
  }, []);

  const loadMyChallenges = async () => {
    try {
      setLoading(true);
      const data = await challengeService.getMyChallenges();
      setChallenges(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      console.error('Erreur response:', error.response);
      // Afficher un message d'erreur mais continuer
      setChallenges([]);
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
        <div className="admin-header">
          <h1>Mes Défis</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/admin/challenges/create" className="btn btn-primary">
              + Créer un défi
            </Link>
            <Link to="/admin/participations" className="btn btn-primary">
              Voir les participations
            </Link>
            <Link to={ROUTES.ADMIN_DASHBOARD} className="btn btn-sm">← Retour</Link>
          </div>
        </div>

        <div className="challenges-admin-grid">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="card challenge-admin-card">
              <div className="challenge-admin-header">
                <h3>{challenge.title}</h3>
                <span className={`badge badge-${challenge.difficulty}`}>
                  {challenge.difficulty}
                </span>
              </div>
              
              <p className="challenge-admin-description">{challenge.description}</p>
              
              <div className="challenge-admin-details">
                <div className="detail-item-small">
                  <strong>Catégorie:</strong>
                  <span className={`badge badge-${challenge.category}`}>
                    {challenge.category}
                  </span>
                </div>
                <div className="detail-item-small">
                  <strong>Points:</strong>
                  <span>{challenge.points} pts</span>
                </div>
                <div className="detail-item-small">
                  <strong>Participations:</strong>
                  <span>{challenge.participationsCount || challenge.scores?.length || 0}</span>
                </div>
                <div className="detail-item-small">
                  <strong>Statut:</strong>
                  <span className={challenge.isActive ? 'status-active' : 'status-inactive'}>
                    {challenge.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>

              <div className="challenge-admin-actions">
                <Link 
                  to={`/admin/challenges/${challenge.id}/participations`}
                  className="btn btn-sm btn-primary"
                >
                  Voir participations ({challenge.pendingCount || challenge.scores?.filter(s => s.status === 'pending').length || 0} en attente)
                </Link>
              </div>
            </div>
          ))}
        </div>

        {challenges.length === 0 && (
          <div className="card">
            <div className="empty-state">
              <p>Vous n'avez pas encore créé de défis.</p>
              <Link to="/admin/challenges/create" className="btn btn-primary">
                Créer votre premier défi
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyChallenges;

