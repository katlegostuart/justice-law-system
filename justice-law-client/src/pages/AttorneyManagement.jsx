import { useMemo, useRef, useState } from 'react';
import { Form, Button, Table, Modal } from 'react-bootstrap';

/* ---------- Options ---------- */
const SPECIALIZATIONS = ['Commercial Law', 'Criminal Law', 'Family Law', 'Labor Law', 'Property Law', 'Civil Law'];
const TIERS = ['Senior Partner', 'Junior Partner', 'Senior Counsel', 'Associate Advocate', 'Junior Advocate'];
const SENIOR_TIERS = ['Senior Partner', 'Junior Partner', 'Senior Counsel'];
const CHIPS = ['All Disciplines', 'Commercial', 'Criminal', 'Family', 'Labor', 'Property', 'Civil'];
const PAGE_SIZE = 5;

/* ---------- Validation rules ---------- */
const NAME_RE = /^[A-Za-z' -]{2,}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9 ()-]{10,18}$/;

/* ---------- Mock data (replace with API calls later) ---------- */
const SEED = [
  { id: 1, staffNo: 'STF-102', name: 'Thabo', surname: 'Sithole', gender: 'Male', tier: 'Senior Counsel', specialization: 'Commercial Law', email: 't.sithole@justicelaw.co.za', phone: '+27 11 555 0192', capacity: 8, caseload: 6 },
  { id: 2, staffNo: 'STF-104', name: 'Katlego', surname: 'Mokgohlwa', gender: 'Female', tier: 'Junior Partner', specialization: 'Criminal Law', email: 'k.mokgohlwa@justicelaw.co.za', phone: '+27 11 555 0831', capacity: 8, caseload: 4 },
  { id: 3, staffNo: 'STF-108', name: 'Sipho', surname: 'Ndlovu', gender: 'Male', tier: 'Associate Advocate', specialization: 'Labor Law', email: 's.ndlovu@justicelaw.co.za', phone: '+27 31 440 2110', capacity: 8, caseload: 3 },
  { id: 4, staffNo: 'STF-111', name: 'Nandi', surname: 'Van Der Merwe', gender: 'Female', tier: 'Senior Counsel', specialization: 'Property Law', email: 'n.vandermerwe@justicelaw.co.za', phone: '+27 21 401 9904', capacity: 8, caseload: 5 },
  { id: 5, staffNo: 'STF-115', name: 'Lerato', surname: 'Khumalo', gender: 'Female', tier: 'Junior Advocate', specialization: 'Family Law', email: 'l.khumalo@justicelaw.co.za', phone: '+27 11 555 7712', capacity: 8, caseload: 2 },
];

const staffLabel = (n) => `STF-${String(n).padStart(3, '0')}`;
const emptyForm = (staffNo) => ({
  id: null, staffNo, name: '', surname: '', gender: '', tier: 'Associate Advocate',
  specialization: '', email: '', phone: '', capacity: '8',
});

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
.am-grid{display:grid;grid-template-columns:1fr 340px;gap:16px;align-items:start}
.am-grid>div{min-width:0}
.am-tools{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px}
.am-tools .form-control{flex:1;min-width:220px}
.am-tools .form-select{width:190px}
.am-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
.am-chip{padding:5px 12px;border-radius:999px;border:1px solid #e2e8f0;background:#fff;font-size:12px;font-weight:600;cursor:pointer;color:#0f172a}
.am-chip.on{background:#0f1729;color:#fff;border-color:#0f1729}
.am-table th{font-size:10px;letter-spacing:.08em;color:#64748b;font-weight:700;background:#f6f8fc !important;border-bottom:1px solid #e5e7eb}
.am-table td{vertical-align:middle;padding:12px 10px}
.am-sid{color:#c2410c;font-weight:700;font-size:12px}
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
.am-form{position:sticky;top:16px}
.am-form h2{font-size:22px;font-weight:700;margin:2px 0 14px}
.am-form .form-label{font-size:12px;font-weight:600;margin-bottom:4px}
.am-form .form-group,.am-form .mb-3{margin-bottom:12px !important}
.am-err{color:#dc3545;font-size:12px;margin-top:4px}
.am-note{background:#f1f6ff;border:1px solid #dbe6fb;border-radius:8px;padding:10px 12px;font-size:12px;color:#475569;margin-top:12px}
.am-ok{background:#dcfce7;border:1px solid #bbf7d0;color:#15803d;border-radius:8px;padding:10px 14px;margin-bottom:16px;display:flex;justify-content:space-between;gap:8px}
.am-ok button{background:none;border:0;color:#15803d;font-weight:700;cursor:pointer}
@media (max-width:1000px){.am-grid{grid-template-columns:1fr}.am-form{position:static}}
`;

export default function Attorneys() {
  const [rows, setRows] = useState(SEED);
  const nextNo = useRef(116);
  const [form, setForm] = useState(() => emptyForm(staffLabel(116)));
  const [errors, setErrors] = useState({});
  const [query, setQuery] = useState('');
  const [chip, setChip] = useState('All Disciplines');
  const [tier, setTier] = useState('All Tiers');
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const [notice, setNotice] = useState('');

  /* ----- filtering, search, pagination ----- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (a) =>
        (chip === 'All Disciplines' || a.specialization.startsWith(chip)) &&
        (tier === 'All Tiers' || a.tier === tier) &&
        `${a.staffNo} ${a.name} ${a.surname} ${a.specialization}`.toLowerCase().includes(q)
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
  const available = rows.filter((a) => a.caseload / a.capacity < 0.6).length;

  /* ----- form ----- */
  const resetForm = () => { setForm(emptyForm(staffLabel(nextNo.current))); setErrors({}); };
  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const startEdit = (a) => {
    setForm({ ...a, capacity: String(a.capacity) });
    setErrors({});
    setNotice('');
  };

  const validate = () => {
    const e = {};
    const email = form.email.trim().toLowerCase();
    if (!NAME_RE.test(form.name.trim())) e.name = 'Enter a name using letters only (at least 2).';
    if (!NAME_RE.test(form.surname.trim())) e.surname = 'Enter a surname using letters only (at least 2).';
    if (!form.gender) e.gender = 'Select a gender.';
    if (!form.specialization) e.specialization = 'Select a specialization.';
    if (!EMAIL_RE.test(email)) e.email = 'Enter an email like name@justicelaw.co.za.';
    else if (rows.some((r) => r.id !== form.id && r.email.toLowerCase() === email)) e.email = 'This email is already registered.';
    if (!PHONE_RE.test(form.phone.trim())) e.phone = 'Enter a valid phone number, e.g. +27 11 555 0192.';
    const cap = Number(form.capacity);
    if (!Number.isInteger(cap) || cap < 1 || cap > 20) e.capacity = 'Enter a whole number from 1 to 20.';
    return e;
  };

  const save = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const clean = {
      ...form,
      name: form.name.trim(),
      surname: form.surname.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      capacity: Number(form.capacity),
    };
    if (form.id) {
      setRows((r) => r.map((x) => (x.id === form.id ? { ...x, ...clean } : x)));
      setNotice(`${clean.name} ${clean.surname} was updated.`);
    } else {
      setRows((r) => [...r, { ...clean, id: Date.now(), caseload: 0 }]);
      nextNo.current += 1;
      setNotice(`${clean.name} ${clean.surname} was added to the roster.`);
    }
    resetForm();
  };

  const confirmDelete = () => {
    setRows((r) => r.filter((x) => x.id !== toDelete.id));
    if (form.id === toDelete.id) resetForm();
    setNotice(`${toDelete.name} ${toDelete.surname} was removed.`);
    setToDelete(null);
  };

  const exportCsv = () => {
    const head = ['Staff Number', 'Name', 'Surname', 'Gender', 'Seniority', 'Specialization', 'Email', 'Phone', 'Capacity'];
    const lines = rows.map((a) =>
      [a.staffNo, a.name, a.surname, a.gender, a.tier, a.specialization, a.email, a.phone, a.capacity]
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

  const editing = form.id !== null;

  return (
    <div className="am">
      <style>{CSS}</style>

      <div className="am-top">
        <div>
          <div className="am-crumb">FIRM ADMIN &gt; <b>PERSONNEL &amp; ROSTER</b></div>
          <h1>Legal Counsel &amp; Attorney Directory</h1>
          <p className="am-sub">Manage practicing attorneys, legal specializations, contact records, and caseload quotas with precision.</p>
        </div>
        <div className="am-btns">
          <Button className="am-light" onClick={exportCsv}>Export Counsel List</Button>
          <Button className="am-dark" onClick={() => { resetForm(); setNotice(''); }}>+ New Attorney Profile</Button>
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

      <div className="am-grid">
        {/* Roster */}
        <div>
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
                    <td><span className="am-sid">{a.staffNo}</span></td>
                    <td>
                      <div className="am-pr">
                        <span className="am-av">{a.name[0]}{a.surname[0]}</span>
                        <div><b>Adv. {a.name} {a.surname}</b><small>{a.tier} • {a.gender}</small></div>
                      </div>
                    </td>
                    <td><span className="am-spec">{a.specialization}</span></td>
                    <td>{a.email}<small>{a.phone}</small></td>
                    <td className="text-end text-nowrap">
                      <Button variant="link" size="sm" onClick={() => startEdit(a)}>Edit</Button>
                      <Button variant="link" size="sm" className="text-danger" onClick={() => setToDelete(a)}>Delete</Button>
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
        </div>

        {/* Add / edit form */}
        <div>
          <Form noValidate onSubmit={save} className="am-card am-form">
            <div className="am-lbl" style={{ color: '#c2410c' }}>ROSTER MANAGEMENT</div>
            <h2>{editing ? 'Edit Legal Counsel' : 'Register Legal Counsel'}</h2>

            <Form.Group className="mb-3">
              <Form.Label>Staff Identification Number <span className="am-muted">(Auto-Generated)</span></Form.Label>
              <Form.Control value={form.staffNo} readOnly />
            </Form.Group>

            <div className="row g-2">
              <Form.Group className="col-6 mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control value={form.name} isInvalid={!!errors.name} placeholder="e.g. Bhekisisa" onChange={(e) => setField('name', e.target.value)} />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-6 mb-3">
                <Form.Label>Surname</Form.Label>
                <Form.Control value={form.surname} isInvalid={!!errors.surname} placeholder="e.g. Cele" onChange={(e) => setField('surname', e.target.value)} />
                <Form.Control.Feedback type="invalid">{errors.surname}</Form.Control.Feedback>
              </Form.Group>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Gender Identity</Form.Label>
              <div>
                {['Male', 'Female', 'Other'].map((g) => (
                  <Form.Check
                    key={g}
                    inline
                    type="radio"
                    id={`gender-${g}`}
                    name="gender"
                    label={g}
                    checked={form.gender === g}
                    onChange={() => setField('gender', g)}
                  />
                ))}
              </div>
              {errors.gender && <div className="am-err">{errors.gender}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Legal Specialization</Form.Label>
              <Form.Select value={form.specialization} isInvalid={!!errors.specialization} onChange={(e) => setField('specialization', e.target.value)}>
                <option value="">Select specialization…</option>
                {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.specialization}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Seniority</Form.Label>
              <Form.Select value={form.tier} onChange={(e) => setField('tier', e.target.value)}>
                {TIERS.map((t) => <option key={t}>{t}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Firm Email Address</Form.Label>
              <Form.Control type="email" value={form.email} isInvalid={!!errors.email} placeholder="b.cele@justicelaw.co.za" onChange={(e) => setField('email', e.target.value)} />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Direct Phone Number</Form.Label>
              <Form.Control type="tel" value={form.phone} isInvalid={!!errors.phone} placeholder="+27 11 555 9012" onChange={(e) => setField('phone', e.target.value)} />
              <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Caseload Maximum Capacity <span className="am-muted">(Default: 8 Matters)</span></Form.Label>
              <Form.Control type="number" min="1" max="20" value={form.capacity} isInvalid={!!errors.capacity} onChange={(e) => setField('capacity', e.target.value)} />
              <Form.Control.Feedback type="invalid">{errors.capacity}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className="am-dark w-100">{editing ? 'Update Counsel Record' : 'Save Counsel Record'}</Button>
            <div className="text-center mt-2">
              <Button variant="link" size="sm" className="text-secondary" onClick={resetForm}>{editing ? 'Cancel Edit' : 'Clear Form'}</Button>
            </div>
            <div className="am-note">Saving adds the attorney to the roster so they can be assigned to cases.</div>
          </Form>
        </div>
      </div>

      <Modal show={!!toDelete} onHide={() => setToDelete(null)} centered>
        <Modal.Header closeButton><Modal.Title as="h2" className="h5">Remove attorney?</Modal.Title></Modal.Header>
        <Modal.Body>
          Remove Adv. {toDelete?.name} {toDelete?.surname} ({toDelete?.staffNo}) from the roster? This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="link" className="text-secondary" onClick={() => setToDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}