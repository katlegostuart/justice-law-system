import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <Sidebar role={user.role} />
      <div className="app-main">
        <header className="app-topbar">
          <span className="fw-semibold">{user.name}</span>
          <Badge bg="warning" text="dark">{user.role}</Badge>
          <Button size="sm" variant="outline-danger" onClick={handleLogout}>Logout</Button>
        </header>
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
