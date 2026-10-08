import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Button, Form, Alert } from 'react-bootstrap';
import Icon from '../../components/Icon';
import { useData } from '../../context/DataContext';
import { CASE_TYPES, CASE_STATUSES } from '../../services/mockData';

const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = () => ({
  title: '', type: '', status: 'Open', clientNumber: '',
  attorneyNumber: '', dateOpened: today(), description: '',
});

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Case name is required';
  if (!form.type) errors.type = 'Select a case type';
  if (!form.status) errors.status = 'Select a status';
  if (!form.clientNumber) errors.clientNumber = 'Select a client';
  if (!form.dateOpened) errors.dateOpened = 'Date opened is required';
  else if (form.dateOpened > today()) errors.dateOpened = 'Date opened cannot be in the future';
  return errors;
}

// /admin/cases/new            -> open a new case
// /admin/cases/CAS-2024-0891/edit -> edit an existing case
export default function CaseForm() {
  const { caseNumber: editingNumber } = useParams();
  const navigate = useNavigate();
  const { clients, attorneys, cases, setCases, caseload, maxCaseload, nextCaseNumber } = useData();

  const existing = editingNumber ? cases.find((c) => c.caseNumber === editingNumber) : null;

  const [form, setForm] = useState(() => {
    if (!existing) return emptyForm();
    return {
      title: existing.title, type: existing.type, status: existing.status, clientNumber: existing.clientNumber,
      attorneyNumber: existing.attorneyNumber || '', dateOpened: existing.dateOpened, description: existing.description || '',
    };
  });
  const [errors, setErrors] = useState({});

  const goBack = (state) => navigate('/admin/cases', { state });

  if (editingNumber && !existing) {
    return (
      <div className="form-page-wrap">
        <Alert variant="warning">Case {editingNumber} was not found.</Alert>
        <Button variant="primary" onClick={() => goBack()}>Back to cases</Button>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const data = { ...form, attorneyNumber: form.attorneyNumber || null };
    if (editingNumber) {
      setCases(cases.map((c) => (c.caseNumber === editingNumber ? { ...c, ...data } : c)));
      goBack({ message: `Case ${editingNumber} updated.`, focus: editingNumber });
    } else {
      const caseNumber = nextCaseNumber(form.dateOpened);
      setCases([...cases, { caseNumber, ...data }]);
      goBack({ message: `Case ${caseNumber} registered.`, focus: caseNumber });
    }
  };

  // attorneys who already have the maximum number of active cases cannot be chosen
  const attorneyOptions = attorneys.map((a) => {
    const load = caseload(a.staffNumber);
    const full = load >= maxCaseload && a.staffNumber !== (existing && existing.attorneyNumber);
    return (
      <option key={a.staffNumber} value={a.staffNumber} disabled={full}>
        {a.staffNumber} - {a.name} ({load}/{maxCaseload} active{full ? ', full' : ''})
      </option>
    );
  });

  return (
    <div className="form-page-wrap">
      <button type="button" className="back-link" onClick={() => goBack()}>
        <Icon name="chevronLeft" size={16} /> Back to cases
      </button>

      <div className="panel">
        <div className="form-head dark">
          <div className="eyebrow">Matter intake &amp; binding</div>
          <h3>{editingNumber ? `Edit ${editingNumber}` : 'Case Filing & Counsel Assignment'}</h3>
          <p>Link the case to a client and an attorney.</p>
        </div>

        <div className="form-body">
          <Form onSubmit={handleSubmit} noValidate>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Unique case number (auto-generated)</Form.Label>
                  <Form.Control value={editingNumber || nextCaseNumber(form.dateOpened)} readOnly style={{ fontWeight: 700 }} />
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
                    {CASE_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status *</Form.Label>
                  <Form.Select name="status" value={form.status} onChange={handleChange} isInvalid={!!errors.status}>
                    {CASE_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Client *</Form.Label>
                  <Form.Select name="clientNumber" value={form.clientNumber} onChange={handleChange} isInvalid={!!errors.clientNumber}>
                    <option value="">Select a client...</option>
                    {clients.map((c) => (
                      <option key={c.clientNumber} value={c.clientNumber}>
                        {c.clientNumber} - {c.firstName} {c.surname}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.clientNumber}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Assigned attorney</Form.Label>
                  <Form.Select name="attorneyNumber" value={form.attorneyNumber} onChange={handleChange}>
                    <option value="">Not assigned yet</option>
                    {attorneyOptions}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Case description</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={form.description} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <div className="form-actions">
              <Button variant="outline-secondary" onClick={() => goBack()}>Cancel</Button>
              <Button type="submit" variant="primary">{editingNumber ? 'Save changes' : 'Register Case'}</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
