import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import { useAuth } from '../../context/AuthContext';
import teamService from '../../services/team.service';
import scoreService from '../../services/score.service';
import { ROUTES } from '../../utils/constants';
import './Teams.css';

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamData();
  }, [id]);

  const loadTeamData = async () => {
    try {
      const [teamData, scoresData] = await Promise.all([
        teamService.getTeamById(id),
        scoreService.getScores({ teamId: id }),
      ]);
      setTeam(teamData);
      setScores(scoresData.data || []);
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

  if (!team) {
    return (
      <div className="main-layout">
        <Header />
        <div className="error-container">Équipe non trouvée</div>
      </div>
    );
  }

  const isLeader = team.members?.some(
    (member) => member.id === user?.id && member.TeamMember?.role === 'leader'
  );

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Link to={ROUTES.TEAMS} className="back-link">← Retour aux équipes</Link>

        <div className="team-detail-header" style={{ borderLeftColor: team.color }}>
          <div>
            <h1>{team.name}</h1>
            <p className="team-rank-large">Rang #{team.rank}</p>
            {team.description && <p className="team-description-large">{team.description}</p>}
          </div>
          <div className="team-stats-large">
            <div className="stat-item">
              <div className="stat-value">{team.totalScore}</div>
              <div className="stat-label">Points totaux</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{team.members?.length || 0}</div>
              <div className="stat-label">Membres</div>
            </div>
          </div>
        </div>

        <div className="team-detail-grid">
          <div className="card">
            <h2>Membres</h2>
            <div className="members-list">
              {team.members?.map((member) => (
                <div key={member.id} className="member-item">
                  <div>
                    <h4>{member.name}</h4>
                    <p>{member.email}</p>
                  </div>
                  {member.TeamMember?.role === 'leader' && (
                    <span className="badge badge-leader">Leader</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2>Scores</h2>
            <div className="scores-list">
              {scores.map((score) => (
                <div key={score.id} className="score-item-detail">
                  <div>
                    <h4>{score.challenge?.title}</h4>
                    <p>{score.challenge?.category}</p>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamDetail;

