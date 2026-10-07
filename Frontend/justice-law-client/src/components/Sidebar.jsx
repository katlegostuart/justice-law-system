import { NavLink } from 'react-router-dom';

const menus = {
  Admin: [
    { label: 'Dashboard', to: '/admin', end: true },
    { label: 'Clients', to: '/admin/clients' },
    { label: 'Attorneys', to: '/admin/attorneys' },
    { label: 'Cases', to: '/admin/cases' },
    { label: 'Legal Tasks', to: '/admin/tasks' },
  ],
  Attorney: [
    { label: 'Dashboard', to: '/attorney', end: true },
    { label: 'My Cases', to: '/attorney/cases' },
    { label: 'Legal Tasks', to: '/attorney/tasks' },
  ],
  Client: [
    { label: 'Dashboard', to: '/client', end: true },
  ],
};

export default function Sidebar({ role }) {
  const items = menus[role] || [];
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        JUSTICELAW
        <small>ATTORNEYS</small>
      </div>
      <nav>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
