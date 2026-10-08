import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Modal, Button, Alert, Form } from 'react-bootstrap';
import Icon from '../../components/Icon';
import { Avatar, PageHeader, StatCard, Pager, StatusPill, TypePill, formatDate } from '../../components/ui';
import { useData } from '../../context/DataContext';
import { CASE_TYPES, CASE_STATUSES } from '../../services/mockData';

const PAGE_SIZE = 6;
const newestFirst = (a, b) => b.dateOpened.localeCompare(a.dateOpened);

export default function Cases() {
  const {
    attorneys, cases, setCases, tasks, setTasks,
    getAttorney, clientName, caseload, maxCaseload,
  } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const [statusTab, setStatusTab] = useState('All');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [assignFilter, setAssignFilter] = useState('All');
  const [toDelete, setToDelete] = useState(null);

  // The form page sends back a message and the case it just saved
  const [message, setMessage] = useState(location.state?.message || '');
  const [page, setPage] = useState(() => {
    const focus = location.state?.focus;
    const index = focus ? [...cases].sort(newestFirst).findIndex((c) => c.caseNumber === focus) : -1;
    return index >= 0 ? Math.floor(index / PAGE_SIZE) + 1 : 1;
  });

  useEffect(() => {
    if (location.state) navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [assigning, setAssigning] = useState(null);
  const [assignTo, setAssignTo] = useState('');
  const [conflictChecked, setConflictChecked] = useState(false);
  const [assignError, setAssignError] = useState('');

  // ---- stats ----
  const active = cases.filter((c) => c.status !== 'Closed').length;
  const unassigned = cases.filter((c) => !c.attorneyNumber && c.status !== 'Closed').length;
  const countStatus = (s) => cases.filter((c) => c.status === s).length;

  // ---- search + filters ----
  const term = search.trim().toLowerCase();
  const filtered = cases
    .filter((c) => {
      if (statusTab !== 'All' && c.status !== statusTab) return false;
      if (typeFilter !== 'All' && c.type !== typeFilter) return false;
      if (assignFilter === 'Unassigned' && c.attorneyNumber) return false;
      if (assignFilter === 'Assigned' && !c.attorneyNumber) return false;
      if (term) {
        const text = `${c.caseNumber} ${c.title} ${c.clientNumber} ${clientName(c.clientNumber)}`.toLowerCase();
        if (!text.includes(term)) return false;
      }
      return true;
    })
    .sort(newestFirst);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const filtersActive = term || typeFilter !== 'All' || assignFilter !== 'All' || statusTab !== 'All';

  const clearFilters = () => {
    setStatusTab('All');
    setSearch('');
    setTypeFilter('All');
    setAssignFilter('All');
    setPage(1);
  };

  // ---- delete ----
  const confirmDelete = () => {
    setCases(cases.filter((c) => c.caseNumber !== toDelete.caseNumber));
    setTasks(tasks.filter((t) => t.caseNumber !== toDelete.caseNumber));
    setMessage(`Case ${toDelete.caseNumber} deleted.`);
    setToDelete(null);
  };

  // ---- assign attorney pop-up ----
  const attorneyOptions = (currentNumber) =>
    attorneys.map((a) => {
      const load = caseload(a.staffNumber);
      const full = load >= maxCaseload && a.staffNumber !== currentNumber;
      return (
        <option key={a.staffNumber} value={a.staffNumber} disabled={full}>
          {a.staffNumber} - {a.name} ({load}/{maxCaseload} active{full ? ', full' : ''})
        </option>
      );
    });

  const openAssign = (c) => {
    setAssigning(c);
    setAssignTo(c.attorneyNumber || '');
    setConflictChecked(false);
    setAssignError('');
  };

  const confirmAssign = () => {
    if (!assignTo) return setAssignError('Please select an attorney.');
    if (!conflictChecked) return setAssignError('Please confirm the conflict check before assigning.');
    setCases(cases.map((c) => (c.caseNumber === assigning.caseNumber ? { ...c, attorneyNumber: assignTo } : c)));
    setMessage(`${getAttorney(assignTo).name} assigned to ${assigning.caseNumber}.`);
    setAssigning(null);
  };

  return (
    <>
      <PageHeader eyebrow="Registry & litigation division" title="Case Docket & Attorney Assignment Center">
        <Button variant="primary" onClick={() => navigate('/admin/cases/new')}>
          <Icon name="plus" size={16} className="me-2" />
          Open New Case
        </Button>
      </PageHeader>

      {message && <Alert variant="success" dismissible onClose={() => setMessage('')}>{message}</Alert>}

      <Row className="g-3 mb-3">
        <Col xl={3} sm={6}><StatCard label="Total cases" value={cases.length} hint="All registered cases" icon="folder" /></Col>
        <Col xl={3} sm={6}><StatCard label="Active matters" value={active} hint="Not closed" icon="briefcase" /></Col>
        <Col xl={3} sm={6}>
          <StatCard
            label="Unassigned cases"
            value={unassigned}
            hint={unassigned > 0 ? 'Action required' : 'All active cases assigned'}
            icon="alert"
            tone={unassigned > 0 ? 'danger' : undefined}
          />
        </Col>
        <Col xl={3} sm={6}><StatCard label="Closed" value={countStatus('Closed')} hint="Archived matters" icon="checkCircle" /></Col>
      </Row>

      <div className="chips mb-3">
        {['All', ...CASE_STATUSES].map((s) => (
          <button
            type="button"
            key={s}
            className={'chip' + (statusTab === s ? ' active' : '')}
            onClick={() => { setStatusTab(s); setPage(1); }}
          >
            {s === 'All' ? 'All Cases' : s} <em>{s === 'All' ? cases.length : countStatus(s)}</em>
          </button>
        ))}
      </div>

      <div className="panel mb-3">
        <div className="panel-body filter-bar">
          <div className="search-box">
            <Icon name="search" size={16} />
            <Form.Control
              placeholder="Search by case number, case name or client"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Form.Select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} aria-label="Filter by case type">
            <option value="All">All case types</option>
            {CASE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </Form.Select>
          <Form.Select value={assignFilter} onChange={(e) => { setAssignFilter(e.target.value); setPage(1); }} aria-label="Filter by assignment">
            <option value="All">All assignments</option>
            <option value="Unassigned">Unassigned only</option>
            <option value="Assigned">Assigned only</option>
          </Form.Select>
          {filtersActive && <Button variant="outline-secondary" onClick={clearFilters}>Clear</Button>}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">
            Active Court Docket Roster
            <span className="count-badge">{filtered.length} displayed</span>
          </h2>
          <span className="cell-sub">Sort: Date opened (newest)</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case number</th>
                <th>Matter title &amp; type</th>
                <th>Client</th>
                <th>Assigned attorney</th>
                <th>Date opened</th>
                <th>Status</th>
                <th className="sticky-end"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan="7" className="empty-row">No cases found</td></tr>
              )}
              {rows.map((c) => {
                const attorney = getAttorney(c.attorneyNumber);
                const needsAttorney = !attorney && c.status !== 'Closed';
                return (
                  <tr key={c.caseNumber} className={needsAttorney ? 'row-unassigned' : ''}>
                    <td className="cell-id">{c.caseNumber}</td>
                    <td>
                      <div className="cell-title mb-1">{c.title}</div>
                      <TypePill type={c.type} />
                    </td>
                    <td>
                      <div className="cell-title">{clientName(c.clientNumber)}</div>
                      <div className="cell-sub">{c.clientNumber}</div>
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
                        <button type="button" className="unassigned-btn" onClick={() => openAssign(c)}>
                          <Icon name="alert" size={14} /> Unassigned
                        </button>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(c.dateOpened)}</td>
                    <td><StatusPill status={c.status} /></td>
                    <td className="sticky-end">
                      <div className="row-actions">
                        <button type="button" className="icon-btn accent" onClick={() => openAssign(c)} aria-label={`Assign attorney to ${c.caseNumber}`} title="Assign attorney">
                          <Icon name="userCheck" size={15} />
                        </button>
                        <button type="button" className="icon-btn" onClick={() => navigate(`/admin/cases/${c.caseNumber}/edit`)} aria-label={`Edit ${c.caseNumber}`} title="Edit case">
                          <Icon name="edit" size={15} />
                        </button>
                        <button type="button" className="icon-btn danger" onClick={() => setToDelete(c)} aria-label={`Delete ${c.caseNumber}`} title="Delete case">
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

      {/* Assign attorney */}
      <Modal show={!!assigning} onHide={() => setAssigning(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{assigning && assigning.attorneyNumber ? 'Reassign Attorney' : 'Assign Attorney to Case'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {assigning && (
            <>
              <div className="note-card mt-0 mb-3 d-block">
                <div className="eyebrow mb-1">Target case</div>
                <strong className="fs-5">{assigning.caseNumber}</strong>
                {assigning.title}
                <div className="cell-sub mt-1">
                  Client: {clientName(assigning.clientNumber)} ({assigning.clientNumber})
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Select attorney *</Form.Label>
                <Form.Select value={assignTo} onChange={(e) => { setAssignTo(e.target.value); setAssignError(''); }}>
                  <option value="">Select...</option>
                  {attorneyOptions(assigning.attorneyNumber)}
                </Form.Select>
              </Form.Group>

              <Form.Check
                type="checkbox"
                id="conflict-check"
                checked={conflictChecked}
                onChange={(e) => { setConflictChecked(e.target.checked); setAssignError(''); }}
                label="Conflict check: I confirm there is no conflict of interest between this attorney and the parties in this case."
              />
              {assignError && <div className="field-error mt-2">{assignError}</div>}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setAssigning(null)}>Cancel</Button>
          <Button variant="primary" onClick={confirmAssign}>Assign Attorney</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete case */}
      <Modal show={!!toDelete} onHide={() => setToDelete(null)} centered>
        <Modal.Header closeButton><Modal.Title>Delete case?</Modal.Title></Modal.Header>
        <Modal.Body>
          {toDelete && (
            <>
              Are you sure you want to delete <strong>{toDelete.caseNumber}</strong> ({toDelete.title})? Its legal tasks will be deleted too.
              This cannot be undone.
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
