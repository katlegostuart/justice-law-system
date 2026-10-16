import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import Icon from '../components/Icon';
import { Avatar, formatDate } from '../components/ui';
import { useAuth } from "../context/AuthContext";

import { useData } from '../context/DataContext';
import { CASE_STATUSES } from '../services/mockData';
import { TASK_STATUSES, isOverdue, todayIso, nextTaskId } from '../services/taskConfig';

const CSS = `
.jl{width:100%;min-width:0;font-size:14px;color:#0f172a}
.jl *{box-sizing:border-box}
.jl-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;min-width:0}
.jl-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-bottom:16px}
.jl-head h1{font-size:28px;font-weight:700;margin:4px 0 0}
.jl-lbl{font-size:10px;letter-spacing:.08em;font-weight:700;color:#64748b}
.jl-muted{color:#64748b;font-size:12px}
.jl-orange{color:#c2410c}
.jl-prof{display:flex;gap:20px;flex-wrap:wrap;align-items:center;justify-content:space-between;border-left:4px solid #f59e0b;margin-bottom:16px}
.jl-prof-l{display:flex;gap:16px;align-items:center;min-width:260px}
.jl-prof h1{font-size:22px;font-weight:700;margin:0 0 4px}
.jl-tag{display:inline-block;font-size:11px;font-weight:600;background:#e6edfb;color:#1e3a8a;border-radius:5px;padding:2px 8px;margin-right:6px}
.jl-kpis{display:grid;grid-template-columns:repeat(4,minmax(110px,1fr));border:1px solid #e5e7eb;border-radius:10px;background:#f8faff;flex:1 1 520px;max-width:720px}
.jl-kpi{padding:12px 16px;border-right:1px solid #e5e7eb;min-width:0}
.jl-kpi:last-child{border-right:0}
.jl-kv{font-size:26px;font-weight:700;line-height:1.1;margin:4px 0}
.jl-kv small{font-size:12px;font-weight:500;color:#64748b}
.jl-bar{height:5px;background:#e2e8f0;border-radius:99px;overflow:hidden;margin-top:4px}
.jl-bar i{display:block;height:100%;background:#0f1729;border-radius:99px}
.jl-grid{display:grid;grid-template-columns:minmax(300px,380px) minmax(0,1fr);gap:16px;align-items:start}
.jl-grid>div{min-width:0}
.jl-h2{margin:0;font-size:15px;font-weight:700}
.jl-hd{display:flex;justify-content:space-between;align-items:center;gap:8px}
.jl-total{font-size:11px;font-weight:700;background:#e6edfb;color:#1e3a8a;border-radius:6px;padding:2px 8px}
.jl-search{width:100%;border:1px solid #e2e8f0;background:#f8faff;border-radius:8px;padding:9px 12px;margin:12px 0 10px;font:inherit}
.jl-chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.jl-chip{padding:5px 12px;border-radius:999px;border:1px solid #e2e8f0;background:#fff;font-size:12px;font-weight:600;cursor:pointer;color:#0f172a}
.jl-chip.on{background:#0f1729;color:#fff;border-color:#0f1729}
.jl-list{display:flex;flex-direction:column;gap:2px}
.jl-ci{width:100%;text-align:left;background:transparent;border:1px solid transparent;border-bottom:1px solid #eef0f4;border-radius:8px;padding:12px;cursor:pointer;color:inherit}
.jl-ci:hover{background:#f8faff}
.jl-ci.on{background:#fff;border:1px solid #e5e7eb;border-left:4px solid #f59e0b;box-shadow:0 2px 10px rgba(15,23,42,.07)}
.jl-ci1{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:space-between}
.jl-ref{font-size:11px;font-weight:700;color:#c2410c}
.jl-ci2{font-size:14px;font-weight:700;margin:6px 0 2px}
.jl-pill{display:inline-block;border-radius:999px;font-size:11px;font-weight:700;padding:2px 10px;white-space:nowrap}
.jl-pill-open{background:#e6edfb;color:#1e3a8a}
.jl-pill-inprogress{background:#eef0ff;color:#4338ca}
.jl-pill-pendinghearing{background:#fef3c7;color:#b45309}
.jl-pill-closed,.jl-pill-complete{background:#dcfce7;color:#15803d}
.jl-pill-notstarted{background:#f1f5f9;color:#475569}
.jl-empty{padding:24px 8px;text-align:center;color:#64748b;font-size:13px}
.jl-title{font-size:26px;font-weight:700;line-height:1.15;margin:8px 0 4px}
.jl-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;background:#f6f8fc;border-radius:10px;padding:12px 14px;margin:14px 0}
.jl-facts b{display:block;font-size:14px;margin-top:2px}
.jl-sec{margin-top:18px}
.jl-client{display:flex;gap:12px;align-items:flex-start;margin-top:10px}
.jl-client div{min-width:0;overflow-wrap:anywhere}
.jl-ti{display:flex;gap:10px;justify-content:space-between;align-items:flex-start;padding:10px;border-radius:8px;background:#f6f8fc;margin-top:8px}
.jl-ti b{display:block;font-size:13px}
.jl-ti small{color:#64748b}
.jl-late{color:#b91c1c;font-weight:700}
.jl-more{display:inline-block;margin-top:12px;font-size:12px;font-weight:700;color:#c2410c;text-decoration:none}
.jl-tw{overflow-x:auto}
.jl-table{width:100%;border-collapse:collapse;min-width:720px}
.jl-table th{text-align:left;font-size:10px;letter-spacing:.08em;color:#64748b;font-weight:700;padding:10px 12px;border-bottom:1px solid #e5e7eb}
.jl-table td{padding:12px;border-bottom:1px solid #eef0f4;vertical-align:top;font-size:13px}
.jl-table td b{display:block}
.jl-table small{color:#64748b}
@media (max-width:1100px){.jl-grid{grid-template-columns:1fr}}
`;

