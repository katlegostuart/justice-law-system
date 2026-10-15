import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Icon from '../components/Icon';
import { Avatar, PageHeader, StatCard, StatusPill, TypePill, formatDate } from '../components/ui';
import { useData } from '../context/DataContext';

export default function AdminDashboard() {
  const { clients, attorneys, cases, getAttorney, clientName, caseload, maxCaseload } = useData();

  const active = cases.filter((c) => c.status !== 'Closed').length;
  const unassigned = cases.filter((c) => !c.attorneyNumber && c.status !== 'Closed').length;

  const recent = [...cases].sort((a, b) => b.dateOpened.localeCompare(a.dateOpened)).slice(0, 6);

  return (
    <>
      <div className="hero mb-4">
        <div>
          <div className="eyebrow">Firm overview</div>
          <h2>Administrator Command Center</h2>
        </div>
        <div className="hero-actions">
          <Link to="/admin/clients/new" className="btn btn-ghost-light">
            <Icon name="userPlus" size={16} /> Register Client
          </Link>
          <Link to="/admin/cases/new" className="btn btn-accent">
            <Icon name="plus" size={16} /> New Case
          </Link>
        </div>
      </div>

      <Row className="g-3 mb-4">
        <Col xl={3} sm={6}>
          <StatCard label="Total active cases" value={active} hint={`${cases.length} cases in total`} icon="folder" />
        </Col>
        <Col xl={3} sm={6}>
          <StatCard
            label="Unassigned matters"
            value={unassigned}
            hint={unassigned > 0 ? 'Action required: needs an attorney' : 'All cases have an attorney'}
            icon="alert"
            tone={unassigned > 0 ? 'danger' : undefined}
          />
        </Col>
        <Col xl={3} sm={6}>
          <StatCard label="Registered attorneys" value={attorneys.length} hint={`Max ${maxCaseload} active cases each`} icon="briefcase" />
        </Col>
        <Col xl={3} sm={6}>
          <StatCard label="Registered clients" value={clients.length} hint="Each client can hold many cases" icon="users" />
        </Col>
      </Row>

      <Row className="g-3">
        <Col xl={8}>
          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">
                Active Case Docket &amp; Attorney Roster
                <span className="count-badge">Showing {recent.length} of {cases.length}</span>
              </h2>
              <Link to="/admin/cases" className="link-btn">View all cases</Link>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Case</th>
                    <th>Matter</th>
                    <th>Client</th>
                    <th>Assigned attorney</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((c) => {
                    const attorney = getAttorney(c.attorneyNumber);
                    return (
                      <tr key={c.caseNumber} className={!attorney && c.status !== 'Closed' ? 'row-unassigned' : ''}>
                        <td>
                          <div className="cell-id">{c.caseNumber}</div>
                          <div className="cell-sub">{formatDate(c.dateOpened)}</div>
                        </td>
                        <td>
                          <div className="cell-title">{c.title}</div>
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
                            <Link to="/admin/cases" className="unassigned-btn">
                              <Icon name="alert" size={14} /> Unassigned
                            </Link>
                          )}
                        </td>
                        <td><StatusPill status={c.status} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Col>

        <Col xl={4}>
          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">Caseload Dispersion</h2>
            </div>
            <div className="panel-body">
              <p className="cell-sub mb-3">Active cases per attorney (maximum {maxCaseload}).</p>
              {attorneys.map((a) => {
                const load = caseload(a.staffNumber);
                const pct = Math.round((load / maxCaseload) * 100);
                return (
                  <div className="load-row" key={a.staffNumber}>
                    <div className="load-top">
                      <span>{a.name} ({a.staffNumber})</span>
                      <span>{load} / {maxCaseload}</span>
                    </div>
                    <div className="bar">
                      <div className={pct >= 75 ? 'warm' : ''} style={{ width: `${Math.max(pct, 3)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
