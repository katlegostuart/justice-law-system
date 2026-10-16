import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useData } from '../../context/DataContext';
import api from '../../services/api';

const SPECIALIZATIONS = ['Commercial Law', 'Criminal Law', 'Family Law', 'Labor Law', 'Property Law', 'Civil Law'];
const TIERS = ['Senior Partner', 'Junior Partner', 'Senior Counsel', 'Associate Advocate', 'Junior Advocate'];

const NAME_RE = /^[A-Za-z' -]{2,}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9 ()-]{10,18}$/;

const LIST_PATH = '/admin/attorneys';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
.am{font-family:'DM Sans',system-ui,-apple-system,'Segoe UI',sans-serif;color:#0f172a;padding:24px;font-size:14px;line-height:1.4}
.am *{box-sizing:border-box}
.am-crumb{font-size:11px;letter-spacing:.1em;font-weight:700;color:#64748b}
.am-crumb b{color:#c2410c}
.am h1{font-size:34px;font-weight:700;margin:4px 0 6px}
.am-sub{color:#64748b;max-width:560px;margin:0 0 16px}
.am-back{display:inline-block;margin-bottom:12px;font-size:13px;font-weight:600;color:#475569;text-decoration:none}
.am-back:hover{color:#0f172a}
.am .am-dark{background:#0f1729;border-color:#0f1729;color:#fff;font-weight:600}
.am .am-dark:hover,.am .am-dark:focus{background:#1e293b;border-color:#1e293b;color:#fff}
.am .am-light{background:#fff;border:1px solid #e2e8f0;color:#0f172a;font-weight:600}
.am .am-light:hover{background:#f8faff;border-color:#cbd5e1;color:#0f172a}
.am-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:24px;max-width:820px}
.am-lbl{font-size:10px;letter-spacing:.08em;font-weight:700;color:#64748b}
.am-muted{color:#64748b;font-size:12px}
.am .form-label{font-size:12px;font-weight:600;margin-bottom:4px}
.am-err{color:#dc3545;font-size:12px;margin-top:4px}
.am-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
.am-note{background:#f1f6ff;border:1px solid #dbe6fb;border-radius:8px;padding:10px 12px;font-size:12px;color:#475569;margin-top:16px}
`;

const emptyForm = (staffNo) => ({
  id: null, staffNo, name: '', surname: '', gender: '', tier: 'Associate Advocate',
  specialization: '', email: '', phone: '', capacity: '8',
});

export default function AttorneyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { attorneys } = useData(); // swapped to useData

  const existing = id ? attorneys.find((r) => String(r.id) === id) : null;
  const editing = !!id;

  const [form, setForm] = useState(() =>
    existing 
      ? { ...existing, capacity: String(existing.capacity) } 
      : emptyForm(`STF-${Math.floor(1000 + Math.random() * 9000)}`)
  );
  const [errors, setErrors] = useState({});

  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  if (editing && !existing) {
    return (
      <div className="am">
        <style>{CSS}</style>
        <h1>Attorney not found</h1>
        <p className="am-sub">That attorney doesn't exist or was removed.</p>
        <Button as={Link} to={LIST_PATH} className="am-dark">Back to directory</Button>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    const email = form.email.trim().toLowerCase();
    if (!NAME_RE.test(form.name.trim())) e.name = 'Enter a name using letters only (at least 2).';
    if (!NAME_RE.test(form.surname.trim())) e.surname = 'Enter a surname using letters only (at least 2).';
    if (!form.gender) e.gender = 'Select a gender.';
    if (!form.specialization) e.specialization = 'Select a specialization.';
    if (!EMAIL_RE.test(email)) e.email = 'Enter an email like name@justicelaw.co.za.';
    else if (attorneys.some((r) => r.id !== form.id && r.email.toLowerCase() === email)) e.email = 'This email is already registered.';
    if (!PHONE_RE.test(form.phone.trim())) e.phone = 'Enter a valid phone number, e.g. +27 11 555 0192.';
    const cap = Number(form.capacity);
    if (!Number.isInteger(cap) || cap < 1 || cap > 20) e.capacity = 'Enter a whole number from 1 to 20.';
    return e;
  };

  const save = async (ev) => {
  ev.preventDefault();
  const e = validate();
  setErrors(e);
  if (Object.keys(e).length) return;

  const payload = {
    staffNumber: form.staffNo,
    name: form.name.trim(),
    surname: form.surname.trim(),
    gender: form.gender,
    email: form.email.trim(),
    phoneNumber: form.phone.trim(),
    specialization: form.specialization
  };

  try {
    if (editing) {
      await api.put(`/Attorneys/${existing.id}`, payload);
      navigate(LIST_PATH, { state: { notice: `${payload.name} was updated.` } });
    } else {
      await api.post('/Attorneys', payload);
      navigate(LIST_PATH, { state: { notice: `${payload.name} was added to the roster.` } });
    }
  } catch (err) {
    alert("Error saving attorney: " + err.message);
  }
};

  return (
    <div className="am">
      <style>{CSS}</style>

      <Link to={LIST_PATH} className="am-back">&larr; Back to attorney directory</Link>
      <div className="am-crumb">
        FIRM ADMIN &gt; PERSONNEL &amp; ROSTER &gt; <b>{editing ? 'EDIT PROFILE' : 'NEW PROFILE'}</b>
      </div>
      <h1>{editing ? 'Edit Legal Counsel' : 'Register Legal Counsel'}</h1>
      <p className="am-sub">
        {editing
          ? 'Update this attorney\'s details, specialization and caseload capacity.'
          : 'Add a new attorney to the roster so they can be assigned to cases.'}
      </p>

      <Form noValidate onSubmit={save} className="am-card">
        <div className="row g-3">
          <Form.Group className="col-md-6">
            <Form.Label>Staff Identification Number <span className="am-muted">(Auto-Generated)</span></Form.Label>
            <Form.Control value={form.staffNo} readOnly />
          </Form.Group>
          <div className="col-md-6" />

          <Form.Group className="col-md-6">
            <Form.Label>Name</Form.Label>
            <Form.Control value={form.name} isInvalid={!!errors.name} placeholder="e.g. Bhekisisa" onChange={(e) => setField('name', e.target.value)} />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="col-md-6">
            <Form.Label>Surname</Form.Label>
            <Form.Control value={form.surname} isInvalid={!!errors.surname} placeholder="e.g. Cele" onChange={(e) => setField('surname', e.target.value)} />
            <Form.Control.Feedback type="invalid">{errors.surname}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="col-md-6">
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
          <Form.Group className="col-md-6">
            <Form.Label>Seniority</Form.Label>
            <Form.Select value={form.tier} onChange={(e) => setField('tier', e.target.value)}>
              {TIERS.map((t) => <option key={t}>{t}</option>)}
            </Form.Select>
          </Form.Group>

          <Form.Group className="col-md-6">
            <Form.Label>Legal Specialization</Form.Label>
            <Form.Select value={form.specialization} isInvalid={!!errors.specialization} onChange={(e) => setField('specialization', e.target.value)}>
              <option value="">Select specialization…</option>
              {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.specialization}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="col-md-6">
            <Form.Label>Caseload Maximum Capacity <span className="am-muted">(Default: 8 Matters)</span></Form.Label>
            <Form.Control type="number" min="1" max="20" value={form.capacity} isInvalid={!!errors.capacity} onChange={(e) => setField('capacity', e.target.value)} />
            <Form.Control.Feedback type="invalid">{errors.capacity}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="col-md-6">
            <Form.Label>Firm Email Address</Form.Label>
            <Form.Control type="email" value={form.email} isInvalid={!!errors.email} placeholder="b.cele@justicelaw.co.za" onChange={(e) => setField('email', e.target.value)} />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="col-md-6">
            <Form.Label>Direct Phone Number</Form.Label>
            <Form.Control type="tel" value={form.phone} isInvalid={!!errors.phone} placeholder="+27 11 555 9012" onChange={(e) => setField('phone', e.target.value)} />
            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="am-actions">
          <Button type="submit" className="am-dark">{editing ? 'Update Counsel Record' : 'Save Counsel Record'}</Button>
          <Button as={Link} to={LIST_PATH} className="am-light">Cancel</Button>
        </div>
        <div className="am-note">Saving adds the attorney to the roster so they can be assigned to cases.</div>
      </Form>
    </div>
  );
}