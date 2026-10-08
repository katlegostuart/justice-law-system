import { Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { mockClients, mockAttorneys, mockCases } from '../services/mockData';

export default function AdminDashboard() {
  const { user } = useAuth();
  const stats = [
    { label: 'Active cases', value: mockCases.filter((c) => c.status !== 'Closed').length },
    { label: 'Unassigned cases', value: mockCases.filter((c) => !c.attorneyNumber).length },
    { label: 'Registered attorneys', value: mockAttorneys.length },
    { label: 'Registered clients', value: mockClients.length },
  ];
  return (
    <>
      <h3 className="mb-1">Admin Dashboard</h3>
      <p className="text-muted">Welcome, {user.name}</p>
      <Row className="g-3">
        {stats.map((s) => (
          <Col key={s.label} md={3} sm={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <div className="text-muted small">{s.label}</div>
                <div className="fs-2 fw-bold">{s.value}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
