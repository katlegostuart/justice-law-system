import { useAuth } from '../context/AuthContext';

export default function ClientDashboard() {
  const { user } = useAuth();
  return (
    <>
      <h3 className="mb-1">Client Dashboard</h3>
      <p className="text-muted">Welcome, {user.name}</p>
      <p>Your profile, cases, attorney and tasks will appear here (read-only).</p>
    </>
  );
}
