import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Icon from './Icon';
import { Avatar } from './ui';
import { useAuth } from '../context/AuthContext';
import { DataProvider } from '../context/DataContext';

const roleTitle = {
  Admin: 'Administrator',
  Attorney: 'Attorney',
  Client: 'Client',
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DataProvider>
      <div className="app-shell">
        <Sidebar role={user.role} />
        <div className="app-main">
          <header className="app-topbar">
            <div className="topbar-title">
              JusticeLaw Attorneys
              <small>Law Firm Management Portal</small>
            </div>
            <div className="topbar-right">
              <div className="user-chip">
                <div className="user-meta">
                  <strong>{user.name}</strong>
                  <span>{roleTitle[user.role] || user.role}</span>
                </div>
                <Avatar name={user.name} size={38} />
              </div>
              <button type="button" className="btn-logout" onClick={handleLogout}>
                <Icon name="logout" size={16} />
                <span>Logout</span>
              </button>
            </div>
          </header>
          <main className="app-content">
            <Outlet />
          </main>
        </div>
      </div>
    </DataProvider>
  );
}
