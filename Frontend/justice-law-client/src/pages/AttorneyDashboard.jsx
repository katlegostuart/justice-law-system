import { Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function AttorneyDashboard() {
  const { user, logout } = useAuth();
  return (
    <Container className="mt-5">
      <h2>Attorney Dashboard</h2>
      <p>Welcome, {user.name}</p>
      <Button variant="outline-danger" onClick={logout}>Logout</Button>
    </Container>
  );
}
