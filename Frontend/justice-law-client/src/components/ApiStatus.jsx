import { useData } from '../context/DataContext';

const SHOW_WHEN_OK = true; // set to false to hide the green badge once everything works

export default function ApiStatus() {
  const { apiStatus, apiError, clearApiError, clients, attorneys, cases, tasks } = useData();
  if (apiStatus === 'idle') return null;
  let color = '#64748b';
  let text = 'Using sample data (not the database)';
  if (apiStatus === 'loading') { color = '#b45309'; text = 'Connecting to the API...'; }
  if (apiStatus === 'ok') {
    color = '#15803d';
    text = `Database connected: ${clients.length} clients, ${attorneys.length} attorneys, ${cases.length} cases, ${tasks.length} tasks`;
  }
  if (apiStatus === 'error') { color = '#b91c1c'; text = `API error: ${apiError}`; }
  if (apiStatus === 'ok' && apiError) { color = '#b91c1c'; text = `Not saved: ${apiError}`; }
  if (apiStatus === 'ok' && !apiError && !SHOW_WHEN_OK) return null;

  return (
    <div
      role="status"
      style={{
        position: 'fixed', right: 16, bottom: 16, zIndex: 9999, maxWidth: 420,
        padding: '10px 14px', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600,
        background: color, boxShadow: '0 4px 16px rgba(0,0,0,.25)',
      }}
    >
      {text}
      {apiError && apiStatus === 'ok' && (
        <button
          type="button"
          onClick={clearApiError}
          style={{ marginLeft: 10, background: 'transparent', border: '1px solid #fff', color: '#fff', borderRadius: 6, padding: '1px 8px' }}
        >
          Dismiss
        </button>
      )}
    </div>
  );
}