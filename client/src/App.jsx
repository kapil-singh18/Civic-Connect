import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import AuthPage from './pages/AuthPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AnalyticsPage from './pages/admin/AnalyticsPage.jsx';
import IssueManagement from './pages/admin/IssueManagement.jsx';
import CitizenDashboard from './pages/citizen/CitizenDashboard.jsx';
import IssueDetails from './pages/citizen/IssueDetails.jsx';
import Leaderboard from './pages/citizen/Leaderboard.jsx';
import ReportIssue from './pages/citizen/ReportIssue.jsx';
import MapView from './pages/shared/MapView.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/citizen'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/" element={<HomeRedirect />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/citizen/report" element={<ReportIssue />} />
          <Route path="/citizen/issues/:id" element={<IssueDetails />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/map" element={<MapView />} />
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/issues" element={<IssueManagement />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
