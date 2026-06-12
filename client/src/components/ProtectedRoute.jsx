import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  const parentContext = useOutletContext();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet context={parentContext} />;
}
