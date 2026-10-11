import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Modal, Button, Alert, Form } from 'react-bootstrap';
import Icon from '../../components/Icon';
import { Avatar, PageHeader, StatCard, Pager, formatDate } from '../../components/ui';
import { useData } from '../../context/DataContext';
import { TASK_STATUSES, isOverdue } from '../../services/taskConfig';

const PAGE_SIZE = 8;
const byDueDate = (a, b) => (a.dueDate || '').localeCompare(b.dueDate || '');

const STATUS_STYLE = {
  'Not Started': { background: '#f1f5f9', color: '#475569' },
  'In Progress': { background: '#fef3c7', color: '#b45309' },
  Complete: { background: '#dcfce7', color: '#15803d' },
};

function TaskStatus({ status }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE['Not Started'];
  return (
    <span
      style={{
        ...style,
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}

export default function Tasks() {
  const { attorneys, cases, tasks, setTasks, getAttorney } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const [statusTab, setStatusTab] = useState('All');
  const [search, setSearch] = useState('');
  const [caseFilter, setCaseFilter] = useState('All');
  const [attorneyFilter, setAttorneyFilter] = useState('All');
  const [toDelete, setToDelete] = useState(null);

  // The form page sends back a message and the task it just saved
  const [message, setMessage] = useState(location.state?.message || '');
  const [page, setPage] = useState(() => {
    const focus = location.state?.focus;
    const index = focus ? [...tasks].sort(byDueDate).findIndex((t) => t.taskId === focus) : -1;
    return index >= 0 ? Math.floor(index / PAGE_SIZE) + 1 : 1;
  });

  useEffect(() => {
    if (location.state) navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const caseOf = (caseNumber) => cases.find((c) => c.caseNumber === caseNumber);

  // ---- stats ----
  const countStatus = (s) => tasks.filter((t) => t.status === s).length;
  const overdue = tasks.filter(isOverdue).length;

  // ---- search + filters ----
  const term = search.trim().toLowerCase();
  const filtered = tasks
    .filter((t) => {
      if (statusTab !== 'All' && t.status !== statusTab) return false;
      if (caseFilter !== 'All' && t.caseNumber !== caseFilter) return false;
      if (attorneyFilter === 'Unassigned' && t.attorneyNumber) return false;
      if (attorneyFilter !== 'All' && attorneyFilter !== 'Unassigned' && t.attorneyNumber !== attorneyFilter) return false;
      if (term) {
        const c = caseOf(t.caseNumber);
        const a = getAttorney(t.attorneyNumber);
        const text = `${t.taskId} ${t.title} ${t.caseNumber} ${c ? c.title : ''} ${a ? a.name : ''}`.toLowerCase();
        if (!text.includes(term)) return false;
      }
      return true;
    })
    .sort(byDueDate);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const filtersActive = term || caseFilter !== 'All' || attorneyFilter !== 'All' || statusTab !== 'All';

  const clearFilters = () => {
    setStatusTab('All');
    setSearch('');
    setCaseFilter('All');
    setAttorneyFilter('All');
    setPage(1);
  };

  // ---- delete ----
  const confirmDelete = () => {
    setTasks(tasks.filter((t) => t.taskId !== toDelete.taskId));
    setMessage(`Task ${toDelete.taskId} deleted.`);
    setToDelete(null);
  };

  return (
    <>
      <PageHeader eyebrow="Legal tasks & activities" title="Legal Tasks Management">
        <Button variant="primary" onClick={() => navigate('/admin/tasks/new')}>
          <Icon name="plus" size={16} className="me-2" />
          Add Legal Task
        </Button>
      </PageHeader>

      {message && <Alert variant="success" dismissible onClose={() => setMessage('')}>{message}</Alert>}

      <Row className="g-3 mb-3">
        <Col xl={3} sm={6}><StatCard label="Total tasks" value={tasks.length} hint="Across all cases" icon="folder" /></Col>
        <Col xl={3} sm={6}><StatCard label="In progress" value={countStatus('In Progress')} hint="Currently being worked on" icon="briefcase" /></Col>
        <Col xl={3} sm={6}>
          <StatCard
            label="Overdue"
            value={overdue}
            hint={overdue > 0 ? 'Past the due date' : 'Nothing overdue'}
            icon="alert"
            tone={overdue > 0 ? 'danger' : undefined}
          />
        </Col>
        <Col xl={3} sm={6}><StatCard label="Complete" value={countStatus('Complete')} hint="Finished tasks" icon="checkCircle" /></Col>
      </Row>

      <div className="chips mb-3">
        {['All', ...TASK_STATUSES].map((s) => (
          <button
            type="button"
            key={s}
            className={'chip' + (statusTab === s ? ' active' : '')}
            onClick={() => { setStatusTab(s); setPage(1); }}
          >
            {s === 'All' ? 'All Tasks' : s} <em>{s === 'All' ? tasks.length : countStatus(s)}</em>
          </button>
        ))}
      </div>

      <div className="panel mb-3">
        <div className="panel-body filter-bar">
          <div className="search-box">
            <Icon name="search" size={16} />
            <Form.Control
              placeholder="Search by task, case or attorney"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Form.Select value={caseFilter} onChange={(e) => { setCaseFilter(e.target.value); setPage(1); }} aria-label="Filter by case">
            <option value="All">All cases</option>
            {cases.map((c) => <option key={c.caseNumber} value={c.caseNumber}>{c.caseNumber} - {c.title}</option>)}
          </Form.Select>
          <Form.Select value={attorneyFilter} onChange={(e) => { setAttorneyFilter(e.target.value); setPage(1); }} aria-label="Filter by attorney">
            <option value="All">All attorneys</option>
            <option value="Unassigned">Unassigned only</option>
            {attorneys.map((a) => <option key={a.staffNumber} value={a.staffNumber}>{a.staffNumber} - {a.name}</option>)}
          </Form.Select>
          {filtersActive && <Button variant="outline-secondary" onClick={clearFilters}>Clear</Button>}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">
            Legal Task Register
            <span className="count-badge">{filtered.length} displayed</span>
          </h2>
          <span className="cell-sub">Sort: Due date (soonest)</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Case</th>
                <th>Assigned attorney</th>
                <th>Due date</th>
                <th>Status</th>
                <th className="sticky-end"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan="6" className="empty-row">No tasks found</td></tr>
              )}
              {rows.map((t) => {
                const c = caseOf(t.caseNumber);
                const attorney = getAttorney(t.attorneyNumber);
                return (
                  <tr key={t.taskId}>
                    <td>
                      <div className="cell-id">{t.taskId}</div>
                      <div className="cell-title">{t.title}</div>
                      {t.description && <div className="cell-sub">{t.description}</div>}
                    </td>
                    <td>
                      <div className="cell-title">{c ? c.title : 'Unknown case'}</div>
                      <div className="cell-sub">{t.caseNumber}</div>
                    </td>
                    <td>
                      {attorney ? (
                        <div className="cell-person">
                          <Avatar name={attorney.name} size={32} />
                          <div>
                            <div className="cell-title">{attorney.name}</div>
                            <div className="cell-sub">{attorney.staffNumber}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="cell-sub">Not assigned</span>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {t.dueDate ? formatDate(t.dueDate) : '—'}
                      {isOverdue(t) && <div className="cell-sub" style={{ color: '#b91c1c', fontWeight: 600 }}>Overdue</div>}
                    </td>
                    <td><TaskStatus status={t.status} /></td>
                    <td className="sticky-end">
                      <div className="row-actions">
                        <button type="button" className="icon-btn" onClick={() => navigate(`/admin/tasks/${t.taskId}/edit`)} aria-label={`Edit ${t.taskId}`} title="Edit task">
                          <Icon name="edit" size={15} />
                        </button>
                        <button type="button" className="icon-btn danger" onClick={() => setToDelete(t)} aria-label={`Delete ${t.taskId}`} title="Delete task">
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pager page={currentPage} pageCount={pageCount} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      {/* Delete task */}
      <Modal show={!!toDelete} onHide={() => setToDelete(null)} centered>
        <Modal.Header closeButton><Modal.Title>Delete task?</Modal.Title></Modal.Header>
        <Modal.Body>
          {toDelete && (
            <>
              Are you sure you want to delete <strong>{toDelete.taskId}</strong> ({toDelete.title})? This cannot be undone.
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setToDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}