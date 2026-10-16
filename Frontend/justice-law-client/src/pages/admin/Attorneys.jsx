import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Modal, Button, Alert, Form } from 'react-bootstrap';
import Icon from '../../components/Icon';
import { Avatar, PageHeader, StatCard, Pager } from '../../components/ui';
import { useData } from '../../context/DataContext';
import { SPECIALIZATIONS } from '../../services/attorneyConfig';

const PAGE_SIZE = 8;

export default function Attorneys() {
  const { attorneys, setAttorneys, caseload, maxCaseload } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const [message, setMessage] = useState(location.state?.message || '');

  useEffect(() => {
    if (location.state) navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- stats ----
  const areas = new Set(attorneys.map((a) => a.specialization).filter(Boolean)).size;
  const available = attorneys.filter((a) => caseload(a.staffNumber) / maxCaseload < 0.6).length;
  const full = attorneys.filter((a) => caseload(a.staffNumber) >= maxCaseload).length;

  // ---- search + filter ----
  const term = search.trim().toLowerCase();
  const filtered = attorneys
    .filter((a) => {
      if (specFilter !== 'All' && a.specialization !== specFilter) return false;
      if (term && !`${a.staffNumber} ${a.name} ${a.specialization}`.toLowerCase().includes(term)) return false;
      return true;
    })
    .sort((a, b) => String(a.staffNumber).localeCompare(String(b.staffNumber)));

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const filtersActive = term || specFilter !== 'All';

  const confirmDelete = () => {
    setAttorneys(attorneys.filter((a) => a.staffNumber !== toDelete.staffNumber));
    setMessage(`${toDelete.name} (${toDelete.staffNumber}) deleted.`);
    setToDelete(null);
  };

  return (
    <>
      <PageHeader eyebrow="Personnel & roster" title="Legal Counsel & Attorney Directory">
        <Button variant="primary" onClick={() => navigate('/admin/attorneys/new')}>
          <Icon name="plus" size={16} className="me-2" />
          New Attorney Profile
        </Button>
      </PageHeader>

      {message && <Alert variant="success" dismissible onClose={() => setMessage('')}>{message}</Alert>}

      <Row className="g-3 mb-3">
        <Col xl={3} sm={6}><StatCard label="Registered attorneys" value={attorneys.length} hint="On the firm roster" icon="briefcase" /></Col>
        <Col xl={3} sm={6}><StatCard label="Practice areas" value={areas} hint={`Out of ${SPECIALIZATIONS.length} covered`} icon="folder" /></Col>
        <Col xl={3} sm={6}><StatCard label="Available for new cases" value={available} hint="Below 60% of the case limit" icon="checkCircle" /></Col>
        <Col xl={3} sm={6}>
          <StatCard
            label="At full caseload"
            value={full}
            hint={`Maximum ${maxCaseload} active cases each`}
            icon="alert"
            tone={full > 0 ? 'danger' : undefined}
          />
        </Col>
      </Row>

      <div className="panel mb-3">
        <div className="panel-body filter-bar">
          <div className="search-box">
            <Icon name="search" size={16} />
            <Form.Control
              placeholder="Search by staff number, name or specialization"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Form.Select value={specFilter} onChange={(e) => { setSpecFilter(e.target.value); setPage(1); }} aria-label="Filter by specialization">
            <option value="All">All specializations</option>
            {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
          </Form.Select>
          {filtersActive && (
            <Button variant="outline-secondary" onClick={() => { setSearch(''); setSpecFilter('All'); setPage(1); }}>Clear</Button>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">
            Attorney Roster
            <span className="count-badge">{filtered.length} displayed</span>
          </h2>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Attorney</th>
                <th>Specialization</th>
                <th>Contact</th>
                <th>Active cases</th>
                <th className="sticky-end"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan="5" className="empty-row">No attorneys found</td></tr>}
              {rows.map((a) => (
                <tr key={a.staffNumber}>
                  <td>
                    <div className="cell-person">
                      <Avatar name={a.name} size={36} />
                      <div>
                        <div className="cell-title">{a.name}</div>
                        <div className="cell-sub">{a.staffNumber} - {a.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td>{a.specialization}</td>
                  <td>
                    <div>{a.email}</div>
                    <div className="cell-sub">{a.phone}</div>
                  </td>
                  <td>{caseload(a.staffNumber)} / {maxCaseload}</td>
                  <td className="sticky-end">
                    <div className="row-actions">
                      <button type="button" className="icon-btn" onClick={() => navigate(`/admin/attorneys/edit/${a.staffNumber}`)} aria-label={`Edit ${a.staffNumber}`} title="Edit attorney">
                        <Icon name="edit" size={15} />
                      </button>
                      <button type="button" className="icon-btn danger" onClick={() => setToDelete(a)} aria-label={`Delete ${a.staffNumber}`} title="Delete attorney">
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager page={currentPage} pageCount={pageCount} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      <Modal show={!!toDelete} onHide={() => setToDelete(null)} centered>
        <Modal.Header closeButton><Modal.Title>Delete attorney?</Modal.Title></Modal.Header>
        <Modal.Body>
          {toDelete && (
            <>
              Are you sure you want to delete <strong>{toDelete.name}</strong> ({toDelete.staffNumber})?
              {caseload(toDelete.staffNumber) > 0 && ' This attorney still has active cases. Reassign them first, or the database may refuse the delete.'}
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