import { useState } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import Icon from '../components/Icon';
import { Avatar, StatusPill, TypePill, formatDate } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

// No edit, add or delete buttons on this page: the client can only view.
export default function ClientDashboard() {
  const { user } = useAuth();
  const { getClient, getAttorney, cases, tasks } = useData();
  const [taskFilter, setTaskFilter] = useState('All');
  const [showProfile, setShowProfile] = useState(false);

  const client = getClient(user.clientNumber);
  if (!client) {
    return (
      <Alert variant="warning">
        We could not find your client record. Please log out and log in again.
      </Alert>
    );
  }

  const fullName = `${client.firstName} ${client.surname}`;
  const myCases = cases.filter((c) => c.clientNumber === client.clientNumber);
  const myCaseNumbers = myCases.map((c) => c.caseNumber);
  const myTasks = tasks.filter((t) => myCaseNumbers.includes(t.caseNumber));
  const doneTasks = myTasks.filter((t) => t.status === 'Complete').length;
  const progress = myTasks.length === 0 ? 0 : Math.round((doneTasks / myTasks.length) * 100);
  const shownTasks = taskFilter === 'All' ? myTasks : myTasks.filter((t) => t.status === taskFilter);

  return (
    <>
      <div className="hero mb-4">
        <div className="d-flex gap-3 align-items-center">
          <span className="brand-mark" style={{ width: 46, height: 46 }}>
            <Icon name="shield" size={22} />
          </span>
          <div>
            <div className="eyebrow">Client portal</div>
            <h2 style={{ fontSize: '1.6rem', margin: 0 }}>Welcome, {client.firstName}</h2>
          </div>
        </div>
      </div>

      {/* Profile: click to show or hide the details */}
      <div className="panel mb-4">
        <div className="panel-body">
          <button
            type="button"
            className="profile-toggle"
            onClick={() => setShowProfile(!showProfile)}
            aria-expanded={showProfile}
          >
            <span className="d-flex align-items-center gap-3">
              <Avatar name={fullName} size={56} tone="peach" />
              <span>
                <span className="d-block mb-1" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{fullName}</span>
                <span className="pill pill-type">Client no: {client.clientNumber}</span>
              </span>
            </span>
            <span className="d-flex align-items-center gap-2">
              <span className="cell-sub fw-bold">{showProfile ? 'Hide profile' : 'View profile'}</span>
              <span className="chev">
                <Icon name={showProfile ? 'chevronUp' : 'chevronDown'} size={18} />
              </span>
            </span>
          </button>

          {showProfile && (
            <div className="profile-grid">
              <div className="profile-field"><span>ID / Passport</span><strong>{client.idNumber}</strong></div>
              <div className="profile-field"><span>Gender</span><strong>{client.gender}</strong></div>
              <div className="profile-field"><span>Date of birth</span><strong>{formatDate(client.dateOfBirth)}</strong></div>
              <div className="profile-field"><span>Primary email</span><strong>{client.email}</strong></div>
              <div className="profile-field"><span>Direct telephone</span><strong>{client.phone}</strong></div>
              <div className="profile-field"><span>Address</span><strong>{client.address}</strong></div>
            </div>
          )}
        </div>
      </div>

      {/* Cases + attorney */}
      <div className="d-flex justify-content-between align-items-end mb-2">
        <div>
          <div className="eyebrow">Active litigation &amp; advisory</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Assigned Cases &amp; Legal Counsel</h2>
        </div>
        <span className="cell-sub">Total cases: {myCases.length}</span>
      </div>

      <Row className="g-3 mb-4">
        {myCases.length === 0 && (
          <Col><div className="panel panel-body text-muted">You have no cases yet.</div></Col>
        )}
        {myCases.map((c) => {
          const attorney = getAttorney(c.attorneyNumber);
          return (
            <Col lg={6} key={c.caseNumber}>
              <div className="panel case-card">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="cell-sub fw-bold">{c.caseNumber}</span>
                  <StatusPill status={c.status} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.4rem 0 0' }}>{c.title}</h3>
                <div className="case-meta">
                  <div className="profile-field"><span>Case category</span><strong><TypePill type={c.type} /></strong></div>
                  <div className="profile-field"><span>Date opened</span><strong>{formatDate(c.dateOpened)}</strong></div>
                </div>
                {attorney ? (
                  <div className="counsel-card">
                    <Avatar name={attorney.name} size={46} />
                    <div className="counsel-info">
                      <strong>{attorney.name}</strong>
                      <div className="cell-sub">Staff no: {attorney.staffNumber}</div>
                      <div style={{ color: 'var(--accent-dark)', fontWeight: 700 }}>{attorney.specialization}</div>
                      <div className="cell-sub">{attorney.phone} &middot; {attorney.email}</div>
                    </div>
                    <a
                      className="btn btn-primary btn-sm"
                      href={`mailto:${attorney.email}?subject=${encodeURIComponent('Enquiry about ' + c.caseNumber)}`}
                    >
                      <Icon name="mail" size={14} className="me-1" /> Send Inquiry
                    </a>
                  </div>
                ) : (
                  <div className="counsel-card">
                    <Icon name="alert" size={18} />
                    <div className="counsel-info">An attorney has not been assigned to this case yet.</div>
                  </div>
                )}
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Tasks */}
      <div className="panel">
        <div className="panel-head">
          <div>
            <div className="eyebrow mb-0">Legal tasks on your cases</div>
            <h2 className="panel-title" style={{ fontSize: '1.3rem' }}>Legal Activity &amp; Task Tracker</h2>
          </div>
          <div className="progress-track">
            <div className="load-top"><span>Task completion</span><span>{progress}%</span></div>
            <div className="bar"><div style={{ width: `${progress}%` }} /></div>
            <div className="cell-sub mt-1">{doneTasks} of {myTasks.length} tasks completed</div>
          </div>
        </div>
        <div className="panel-body pb-2">
          <div className="chips">
            {['All', 'Not Started', 'In Progress', 'Complete'].map((s) => (
              <button type="button" key={s} className={'chip' + (taskFilter === s ? ' active' : '')} onClick={() => setTaskFilter(s)}>
                {s === 'All' ? 'All tasks' : s}
                <em>{s === 'All' ? myTasks.length : myTasks.filter((t) => t.status === s).length}</em>
              </button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Task</th>
                <th>Case</th>
                <th>Due date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {shownTasks.length === 0 && (
                <tr><td colSpan="5" className="empty-row">No tasks to show</td></tr>
              )}
              {shownTasks.map((t) => (
                <tr key={t.taskId}>
                  <td className="cell-id">{t.taskId}</td>
                  <td>
                    <div className="cell-title">{t.name}</div>
                    <div className="cell-sub">{t.description}</div>
                  </td>
                  <td>{t.caseNumber}</td>
                  <td>{formatDate(t.dueDate)}</td>
                  <td><StatusPill status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
