import Icon from './Icon';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "2024-01-12" -> "12 Jan 2024"
export function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function initials(name = '') {
  return name
    .replace(/^(Adv\.?|Advocate)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

// Round avatar with initials
export function Avatar({ name = '', size = 36, tone }) {
  const sum = [...name].reduce((s, ch) => s + ch.charCodeAt(0), 0);
  const t = tone || (sum % 2 === 0 ? 'navy' : 'peach');
  return (
    <span className={`avatar avatar-${t}`} style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}>
      {initials(name)}
    </span>
  );
}

const slug = (s) => s.toLowerCase().replace(/\s+/g, '-');

// Coloured label for a status: Open, In Progress, Pending Hearing, Closed, Not Started, Complete
export const StatusPill = ({ status }) => <span className={`pill pill-${slug(status)}`}>{status}</span>;

export const TypePill = ({ type }) => <span className="pill pill-type">{type}</span>;

export function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
      {children && <div className="page-actions">{children}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, icon, tone }) {
  return (
    <div className={'stat-card' + (tone ? ` stat-${tone}` : '')}>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {hint && <div className="stat-hint">{hint}</div>}
      </div>
      {icon && (
        <span className="stat-icon">
          <Icon name={icon} size={20} />
        </span>
      )}
    </div>
  );
}

function pageNumbers(page, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const nums = new Set([1, count, page - 1, page, page + 1]);
  const sorted = [...nums].filter((n) => n >= 1 && n <= count).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push('...');
    out.push(n);
  });
  return out;
}

export function Pager({ page, pageCount, total, pageSize, onChange }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="pager">
      <span className="pager-info">
        Showing {from}-{to} of {total}
      </span>
      <div className="pager-buttons">
        <button type="button" className="pager-btn" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
          <Icon name="chevronLeft" size={16} />
        </button>
        {pageNumbers(page, pageCount).map((n, i) =>
          n === '...' ? (
            <span key={`gap-${i}`} className="pager-gap">...</span>
          ) : (
            <button type="button" key={n} className={'pager-btn' + (n === page ? ' active' : '')} onClick={() => onChange(n)}>
              {n}
            </button>
          )
        )}
        <button type="button" className="pager-btn" disabled={page >= pageCount} onClick={() => onChange(page + 1)} aria-label="Next page">
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
    </div>
  );
}
