import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Button, Form, Alert } from 'react-bootstrap';
import Icon from '../../components/Icon';
import { useData } from '../../context/DataContext';
import { CASE_STATUSES } from '../../services/mockData';
import api from '../../services/api';

const today = () => new Date().toISOString().slice(0, 10);

// The form keeps the real ids (GUIDs) of the client and attorney.
// The dropdowns show the readable numbers, but the VALUE behind each option is the id.
const emptyForm = () => ({
  title: '', type: '', status: 'Open', clientId: '',
  attorneyId: '', dateOpened: today(), description: '',
});

const formFrom = (c) => ({
  title: c.title || '',
  type: c.type || '',
  status: c.status || 'Open',
  clientId: c.clientId || '',
  attorneyId: c.attorneyId || '',
  dateOpened: c.dateOpened || today(),
  description: c.description || '',
});

function validate(form) {
  const errors = {};
  const title = form.title.trim();
  if (!title) errors.title = 'Case name is required';
  else if (title.length > 100) errors.title = 'Case name must be 100 characters or fewer';
  if (!form.type) errors.type = 'Select a case type';
  if (!form.status) errors.status = 'Select a status';
  if (!form.clientId) errors.clientId = 'Select a client';
  if (!form.dateOpened) errors.dateOpened = 'Date opened is required';
  else if (form.dateOpened > today()) errors.dateOpened = 'Date opened cannot be in the future';
  if (form.description.length > 1000) errors.description = 'Description must be 1000 characters or fewer';
  return errors;
}

// /admin/cases/new         -> open a new case
// /admin/cases/edit/:id    -> edit an existing case (:id is the case's GUID)
export default function CaseForm() {
  const { id: editingId } = useParams();
  const navigate = useNavigate();
  const { clients, attorneys, cases, caseload, maxCaseload, nextCaseNumber, caseTypes, refreshData } = useData();

  const existing = editingId ? cases.find((c) => c.id === editingId) : null;

  const [form, setForm] = useState(() => (existing ? formFrom(existing) : emptyForm()));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadedId, setLoadedId] = useState(existing ? existing.id : null);
  // Worked out ONCE when the page opens, so the number you see is the number that is saved.
  const [generatedNumber] = useState(() => nextCaseNumber());

  // If the page is refreshed on an edit URL, the case arrives a moment later: fill the form then.
  useEffect(() => {
    if (existing && loadedId !== existing.id) {
      setForm(formFrom(existing));
      setLoadedId(existing.id);
    }
  }, [existing, loadedId]);

  const goBack = (state) => navigate('/admin/cases', { state });

  if (editingId && !existing) {
    return (
      <div className="form-page-wrap">
        <Alert variant="warning">
          We could not find this case. If the page has just loaded, go back to the case list and try again.
        </Alert>
        <Button variant="primary" onClick={() => goBack()}>Back to cases</Button>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    const selectedCaseType = caseTypes.find((t) => t.name === form.type);
    if (!selectedCaseType) found.type = 'Select a case type';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload = {
      caseNumber: existing ? existing.caseNumber : generatedNumber,
      caseName: form.title.trim(),
      caseDescription: form.description.trim() || 'No description provided',
      dateOpened: new Date(form.dateOpened).toISOString(),
      caseStatus: form.status,
      caseTypeId: selectedCaseType.id,
      clientId: form.clientId,
      attorneyId: form.attorneyId || null,
    };

    setSaving(true);
    setSubmitError('');
    try {
      if (existing) {
        await api.put(`/Cases/${existing.id}`, payload);
      } else {
        await api.post('/Cases', payload);
      }
      await refreshData(); // so the list shows the change straight away
      goBack({ message: existing ? 'Case updated.' : 'Case registered successfully.' });
    } catch (err) {
      const detail = err.response?.data;
      setSubmitError(`Error saving case: ${typeof detail === 'string' && detail ? detail : err.message}`);
      setSaving(false);
    }
  };

  // Attorneys who already have the maximum number of active cases cannot be chosen.
  const attorneyOptions = attorneys.map((a) => {
    const load = caseload(a.staffNumber);
    const full = load >= maxCaseload && a.id !== (existing && existing.attorneyId);
    return (
      <option key={a.id} value={a.id} disabled={full}>
        {a.staffNumber} - {a.name} ({load}/{maxCaseload} active{full ? ', full' : ''})
      </option>
    );
  });

  // If an old case has a status that is not in our list, keep it visible instead of hiding it.
  const statusOptions = CASE_STATUSES.includes(form.status) ? CASE_STATUSES : [form.status, ...CASE_STATUSES];

  return (
    <div className="form-page-wrap">
      <button type="button" className="back-link" onClick={() => goBack()}>
        <Icon name="chevronLeft" size={16} /> Back to cases
      </button>

      <div className="panel">
        <div className="form-head dark">
          <div className="eyebrow">Matter intake &amp; binding</div>
          <h3>{existing ? `Edit ${existing.caseNumber}` : 'Case Filing & Counsel Assignment'}</h3>
          <p>Link the case to a client and an attorney.</p>
        </div>

        <div className="form-body">
          {submitError && <Alert variant="danger">{submitError}</Alert>}

          <Form onSubmit={handleSubmit} noValidate>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Unique case number (auto-generated)</Form.Label>
                  <Form.Control value={existing ? existing.caseNumber : generatedNumber} readOnly style={{ fontWeight: 700 }} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date opened *</Form.Label>
                  <Form.Control type="date" name="dateOpened" max={today()} value={form.dateOpened} onChange={handleChange} isInvalid={!!errors.dateOpened} />
                  <Form.Control.Feedback type="invalid">{errors.dateOpened}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Case name / title *</Form.Label>
                  <Form.Control name="title" value={form.title} onChange={handleChange} isInvalid={!!errors.title} placeholder="e.g. Fleet Supply Dispute" />
                  <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Case type *</Form.Label>
                  <Form.Select name="type" value={form.type} onChange={handleChange} isInvalid={!!errors.type}>
                    <option value="">Select...</option>
                    {caseTypes.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status *</Form.Label>
                  <Form.Select name="status" value={form.status} onChange={handleChange} isInvalid={!!errors.status}>
                    {statusOptions.map((s) => <option key={s}>{s}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Client *</Form.Label>
                  <Form.Select name="clientId" value={form.clientId} onChange={handleChange} isInvalid={!!errors.clientId}>
                    <option value="">Select a client...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.clientNumber} - {c.firstName} {c.surname}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.clientId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Assigned attorney</Form.Label>
                  <Form.Select name="attorneyId" value={form.attorneyId} onChange={handleChange}>
                    <option value="">Not assigned yet</option>
                    {attorneyOptions}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Case description <span className="cell-sub">({form.description.length}/1000)</span></Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" maxLength={1000} value={form.description} onChange={handleChange} isInvalid={!!errors.description} />
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="form-actions">
              <Button variant="outline-secondary" onClick={() => goBack()}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : existing ? 'Save changes' : 'Register Case'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
