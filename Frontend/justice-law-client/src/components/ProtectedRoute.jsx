import { Navigate } from 'react-router-dom';
import { useAuth, roleHome } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRole, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) return <Navigate to={roleHome[user.role]} replace />;

  return children;
}
