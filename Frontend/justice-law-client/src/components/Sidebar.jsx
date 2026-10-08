import { NavLink } from 'react-router-dom';
import Icon from './Icon';

// Each role only gets its own menu items.
const menus = {
  Admin: [
    { label: 'Dashboard', to: '/admin', end: true, icon: 'grid' },
    { label: 'Clients Management', to: '/admin/clients', icon: 'users' },
    { label: 'Attorneys Management', to: '/admin/attorneys', icon: 'briefcase' },
    { label: 'Cases & Dockets', to: '/admin/cases', icon: 'folder' },
    { label: 'Legal Tasks & Activities', to: '/admin/tasks', icon: 'checkSquare' },
  ],
  Attorney: [
    { label: 'Dashboard', to: '/attorney', end: true, icon: 'grid' },
    { label: 'My Cases', to: '/attorney/cases', icon: 'folder' },
    { label: 'Legal Tasks & Activities', to: '/attorney/tasks', icon: 'checkSquare' },
  ],
  Client: [
    { label: 'My Dashboard', to: '/client', end: true, icon: 'grid' },
  ],
};

export default function Sidebar({ role }) {
  const items = menus[role] || [];
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <Icon name="scale" size={22} />
        </span>
        <div className="brand-text">
          <strong>JUSTICELAW</strong>
          <small>ATTORNEYS</small>
        </div>
      </div>

      <div className="nav-section">{role === 'Client' ? 'CLIENT PORTAL' : 'LEGAL OPERATIONS'}</div>
      <nav>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
          >
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
