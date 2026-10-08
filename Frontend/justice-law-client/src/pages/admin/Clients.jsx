import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Modal, Button, Alert, Form } from 'react-bootstrap';
import Icon from '../../components/Icon';
import { Avatar, PageHeader, StatCard, Pager } from '../../components/ui';
import { useData } from '../../context/DataContext';

const PAGE_SIZE = 6;
const GENDERS = ['Male', 'Female', 'Other'];

export default function Clients() {
  const { clients, setClients, cases } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [casesFilter, setCasesFilter] = useState('All');
  const [toDelete, setToDelete] = useState(null);

  // The form page sends back a message and the client it just saved
  const [message, setMessage] = useState(location.state?.message || '');
  const [page, setPage] = useState(() => {
    const focus = location.state?.focus;
    const index = focus ? clients.findIndex((c) => c.clientNumber === focus) : -1;
    return index >= 0 ? Math.floor(index / PAGE_SIZE) + 1 : 1;
  });

  useEffect(() => {
    // clear the message from the browser history so it does not come back on refresh
    if (location.state) navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const caseCount = (clientNumber) => cases.filter((c) => c.clientNumber === clientNumber).length;

  // ---- stats ----
  const withCases = clients.filter((c) => caseCount(c.clientNumber) > 0).length;
  const females = clients.filter((c) => c.gender === 'Female').length;
  const males = clients.filter((c) => c.gender === 'Male').length;

  // ---- search + filters ----
  const term = search.trim().toLowerCase();
  const filtered = clients.filter((c) => {
    const text = `${c.clientNumber} ${c.firstName} ${c.surname}`.toLowerCase();
    if (term && !text.includes(term)) return false;
    if (genderFilter !== 'All' && c.gender !== genderFilter) return false;
    if (casesFilter === 'With cases' && caseCount(c.clientNumber) === 0) return false;
    if (casesFilter === 'No cases' && caseCount(c.clientNumber) > 0) return false;
    return true;
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const filtersActive = term || genderFilter !== 'All' || casesFilter !== 'All';

  const clearFilters = () => {
    setSearch('');
    setGenderFilter('All');
    setCasesFilter('All');
    setPage(1);
  };

  const confirmDelete = () => {
    setClients(clients.filter((c) => c.clientNumber !== toDelete.clientNumber));
    setMessage(`Client ${toDelete.clientNumber} deleted.`);
    setToDelete(null);
  };

  const deleteBlocked = toDelete && caseCount(toDelete.clientNumber) > 0;

  return (
    <>
      <PageHeader eyebrow="Client registry" title="Client Management">
        <Button variant="primary" onClick={() => navigate('/admin/clients/new')}>
          <Icon name="userPlus" size={16} className="me-2" />
          Register New Client
        </Button>
      </PageHeader>

      {message && <Alert variant="success" dismissible onClose={() => setMessage('')}>{message}</Alert>}

      <Row className="g-3 mb-3">
        <Col xl={3} sm={6}><StatCard label="Registered clients" value={clients.length} hint="In the client registry" icon="users" /></Col>
        <Col xl={3} sm={6}><StatCard label="With cases" value={withCases} hint="At least one case" icon="folder" /></Col>
        <Col xl={3} sm={6}><StatCard label="Without cases" value={clients.length - withCases} hint="No case opened yet" icon="user" /></Col>
        <Col xl={3} sm={6}><StatCard label="Female : Male" value={`${females} : ${males}`} hint={`${clients.length - females - males} other`} icon="userCheck" /></Col>
      </Row>

      <div className="panel mb-3">
        <div className="panel-body filter-bar">
          <div className="search-box">
            <Icon name="search" size={16} />
            <Form.Control
              placeholder="Search by client number, name or surname"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Form.Select value={genderFilter} onChange={(e) => { setGenderFilter(e.target.value); setPage(1); }} aria-label="Filter by gender">
            <option value="All">All genders</option>
            {GENDERS.map((g) => <option key={g}>{g}</option>)}
          </Form.Select>
          <Form.Select value={casesFilter} onChange={(e) => { setCasesFilter(e.target.value); setPage(1); }} aria-label="Filter by cases">
            <option value="All">All clients</option>
            <option>With cases</option>
            <option>No cases</option>
          </Form.Select>
          {filtersActive && <Button variant="outline-secondary" onClick={clearFilters}>Clear</Button>}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">
            Registered Client Entities
            <span className="count-badge">{clients.length} total</span>
          </h2>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client #</th>
                <th>Client</th>
                <th>ID / Passport</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Cases</th>
                <th className="sticky-end"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan="7" className="empty-row">No clients found</td></tr>
              )}
              {rows.map((c) => (
                <tr key={c.clientNumber}>
                  <td className="cell-id">{c.clientNumber}</td>
                  <td>
                    <div className="cell-person">
                      <Avatar name={`${c.firstName} ${c.surname}`} />
                      <div>
                        <div className="cell-title">{c.firstName} {c.surname}</div>
                        <div className="cell-sub">{c.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td>{c.idNumber}</td>
                  <td>
                    <div>{c.email}</div>
                    <div className="cell-sub">{c.phone}</div>
                  </td>
                  <td style={{ maxWidth: 220 }}>{c.address}</td>
                  <td><span className="pill pill-count">{caseCount(c.clientNumber)}</span></td>
                  <td className="sticky-end">
                    <div className="row-actions">
                      <button type="button" className="icon-btn" onClick={() => navigate(`/admin/clients/${c.clientNumber}/edit`)} aria-label={`Edit ${c.clientNumber}`}>
                        <Icon name="edit" size={15} />
                      </button>
                      <button type="button" className="icon-btn danger" onClick={() => setToDelete(c)} aria-label={`Delete ${c.clientNumber}`}>
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
        <Modal.Header closeButton>
          <Modal.Title>{deleteBlocked ? 'Client cannot be deleted' : 'Delete client?'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {toDelete && deleteBlocked ? (
            <>
              <strong>{toDelete.firstName} {toDelete.surname}</strong> ({toDelete.clientNumber}) still has{' '}
              {caseCount(toDelete.clientNumber)} case(s). Delete or reassign those cases first.
            </>
          ) : (
            toDelete && (
              <>
                Are you sure you want to delete <strong>{toDelete.firstName} {toDelete.surname}</strong> ({toDelete.clientNumber})?
                This cannot be undone.
              </>
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setToDelete(null)}>{deleteBlocked ? 'Close' : 'Cancel'}</Button>
          {!deleteBlocked && <Button variant="danger" onClick={confirmDelete}>Delete</Button>}
        </Modal.Footer>
      </Modal>
    </>
  );
}
