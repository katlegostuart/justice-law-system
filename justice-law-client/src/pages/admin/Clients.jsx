import { useState } from 'react';
import { Row, Col, Card, Form, Button, Table, Modal, Alert, InputGroup } from 'react-bootstrap';
import { mockClients } from '../../services/mockData';

const emptyForm = {
  firstName: '', surname: '', gender: '', dateOfBirth: '',
  idNumber: '', email: '', phone: '', address: '',
};

function nextClientNumber(clients) {
  const highest = clients.reduce(
    (max, c) => Math.max(max, parseInt(c.clientNumber.replace('CLI-', ''), 10)), 0);
  return 'CLI-' + String(highest + 1).padStart(4, '0');
}

function validate(form) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  if (!form.surname.trim()) errors.surname = 'Surname is required';
  if (!form.gender) errors.gender = 'Please select a gender';
  if (!form.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
  else if (new Date(form.dateOfBirth) > new Date()) errors.dateOfBirth = 'Date of birth cannot be in the future';
  if (!form.idNumber.trim()) errors.idNumber = 'ID or passport number is required';
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address';
  if (!/^\+?[0-9 ()-]{9,15}$/.test(form.phone)) errors.phone = 'Enter a valid phone number';
  if (!form.address.trim()) errors.address = 'Address is required';
  return errors;
}

export default function Clients() {
  const [clients, setClients] = useState(mockClients);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingNumber, setEditingNumber] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [toDelete, setToDelete] = useState(null);

  const term = search.trim().toLowerCase();
  const visible = clients.filter((c) =>
    (c.clientNumber + ' ' + c.firstName + ' ' + c.surname).toLowerCase().includes(term));

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingNumber(null);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    if (editingNumber) {
      setClients(clients.map((c) => (c.clientNumber === editingNumber ? { ...c, ...form } : c)));
      setMessage('Client ' + editingNumber + ' updated.');
    } else {
      const clientNumber = nextClientNumber(clients);
      setClients([...clients, { clientNumber, ...form }]);
      setMessage('Client ' + clientNumber + ' registered.');
    }
    resetForm();
  };

  const startEdit = (client) => {
    const { clientNumber, ...fields } = client;
    setForm(fields);
    setEditingNumber(clientNumber);
    setErrors({});
    setMessage('');
  };

  const confirmDelete = () => {
    setClients(clients.filter((c) => c.clientNumber !== toDelete.clientNumber));
    setMessage('Client ' + toDelete.clientNumber + ' deleted.');
    if (editingNumber === toDelete.clientNumber) resetForm();
    setToDelete(null);
  };

  const field = (name, label, type = 'text') => (
    <Form.Group className="mb-2">
      <Form.Label className="small fw-semibold">{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        isInvalid={!!errors[name]}
      />
      <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <>
      <h3 className="mb-1">Client Management</h3>
      <p className="text-muted">Register, search, edit and delete clients.</p>
      {message && <Alert variant="success" dismissible onClose={() => setMessage('')}>{message}</Alert>}

      <Row className="g-3">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Search by client number, name or surname"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && <Button variant="outline-secondary" onClick={() => setSearch('')}>Clear</Button>}
              </InputGroup>
              <div className="text-muted small mb-2">
                Showing {visible.length} of {clients.length} clients
              </div>
              <div style={{ overflowX: 'auto' }}>
                <Table hover size="sm" className="align-middle">
                  <thead>
                    <tr>
                      <th>Client #</th>
                      <th>Name</th>
                      <th>Gender</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.length === 0 && (
                      <tr><td colSpan="6" className="text-center text-muted py-4">No clients found</td></tr>
                    )}
                    {visible.map((c) => (
                      <tr key={c.clientNumber}>
                        <td className="fw-semibold">{c.clientNumber}</td>
                        <td>{c.firstName} {c.surname}</td>
                        <td>{c.gender}</td>
                        <td>{c.email}</td>
                        <td>{c.phone}</td>
                        <td className="text-nowrap">
                          <Button size="sm" variant="outline-primary" className="me-1" onClick={() => startEdit(c)}>Edit</Button>
                          <Button size="sm" variant="outline-danger" onClick={() => setToDelete(c)}>Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>{editingNumber ? 'Edit ' + editingNumber : 'Register New Client'}</h5>
              <div className="text-muted small mb-3">
                Client number: {editingNumber ? editingNumber : nextClientNumber(clients) + ' (auto)'}
              </div>
              <Form onSubmit={handleSubmit} noValidate>
                {field('firstName', 'First name')}
                {field('surname', 'Surname')}
                <Form.Group className="mb-2">
                  <Form.Label className="small fw-semibold">Gender</Form.Label>
                  <Form.Select name="gender" value={form.gender} onChange={handleChange} isInvalid={!!errors.gender}>
                    <option value="">Select...</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
                </Form.Group>
                {field('dateOfBirth', 'Date of birth', 'date')}
                {field('idNumber', 'ID / Passport number')}
                {field('email', 'Email', 'email')}
                {field('phone', 'Phone')}
                {field('address', 'Address')}
                <div className="d-grid gap-2 mt-3">
                  <Button type="submit">{editingNumber ? 'Save changes' : 'Save client'}</Button>
                  <Button variant="outline-secondary" onClick={resetForm}>Cancel / Reset</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={!!toDelete} onHide={() => setToDelete(null)} centered>
        <Modal.Header closeButton><Modal.Title>Delete client?</Modal.Title></Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {toDelete && toDelete.firstName + ' ' + toDelete.surname}
          {toDelete && ' (' + toDelete.clientNumber + ')'}? This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setToDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
