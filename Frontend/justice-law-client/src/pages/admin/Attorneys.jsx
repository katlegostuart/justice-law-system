import Icon from '../../components/Icon';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Form, Button, Table, Modal } from 'react-bootstrap';
import { useData } from '../../context/DataContext';
import api from '../../services/api';

const SPECIALIZATIONS = ['Commercial Law', 'Criminal Law', 'Family Law', 'Labor Law', 'Property Law', 'Civil Law'];
const TIERS = ['Senior Partner', 'Junior Partner', 'Senior Counsel', 'Associate Advocate', 'Junior Advocate'];
const SENIOR_TIERS = ['Senior Partner', 'Junior Partner', 'Senior Counsel'];
const CHIPS = ['All Disciplines', 'Commercial', 'Criminal', 'Family', 'Labor', 'Property', 'Civil'];
const PAGE_SIZE = 5;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
.am{font-family:'DM Sans',system-ui,-apple-system,'Segoe UI',sans-serif;color:#0f172a;padding:24px;font-size:14px;line-height:1.4}
.am *{box-sizing:border-box}
.am-top{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:flex-end;margin-bottom:16px}
.am-crumb{font-size:11px;letter-spacing:.1em;font-weight:700;color:#64748b}
.am-crumb b{color:#c2410c}
.am h1{font-size:34px;font-weight:700;margin:4px 0 6px}
.am-sub{color:#64748b;max-width:520px;margin:0}
.am-btns{display:flex;gap:8px;flex-wrap:wrap}
.am .am-dark{background:#0f1729;border-color:#0f1729;color:#fff;font-weight:600}
.am .am-dark:hover,.am .am-dark:focus{background:#1e293b;border-color:#1e293b;color:#fff}
.am .am-light{background:#fff;border:1px solid #e2e8f0;color:#0f172a;font-weight:600}
.am .am-light:hover{background:#f8faff;border-color:#cbd5e1;color:#0f172a}
.am-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:16px}
.am-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px}
.am-lbl{font-size:10px;letter-spacing:.08em;font-weight:700;color:#64748b}
.am-big{font-size:34px;font-weight:700;line-height:1.1;margin:4px 0}
.am-big small{font-size:13px;font-weight:600;color:#c2410c;margin-left:6px}
.am-muted{color:#64748b;font-size:12px}
.am-tools{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px}
.am-tools .form-control{flex:1;min-width:220px}
.am-tools .form-select{width:190px}
.am-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
.am-chip{padding:5px 12px;border-radius:999px;border:1px solid #e2e8f0;background:#fff;font-size:12px;font-weight:600;cursor:pointer;color:#0f172a}
.am-chip.on{background:#0f1729;color:#fff;border-color:#0f1729}
.am-table th{font-size:10px;letter-spacing:.08em;color:#64748b;font-weight:700;background:#f6f8fc !important;border-bottom:1px solid #e5e7eb;white-space:nowrap}
.am-table td{vertical-align:middle;padding:12px 10px}
.am-sid{color:#c2410c;font-weight:700;font-size:12px;white-space:nowrap}
.am-pr{display:flex;gap:10px;align-items:center}
.am-av{width:38px;height:38px;border-radius:50%;background:#0f1729;color:#fff;display:grid;place-items:center;font-size:12px;font-weight:700;flex:0 0 38px}
.am-pr b{display:block;font-size:14px}
.am-pr small,.am-table td small{color:#64748b;font-size:11px;display:block}
.am-spec{background:#e6edfb;color:#1e3a8a;font-size:11px;font-weight:600;border-radius:5px;padding:2px 8px;white-space:nowrap}
.am-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px;font-size:12px;color:#64748b}
.am-pgs{display:flex;gap:4px}
.am-pg{border:1px solid #e2e8f0;background:#fff;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;cursor:pointer}
.am-pg.on{background:#0f1729;color:#fff;border-color:#0f1729}
.am-pg:disabled{opacity:.45;cursor:default}
.am-ok{background:#dcfce7;border:1px solid #bbf7d0;color:#15803d;border-radius:8px;padding:10px 14px;margin-bottom:16px;display:flex;justify-content:space-between;gap:8px}
.am-ok button{background:none;border:0;color:#15803d;font-weight:700;cursor:pointer}
`;

export default function Attorneys() {
  const { attorneys: rows, cases, caseload, refreshData } = useData();
  const location = useLocation();

  const [query, setQuery] = useState('');
  const [chip, setChip] = useState('All Disciplines');
  const [tier, setTier] = useState('All Tiers');
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const [notice, setNotice] = useState(location.state?.notice || '');

  /* ----- filtering, search, pagination ----- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (a) =>
        (chip === 'All Disciplines' || a.specialization.startsWith(chip)) &&
        (tier === 'All Tiers' || a.tier === tier) &&
        `${a.staffNumber} ${a.name} ${a.surname} ${a.specialization}`.toLowerCase().includes(q)
    );
  }, [rows, query, chip, tier]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const onQuery = (v) => { setQuery(v); setPage(1); };
  const onChip = (v) => { setChip(v); setPage(1); };
  const onTier = (v) => { setTier(v); setPage(1); };

  /* ----- stats ----- */
  const seniorCount = rows.filter((a) => SENIOR_TIERS.includes(a.tier)).length;
  const disciplines = new Set(rows.map((a) => a.specialization)).size;
  const available = rows.filter((a) => caseload(a.staffNumber) / (a.capacity || 8) < 0.6).length;

  // An attorney who still has cases cannot be deleted (the database refuses it).
  const casesOf = (attorney) => cases.filter((c) => c.attorneyId === attorney.id).length;
  const deleteBlocked = !!toDelete && casesOf(toDelete) > 0;

  const confirmDelete = async () => {
    try {
      await api.delete(`/Attorneys/${toDelete.id}`);
      setNotice(`${toDelete.name} ${toDelete.surname} was removed.`);
      setToDelete(null);
      refreshData();
    } catch (err) {
      alert("Error deleting attorney: " + err.message);
    }
  };

  const exportCsv = () => {
    const head = ['Staff Number', 'Name', 'Surname', 'Gender', 'Seniority', 'Specialization', 'Email', 'Phone', 'Capacity'];
    const lines = rows.map((a) =>
      [a.staffNumber, a.name, a.surname, a.gender, a.tier, a.specialization, a.email, a.phone, a.capacity]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const blob = new Blob([[head.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'counsel-list.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="am">
      <style>{CSS}</style>

      <div className="am-top">
        <div>
          <h1>Legal Counsel &amp; Attorney Directory</h1>
          <p className="am-sub">Manage practicing attorneys, legal specializations, contact records, and caseload quotas with precision.</p>
        </div>
        <div className="am-btns">
          <Button className="am-light" onClick={exportCsv}>Export Counsel List</Button>
          <Button as={Link} to="/admin/attorneys/new" className="am-dark">+ New Attorney Profile</Button>
        </div>
      </div>

      {notice && (
        <div className="am-ok" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')}>Dismiss</button>
        </div>
      )}

      <div className="am-stats">
        <div className="am-card">
          <div className="am-lbl">ACTIVE PERSONNEL</div>
          <div className="am-big">{rows.length}<small>Active Counsel</small></div>
          <div className="am-muted">{seniorCount} Senior, {rows.length - seniorCount} Associate / Junior</div>
        </div>
        <div className="am-card">
          <div className="am-lbl">PRACTICE BREADTH</div>
          <div className="am-big">{disciplines}<small>Core Disciplines</small></div>
          <div className="am-muted">Out of {SPECIALIZATIONS.length} practice areas covered</div>
        </div>
        <div className="am-card">
          <div className="am-lbl">ASSIGNMENT QUOTA</div>
          <div className="am-big">{available}<small>Available for Trial</small></div>
          <div className="am-muted">Caseload below 60% capacity threshold</div>
        </div>
      </div>

      <div className="am-card">
        <div className="am-tools">
          <Form.Control
            placeholder="Search counsel by staff number, name, surname or practice field..."
            aria-label="Search attorneys"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
          <Form.Select aria-label="Filter by seniority" value={tier} onChange={(e) => onTier(e.target.value)}>
            <option>All Tiers</option>
            {TIERS.map((t) => <option key={t}>{t}</option>)}
          </Form.Select>
        </div>

        <div className="am-chips" role="group" aria-label="Filter by specialty">
          <span className="am-lbl">SPECIALTY:</span>
          {CHIPS.map((c) => (
            <button key={c} type="button" className={`am-chip${chip === c ? ' on' : ''}`} onClick={() => onChip(c)}>
              {c}
            </button>
          ))}
        </div>

        <Table responsive hover className="am-table mb-0">
          <thead>
            <tr>
              <th>STAFF ID</th>
              <th>PRACTITIONER NAME</th>
              <th>SPECIALIZATION</th>
              <th>CONTACT DETAILS</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 && (
              <tr><td colSpan={5} className="text-center text-secondary py-4">No attorneys match your search.</td></tr>
            )}
            {shown.map((a) => (
              <tr key={a.id}>
                <td><span className="am-sid">{a.staffNumber}</span></td>
                <td>
                  <div className="am-pr">
                    <span className="am-av">{a.name[0]}{a.surname[0]}</span>
                    <div><b>Adv. {a.name} {a.surname}</b><small>{a.tier} • {a.gender}</small></div>
                  </div>
                </td>
                <td><span className="am-spec">{a.specialization}</span></td>
                <td>{a.email}<small>{a.phone}</small></td>
                <td className="text-end text-nowrap">
                  <div className="row-actions">
                    <Link to={`/admin/attorneys/edit/${a.id}`} className="icon-btn" aria-label="Edit attorney" title="Edit attorney"><Icon name="edit" size={15} /></Link>
                    <button type="button" className="icon-btn danger" onClick={() => setToDelete(a)} aria-label="Delete attorney" title="Delete attorney"><Icon name="trash" size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="am-foot">
          <span>Showing {shown.length} of {filtered.length} Registered Attorneys</span>
          {pages > 1 && (
            <div className="am-pgs">
              <button type="button" className="am-pg" disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button key={n} type="button" className={`am-pg${n === current ? ' on' : ''}`} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button type="button" className="am-pg" disabled={current === pages} onClick={() => setPage(current + 1)}>Next</button>
            </div>
          )}
        </div>
      </div>

      <Modal show={!!toDelete} onHide={() => setToDelete(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5">{deleteBlocked ? 'Attorney cannot be removed' : 'Remove attorney?'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteBlocked
            ? <>Adv. {toDelete?.name} {toDelete?.surname} ({toDelete?.staffNumber}) still has {casesOf(toDelete)} case(s). Reassign those cases first.</>
            : <>Remove Adv. {toDelete?.name} {toDelete?.surname} ({toDelete?.staffNumber}) from the roster? This cannot be undone.</>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="link" className="text-secondary" onClick={() => setToDelete(null)}>{deleteBlocked ? 'Close' : 'Cancel'}</Button>
          {!deleteBlocked && <Button variant="danger" onClick={confirmDelete}>Delete</Button>}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
