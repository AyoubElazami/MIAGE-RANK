import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UsersManagement from './pages/Admin/UsersManagement';
import TeamList from './pages/Teams/TeamList';
import TeamDetail from './pages/Teams/TeamDetail';
import ChallengeList from './pages/Challenges/ChallengeList';
import ChallengeDetail from './pages/Challenges/ChallengeDetail';
import Ranking from './pages/Ranking/Ranking';
import ScoreForm from './pages/Scores/ScoreForm';
import ScoreValidation from './pages/Admin/ScoreValidation';
import ScoreDetail from './pages/Scores/ScoreDetail';
import AllScores from './pages/Scores/AllScores';
import MyChallenges from './pages/Admin/MyChallenges';
import MyParticipations from './pages/Admin/MyParticipations';
import CreateChallenge from './pages/Admin/CreateChallenge';
import ParticipationDetail from './pages/Admin/ParticipationDetail';

import { ROUTES } from './utils/constants';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          
          {/* Route racine */}
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          
          {/* Routes protégées */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Routes admin */}
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_USERS}
            element={
              <ProtectedRoute requireAdmin>
                <UsersManagement />
              </ProtectedRoute>
            }
          />
          
          {/* Routes équipes */}
          <Route
            path={ROUTES.TEAMS}
            element={
              <ProtectedRoute>
                <TeamList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams/:id"
            element={
              <ProtectedRoute>
                <TeamDetail />
              </ProtectedRoute>
            }
          />
          
          {/* Routes défis */}
          <Route
            path={ROUTES.CHALLENGES}
            element={
              <ProtectedRoute>
                <ChallengeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges/:id"
            element={
              <ProtectedRoute>
                <ChallengeDetail />
              </ProtectedRoute>
            }
          />
          
          {/* Routes classement */}
          <Route path={ROUTES.RANKING} element={<Ranking />} />
          
          {/* Routes scores */}
          <Route
            path={ROUTES.SCORES}
            element={
              <ProtectedRoute>
                <ScoreForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scores/submit"
            element={
              <ProtectedRoute>
                <ScoreForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scores/all"
            element={
              <ProtectedRoute>
                <AllScores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scores/:id"
            element={
              <ProtectedRoute>
                <ScoreDetail />
              </ProtectedRoute>
            }
          />
          
          {/* Routes admin */}
          <Route
            path="/admin/scores"
            element={
              <ProtectedRoute requireAdmin>
                <ScoreValidation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/my-challenges"
            element={
              <ProtectedRoute requireAdmin>
                <MyChallenges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/challenges/create"
            element={
              <ProtectedRoute requireAdmin>
                <CreateChallenge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/participations"
            element={
              <ProtectedRoute requireAdmin>
                <MyParticipations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/participations/:id/validate"
            element={
              <ProtectedRoute requireAdmin>
                <ParticipationDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/participations/:id/reject"
            element={
              <ProtectedRoute requireAdmin>
                <ParticipationDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
