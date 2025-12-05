import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import './Layout.css';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="header" role="banner">
      <div className="header-content">
        <Link to={ROUTES.DASHBOARD} className="logo">
          <div className="logo-icon"></div>
          <h1>MiageRank</h1>
        </Link>

        <nav className="nav" role="navigation" aria-label="Navigation principale">
          <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
          <Link to={ROUTES.TEAMS}>Équipes</Link>
          <Link to={ROUTES.CHALLENGES}>Défis</Link>
          <Link to={ROUTES.RANKING}>Classement</Link>
          <Link to="/scores/all">Scores</Link>
          {isAdmin && (
            <Link to={ROUTES.ADMIN_DASHBOARD}>Admin</Link>
          )}
        </nav>

        <div className="user-menu">
          <span className="user-name">{user?.name}</span>
          <button 
            onClick={handleLogout} 
            className="btn btn-logout"
            aria-label="Se déconnecter"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

