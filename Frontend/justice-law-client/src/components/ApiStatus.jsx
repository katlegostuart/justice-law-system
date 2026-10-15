import { useData } from '../context/DataContext';

const COLORS = { mock: '#64748b', loading: '#b45309', ok: '#15803d', error: '#b91c1c' };

export default function ApiStatus() {
  const { apiStatus, apiError, clients, attorneys, cases, tasks } = useData();

  const text = {
    mock: 'Using sample data (not the API)',
    loading: 'Connecting to the API...',
    ok: `API connected: ${clients.length} clients, ${attorneys.length} attorneys, ${cases.length} cases, ${tasks.length} tasks`,
    error: `API error: ${apiError}`,
  }[apiStatus];

  return (
    <div
      role="status"
      style={{
        position: 'fixed', right: 16, bottom: 16, zIndex: 9999, maxWidth: 380,
        padding: '8px 14px', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600,
        background: COLORS[apiStatus], boxShadow: '0 4px 16px rgba(0,0,0,.25)',
      }}
    >
      {text}
    </div>
  );
}