/* The logged-in attorney's own record, cases and tasks (all from the database) */
function useMine() {
  const auth = useAuth();
  const user = (auth && auth.user) || auth || {};
  const data = useData();
  const staffNumber = user.staffNumber;
  const me = data.attorneys.find((a) => a.staffNumber === staffNumber) || null;
  const myCases = data.cases
    .filter((c) => c.attorneyNumber === staffNumber)
    .sort((a, b) => String(b.dateOpened).localeCompare(String(a.dateOpened)));
  const numbers = new Set(myCases.map((c) => c.caseNumber));
  const myTasks = data.tasks
    .filter((t) => numbers.has(t.caseNumber))
    .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)));
  return { ...data, user, me, myCases, myTasks };
}

function Pill({ status }) {
  return <span className={`jl-pill jl-pill-${String(status).replace(/\s+/g, '').toLowerCase()}`}>{status}</span>;
}

function NoRecord({ status, user }) {
  if (status === 'loading') return <p>Loading your records...</p>;
  return (
    <Alert variant="warning">
      No attorney record was found in the database for staff number "{user.staffNumber || 'none'}".
      Ask the administrator to register you under Attorneys Management, then log in again with your email.
    </Alert>
  );
}

/* ================= Dashboard and My Cases (same workspace) ================= */
function Workspace({ casesOnly }) {
  const { me, myCases, myTasks, clientName, getClient, maxCaseload, apiStatus, user } = useMine();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [pick, setPick] = useState('');

  if (!me) return <NoRecord status={apiStatus} user={user} />;

  const q = query.trim().toLowerCase();
  const count = (s) => myCases.filter((c) => c.status === s).length;
  const visible = myCases.filter(
    (c) =>
      (filter === 'All' || c.status === filter) &&
      `${c.caseNumber} ${c.title} ${c.type} ${clientName(c.clientNumber)}`.toLowerCase().includes(q)
  );
  const selected = myCases.find((c) => c.caseNumber === pick) || visible[0] || null;
  const client = selected ? getClient(selected.clientNumber) : null;
  const caseTasks = selected ? myTasks.filter((t) => t.caseNumber === selected.caseNumber) : [];

  const active = myCases.filter((c) => c.status !== 'Closed').length;
  const open = myTasks.filter((t) => t.status !== 'Complete').length;
  const overdue = myTasks.filter(isOverdue).length;
  const done = myTasks.filter((t) => t.status === 'Complete').length;
  const pct = Math.min(100, Math.round((active / maxCaseload) * 100));

  return (
    <div className="jl">
      <style>{CSS}</style>

      {casesOnly ? (
        <div className="jl-head">
          <div>
            <div className="jl-lbl jl-orange">LEGAL OPERATIONS</div>
            <h1>My Cases</h1>
          </div>
          <span className="jl-total">{myCases.length} total</span>
        </div>
      ) : (
        <section className="jl-card jl-prof">
          <div className="jl-prof-l">
            <Avatar name={me.name} size={64} />
            <div>
              <h1>{me.name}</h1>
              <span className="jl-tag">{me.staffNumber}</span>
              <span className="jl-tag">{me.specialization}</span>
              <div className="jl-muted" style={{ marginTop: 6 }}>{me.email} - {me.phone}</div>
            </div>
          </div>
          <div className="jl-kpis">
            <div className="jl-kpi">
              <div className="jl-lbl">ACTIVE CASES</div>
              <div className="jl-kv">{active} <small>/ {maxCaseload} max</small></div>
              <div className="jl-bar"><i style={{ width: `${pct}%` }} /></div>
            </div>
            <div className="jl-kpi">
              <div className="jl-lbl">OPEN TASKS</div>
              <div className="jl-kv">{open}</div>
            </div>
            <div className="jl-kpi">
              <div className="jl-lbl">OVERDUE</div>
              <div className="jl-kv" style={overdue ? { color: '#b91c1c' } : undefined}>{overdue}</div>
            </div>
            <div className="jl-kpi">
              <div className="jl-lbl">TASKS DONE</div>
              <div className="jl-kv">{done}</div>
            </div>
          </div>
        </section>
      )}

      <div className="jl-grid">
        <div>
          <section className="jl-card">
            <div className="jl-hd">
              <div>
                <h2 className="jl-h2">My Assigned Cases</h2>
                <div className="jl-muted">Cases the administrator has assigned to you</div>
              </div>
              <span className="jl-total">{myCases.length} total</span>
            </div>

            <input className="jl-search" placeholder="Search by case number, name, type or client" aria-label="Search my cases" value={query} onChange={(e) => setQuery(e.target.value)} />

            <div className="jl-chips" role="group" aria-label="Filter cases by status">
              {['All', ...CASE_STATUSES].map((s) => (
                <button key={s} type="button" className={`jl-chip${filter === s ? ' on' : ''}`} onClick={() => setFilter(s)}>
                  {s} ({s === 'All' ? myCases.length : count(s)})
                </button>
              ))}
            </div>

            <div className="jl-list">
              {myCases.length === 0 && <div className="jl-empty">No cases have been assigned to you yet.</div>}
              {myCases.length > 0 && visible.length === 0 && <div className="jl-empty">No cases match your search.</div>}
              {visible.map((c) => (
                <button key={c.caseNumber} type="button" className={`jl-ci${selected && selected.caseNumber === c.caseNumber ? ' on' : ''}`} onClick={() => setPick(c.caseNumber)}>
                  <div className="jl-ci1">
                    <span className="jl-ref">{c.caseNumber}</span>
                    <Pill status={c.status} />
                  </div>
                  <div className="jl-ci2">{c.title}</div>
                  <div className="jl-muted">{c.type} - {clientName(c.clientNumber)} - opened {formatDate(c.dateOpened)}</div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div>
          {!selected ? (
            <section className="jl-card"><div className="jl-empty">Select a case to see its details.</div></section>
          ) : (
            <section className="jl-card">
              <div className="jl-dref">
                <span className="jl-ref">{selected.caseNumber}</span> <Pill status={selected.status} />
              </div>
              <div className="jl-title">{selected.title}</div>

              <div className="jl-facts">
                <div><div className="jl-lbl">CASE TYPE</div><b>{selected.type || '-'}</b></div>
                <div><div className="jl-lbl">DATE OPENED</div><b>{formatDate(selected.dateOpened)}</b></div>
                <div><div className="jl-lbl">TASKS</div><b>{caseTasks.length}</b></div>
              </div>

              <div className="jl-lbl">CASE DESCRIPTION</div>
              <p style={{ marginTop: 6 }}>{selected.description || 'No description captured.'}</p>

              <div className="jl-sec">
                <div className="jl-lbl">CLIENT</div>
                {client ? (
                  <div className="jl-client">
                    <Avatar name={`${client.firstName} ${client.surname}`} size={44} />
                    <div>
                      <b>{client.firstName} {client.surname}</b> <span className="jl-muted">({client.clientNumber})</span>
                      <div className="jl-muted">{client.email}</div>
                      <div className="jl-muted">{client.phone}</div>
                      <div className="jl-muted">{client.address}</div>
                    </div>
                  </div>
                ) : (
                  <p className="jl-muted">Client record not found.</p>
                )}
              </div>

              <div className="jl-sec">
                <div className="jl-hd">
                  <div className="jl-lbl">LEGAL TASKS ON THIS CASE</div>
                  <span className="jl-total">{caseTasks.length}</span>
                </div>
                {caseTasks.length === 0 && <div className="jl-empty">No tasks on this case yet.</div>}
                {caseTasks.map((t) => (
                  <div key={t.taskId} className="jl-ti">
                    <div>
                      <b>{t.title}</b>
                      <small>{t.description}</small>
                      <div className={isOverdue(t) ? 'jl-late' : 'jl-muted'}>
                        Due {t.dueDate ? formatDate(t.dueDate) : '-'}{isOverdue(t) ? ' (overdue)' : ''}
                      </div>
                    </div>
                    <Pill status={t.status} />
                  </div>
                ))}
                <Link to="/attorney/tasks" className="jl-more">Manage all my tasks &rarr;</Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AttorneyDashboard() {
  return <Workspace />;
}

export function MyCasesPage() {
  return <Workspace casesOnly />;
}

/* ================= Legal Tasks & Activities ================= */
const emptyTask = () => ({ title: '', caseNumber: '', dueDate: todayIso(), status: 'Not Started', description: '' });

export function LegalTasksPage() {
  const { me, myCases, myTasks, tasks, setTasks, apiStatus, user } = useMine();
  const [filter, setFilter] = useState('All');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(emptyTask());
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  if (!me) return <NoRecord status={apiStatus} user={user} />;

  const caseTitle = (n) => {
    const c = myCases.find((x) => x.caseNumber === n);
    return c ? c.title : n;
  };
  const rows = myTasks.filter((t) => filter === 'All' || t.status === filter);
  const done = myTasks.filter((t) => t.status === 'Complete').length;
  const pct = myTasks.length ? Math.round((done / myTasks.length) * 100) : 0;

  const changeStatus = (task, status) => {
    setTasks(tasks.map((t) => (t.taskId === task.taskId ? { ...t, status } : t)));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = (e) => {
    e.preventDefault();
    const found = {};
    const title = form.title.trim();
    if (!title) found.title = 'Task name is required';
    else if (title.length < 3) found.title = 'Task name must be at least 3 characters';
    if (!form.caseNumber) found.caseNumber = 'Select a case';
    if (!form.dueDate) found.dueDate = 'Due date is required';
    else if (form.dueDate < todayIso()) found.dueDate = 'Due date cannot be in the past';
    if (!form.status) found.status = 'Select a status';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setTasks([
      ...tasks,
      { taskId: nextTaskId(tasks), title, description: form.description.trim(), caseNumber: form.caseNumber, attorneyNumber: user.staffNumber, dueDate: form.dueDate, status: form.status },
    ]);
    setMessage(`Task "${title}" added.`);
    setShow(false);
    setForm(emptyTask());
    setErrors({});
  };

  return (
    <div className="jl">
      <style>{CSS}</style>

      <div className="jl-head">
        <div>
          <div className="jl-lbl jl-orange">LEGAL OPERATIONS</div>
          <h1>Legal Tasks &amp; Activities</h1>
        </div>
        <Button variant="primary" onClick={() => setShow(true)} disabled={myCases.length === 0}>
          <Icon name="plus" size={16} className="me-2" />
          Add Legal Task
        </Button>
      </div>

      {message && <Alert variant="success" dismissible onClose={() => setMessage('')}>{message}</Alert>}
      {myCases.length === 0 && <Alert variant="info">You have no assigned cases yet, so there are no tasks to manage.</Alert>}

      <section className="jl-card">
        <div className="jl-hd">
          <div>
            <h2 className="jl-h2">My Task Tracker</h2>
            <div className="jl-muted">{done} of {myTasks.length} tasks complete ({pct}%)</div>
          </div>
          <div style={{ width: 220 }}><div className="jl-bar"><i style={{ width: `${pct}%` }} /></div></div>
        </div>

        <div className="jl-chips" style={{ marginTop: 14 }} role="group" aria-label="Filter tasks by status">
          {['All', ...TASK_STATUSES].map((s) => (
            <button key={s} type="button" className={`jl-chip${filter === s ? ' on' : ''}`} onClick={() => setFilter(s)}>
              {s} ({s === 'All' ? myTasks.length : myTasks.filter((t) => t.status === s).length})
            </button>
          ))}
        </div>

        <div className="jl-tw">
          <table className="jl-table">
            <thead>
              <tr><th>TASK</th><th>CASE</th><th>DUE DATE</th><th>STATUS</th><th>UPDATE STATUS</th></tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan="5" className="jl-empty">No tasks in this view.</td></tr>}
              {rows.map((t) => (
                <tr key={t.taskId}>
                  <td><b>{t.title}</b><small>{t.description}</small></td>
                  <td><b>{caseTitle(t.caseNumber)}</b><small>{t.caseNumber}</small></td>
                  <td className={isOverdue(t) ? 'jl-late' : ''}>
                    {t.dueDate ? formatDate(t.dueDate) : '-'}
                    {isOverdue(t) && <small className="jl-late">Overdue</small>}
                  </td>
                  <td><Pill status={t.status} /></td>
                  <td>
                    <Form.Select size="sm" value={t.status} aria-label={`Status of ${t.title}`} onChange={(e) => changeStatus(t, e.target.value)}>
                      {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Form onSubmit={save} noValidate>
          <Modal.Header closeButton><Modal.Title>Add Legal Task</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Task name *</Form.Label>
              <Form.Control name="title" value={form.title} onChange={handleChange} isInvalid={!!errors.title} placeholder="e.g. Prepare affidavit" />
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Case *</Form.Label>
              <Form.Select name="caseNumber" value={form.caseNumber} onChange={handleChange} isInvalid={!!errors.caseNumber}>
                <option value="">Select a case...</option>
                {myCases.filter((c) => c.status !== 'Closed').map((c) => (
                  <option key={c.caseNumber} value={c.caseNumber}>{c.caseNumber} - {c.title}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.caseNumber}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due date *</Form.Label>
              <Form.Control type="date" name="dueDate" min={todayIso()} value={form.dueDate} onChange={handleChange} isInvalid={!!errors.dueDate} />
              <Form.Control.Feedback type="invalid">{errors.dueDate}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status *</Form.Label>
              <Form.Select name="status" value={form.status} onChange={handleChange} isInvalid={!!errors.status}>
                {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" maxLength={500} value={form.description} onChange={handleChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Task</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}