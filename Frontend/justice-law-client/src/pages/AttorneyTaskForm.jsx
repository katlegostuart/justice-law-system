import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Row, Col, Button, Form, Alert } from 'react-bootstrap';
import Icon from '../components/Icon';
import { useData } from '../context/DataContext';
import { TASK_STATUSES, todayIso } from '../services/taskConfig';
import api from '../services/api';

const emptyForm = (caseNumber = '') => ({
  title: '',
  description: '',
  caseNumber,
  dueDate: todayIso(),
  status: 'Not Started',
});

function validate(form, editing) {
  const errors = {};
  const title = form.title.trim();
  if (!title) errors.title = 'Task name is required';
  else if (title.length < 3) errors.title = 'Task name must be at least 3 characters';
  else if (title.length > 100) errors.title = 'Task name must be 100 characters or fewer';
  if (!form.description.trim()) errors.description = 'Description is required';
  else if (form.description.length > 500) errors.description = 'Description must be 500 characters or fewer';
  if (!form.caseNumber) errors.caseNumber = 'Select one of your cases';
  if (!form.dueDate) errors.dueDate = 'Due date is required';
  else if (!editing && form.dueDate < todayIso()) errors.dueDate = 'Due date cannot be in the past';
  if (!form.status) errors.status = 'Select a status';
  return errors;
}

// /attorney/tasks/new?case=CAS-...  -> add a task (the case can be pre-selected)
// /attorney/tasks/edit/:id          -> edit one of my tasks
export default function AttorneyTaskForm() {
  const { id: editingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cases, tasks, refreshData } = useData();

  const editing = !!editingId;
  const existing = editing ? tasks.find((t) => t.id === editingId) : null;

  const [form, setForm] = useState(() => emptyForm(searchParams.get('case') || ''));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadedId, setLoadedId] = useState(null);

  // When editing, fill the form as soon as the task has been loaded from the API
  useEffect(() => {
    if (existing && loadedId !== existing.id) {
      setForm({
        title: existing.title || '',
        description: existing.description || '',
        caseNumber: existing.caseNumber || '',
        dueDate: existing.dueDate || '',
        status: existing.status || 'Not Started',
      });
      setLoadedId(existing.id);
    }
  }, [existing, loadedId]);

  const goBack = (state) => navigate('/attorney/tasks', { state });

  if (editing && !existing) {
    return (
      <div className="form-page-wrap">
        <Alert variant="warning">
          We could not find this task. If the page has just loaded, go back to the task list and try again.
        </Alert>
        <Button variant="primary" onClick={() => goBack()}>Back to tasks</Button>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form, editing);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const selectedCase = cases.find((c) => c.caseNumber === form.caseNumber);
    if (!selectedCase) {
      setErrors({ caseNumber: 'Select one of your cases' });
      return;
    }

    const payload = {
      taskName: form.title.trim(),
      description: form.description.trim(),
      dueDate: new Date(form.dueDate).toISOString(),
      status: form.status,
      caseId: selectedCase.id,
    };

    setSaving(true);
    setSubmitError('');
    try {
      if (editing) {
        await api.put(`/LegalTasks/${existing.id}`, payload);
      } else {
        await api.post('/LegalTasks', payload);
      }
      await refreshData();
      goBack({ message: editing ? 'Task updated.' : 'Task created.' });
    } catch (err) {
      setSubmitError(
        err.response?.status === 403
          ? 'You can only add or edit tasks on your own cases.'
          : `Error saving task: ${err.message}`
      );
      setSaving(false);
    }
  };

  // New tasks can go on open cases only; when editing, keep the task's own case in the list
  const caseOptions = cases.filter((c) => c.status !== 'Closed' || c.caseNumber === form.caseNumber);

  return (
    <div className="form-page-wrap">
      <button type="button" className="back-link" onClick={() => goBack()}>
        <Icon name="chevronLeft" size={16} /> Back to tasks
      </button>

      <div className="panel">
        <div className="form-head dark">
          <div className="eyebrow">Legal tasks &amp; activities</div>
          <h3>{editing ? `Edit ${existing.taskId}` : 'Add Legal Task'}</h3>
          <p>Link the task to one of your cases, describe the work and set when it is due.</p>
        </div>

        <div className="form-body">
          {submitError && <Alert variant="danger">{submitError}</Alert>}

          <Form onSubmit={handleSubmit} noValidate>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Task ID</Form.Label>
                  <Form.Control
                    value={editing ? existing.taskId : 'Assigned automatically when saved'}
                    readOnly
                    style={{ fontWeight: 700 }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status *</Form.Label>
                  <Form.Select name="status" value={form.status} onChange={handleChange} isInvalid={!!errors.status}>
                    {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Task name *</Form.Label>
                  <Form.Control
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    isInvalid={!!errors.title}
                    placeholder="e.g. Prepare replying affidavit"
                  />
                  <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Case *</Form.Label>
                  <Form.Select name="caseNumber" value={form.caseNumber} onChange={handleChange} isInvalid={!!errors.caseNumber}>
                    <option value="">Select a case...</option>
                    {caseOptions.map((c) => (
                      <option key={c.id} value={c.caseNumber}>{c.caseNumber} - {c.title}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.caseNumber}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Due date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="dueDate"
                    min={editing ? undefined : todayIso()}
                    value={form.dueDate}
                    onChange={handleChange}
                    isInvalid={!!errors.dueDate}
                  />
                  <Form.Control.Feedback type="invalid">{errors.dueDate}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Description * <span className="cell-sub">({form.description.length}/500)</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    maxLength={500}
                    value={form.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="form-actions">
              <Button variant="outline-secondary" onClick={() => goBack()}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Save changes' : 'Create Task'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
