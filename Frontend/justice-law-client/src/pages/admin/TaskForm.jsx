import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Button, Form, Alert } from 'react-bootstrap';
import Icon from '../../components/Icon';
import { useData } from '../../context/DataContext';
import { TASK_STATUSES, todayIso, nextTaskId } from '../../services/taskConfig';

const emptyForm = () => ({
  title: '', description: '', caseNumber: '', attorneyNumber: '', dueDate: todayIso(), status: 'Not Started',
});

function validate(form, editing) {
  const errors = {};
  const title = form.title.trim();
  if (!title) errors.title = 'Task name is required';
  else if (title.length < 3) errors.title = 'Task name must be at least 3 characters';
  else if (title.length > 100) errors.title = 'Task name must be 100 characters or fewer';
  if (!form.caseNumber) errors.caseNumber = 'Select a case';
  if (!form.dueDate) errors.dueDate = 'Due date is required';
  else if (!editing && form.dueDate < todayIso()) errors.dueDate = 'Due date cannot be in the past';
  if (!form.status) errors.status = 'Select a status';
  if (form.description.length > 500) errors.description = 'Description must be 500 characters or fewer';
  return errors;
}

// /admin/tasks/new              -> add a task
// /admin/tasks/TSK-0001/edit    -> edit an existing task
export default function TaskForm() {
  const { taskId: editingId } = useParams();
  const navigate = useNavigate();
  const { attorneys, cases, tasks, setTasks } = useData();

  const existing = editingId ? tasks.find((t) => t.taskId === editingId) : null;
  const editing = !!editingId;

  const [form, setForm] = useState(() => {
    if (!existing) return emptyForm();
    return {
      title: existing.title || '',
      description: existing.description || '',
      caseNumber: existing.caseNumber || '',
      attorneyNumber: existing.attorneyNumber || '',
      dueDate: existing.dueDate || '',
      status: existing.status || 'Not Started',
    };
  });
  const [errors, setErrors] = useState({});

  const goBack = (state) => navigate('/admin/tasks', { state });

  if (editing && !existing) {
    return (
      <div className="form-page-wrap">
        <Alert variant="warning">Task {editingId} was not found.</Alert>
        <Button variant="primary" onClick={() => goBack()}>Back to tasks</Button>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Picking a case suggests that case's attorney if none is chosen yet
  const handleCase = (e) => {
    const caseNumber = e.target.value;
    const c = cases.find((x) => x.caseNumber === caseNumber);
    setForm((f) => ({ ...f, caseNumber, attorneyNumber: f.attorneyNumber || (c && c.attorneyNumber) || '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form, editing);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const data = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      attorneyNumber: form.attorneyNumber || null,
    };

    if (editing) {
      setTasks(tasks.map((t) => (t.taskId === editingId ? { ...t, ...data } : t)));
      goBack({ message: `Task ${editingId} updated.`, focus: editingId });
    } else {
      const taskId = nextTaskId(tasks);
      setTasks([...tasks, { taskId, ...data }]);
      goBack({ message: `Task ${taskId} created.`, focus: taskId });
    }
  };

  // New tasks can only go on open cases; when editing, keep the task's current case in the list
  const caseOptions = cases.filter((c) => c.status !== 'Closed' || c.caseNumber === form.caseNumber);

  return (
    <div className="form-page-wrap">
      <button type="button" className="back-link" onClick={() => goBack()}>
        <Icon name="chevronLeft" size={16} /> Back to tasks
      </button>

      <div className="panel">
        <div className="form-head dark">
          <div className="eyebrow">Legal tasks &amp; activities</div>
          <h3>{editing ? `Edit ${editingId}` : 'Add Legal Task'}</h3>
          <p>Link the task to a case and an attorney, and set when it is due.</p>
        </div>

        <div className="form-body">
          <Form onSubmit={handleSubmit} noValidate>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Task ID (auto-generated)</Form.Label>
                  <Form.Control value={editingId || nextTaskId(tasks)} readOnly style={{ fontWeight: 700 }} />
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
                  <Form.Control name="title" value={form.title} onChange={handleChange} isInvalid={!!errors.title} placeholder="e.g. Prepare affidavit" />
                  <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Case *</Form.Label>
                  <Form.Select name="caseNumber" value={form.caseNumber} onChange={handleCase} isInvalid={!!errors.caseNumber}>
                    <option value="">Select a case...</option>
                    {caseOptions.map((c) => (
                      <option key={c.caseNumber} value={c.caseNumber}>{c.caseNumber} - {c.title}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.caseNumber}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Assigned attorney</Form.Label>
                  <Form.Select name="attorneyNumber" value={form.attorneyNumber} onChange={handleChange}>
                    <option value="">Not assigned yet</option>
                    {attorneys.map((a) => (
                      <option key={a.staffNumber} value={a.staffNumber}>{a.staffNumber} - {a.name}</option>
                    ))}
                  </Form.Select>
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
                  <Form.Label>Description <span className="cell-sub">({form.description.length}/500)</span></Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" maxLength={500} value={form.description} onChange={handleChange} isInvalid={!!errors.description} />
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="form-actions">
              <Button variant="outline-secondary" onClick={() => goBack()}>Cancel</Button>
              <Button type="submit" variant="primary">{editing ? 'Save changes' : 'Create Task'}</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}