import { useAuth } from '../context/AuthContext';

export default function AttorneyDashboard() {
  const { user } = useAuth();
  return (
    <>
      <h3 className="mb-1">Attorney Dashboard</h3>
      <p className="text-muted">Welcome, {user.name}</p>
      <p>Your assigned cases and legal tasks will appear here.</p>
    </>
  );
}
