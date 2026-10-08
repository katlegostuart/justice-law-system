import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Button, Form, Alert } from 'react-bootstrap';
import Icon from '../../components/Icon';
import { PageHeader } from '../../components/ui';
import { useData } from '../../context/DataContext';

const GENDERS = ['Male', 'Female', 'Other'];
const emptyForm = {
  firstName: '', surname: '', gender: '', dateOfBirth: '',
  idNumber: '', email: '', phone: '', address: '',
};

function validate(form, clients, editingNumber) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  if (!form.surname.trim()) errors.surname = 'Surname is required';
  if (!form.gender) errors.gender = 'Please select a gender';
  if (!form.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
  else if (new Date(form.dateOfBirth) > new Date()) errors.dateOfBirth = 'Date of birth cannot be in the future';
  if (!form.idNumber.trim()) errors.idNumber = 'ID or passport number is required';
  else if (clients.some((c) => c.clientNumber !== editingNumber && c.idNumber.replace(/\s/g, '') === form.idNumber.replace(/\s/g, ''))) {
    errors.idNumber = 'A client with this ID / passport number already exists';
  }
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address';
  if (!/^\+?[0-9 ()-]{9,15}$/.test(form.phone)) errors.phone = 'Enter a valid phone number';
  if (!form.address.trim()) errors.address = 'Address is required';
  return errors;
}

// /admin/clients/new            -> register a new client
// /admin/clients/CLI-4029/edit  -> edit an existing client
export default function ClientForm() {
  const { clientNumber: editingNumber } = useParams();
  const navigate = useNavigate();
  const { clients, setClients, nextClientNumber } = useData();

  const existing = editingNumber ? clients.find((c) => c.clientNumber === editingNumber) : null;

  const [form, setForm] = useState(() => {
    if (!existing) return emptyForm;
    const { clientNumber: _number, ...fields } = existing;
    return fields;
  });
  const [errors, setErrors] = useState({});

  const goBack = (state) => navigate('/admin/clients', { state });

  if (editingNumber && !existing) {
    return (
      <div className="form-page-wrap">
        <Alert variant="warning">Client {editingNumber} was not found.</Alert>
        <Button variant="primary" onClick={() => goBack()}>Back to clients</Button>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form, clients, editingNumber);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    if (editingNumber) {
      setClients(clients.map((c) => (c.clientNumber === editingNumber ? { ...c, ...form } : c)));
      goBack({ message: `Client ${editingNumber} updated.`, focus: editingNumber });
    } else {
      const clientNumber = nextClientNumber();
      setClients([...clients, { clientNumber, ...form }]);
      goBack({ message: `Client ${clientNumber} registered.`, focus: clientNumber });
    }
  };

  const field = (name, label, type = 'text', extra = {}) => (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control type={type} name={name} value={form[name]} onChange={handleChange} isInvalid={!!errors[name]} {...extra} />
      <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <div className="form-page-wrap">
      <button type="button" className="back-link" onClick={() => goBack()}>
        <Icon name="chevronLeft" size={16} /> Back to clients
      </button>

      <PageHeader eyebrow="Entity entry portal" title={editingNumber ? `Edit Client ${editingNumber}` : 'Register New Client'}>
        <span className="auto-badge">{editingNumber || nextClientNumber()} {editingNumber ? '' : '(Auto)'}</span>
      </PageHeader>

      <div className="panel">
        <div className="form-body">
          <Form onSubmit={handleSubmit} noValidate>
            <Row className="g-3">
              <Col md={6}>{field('firstName', 'First name', 'text', { placeholder: 'e.g. Eleanor' })}</Col>
              <Col md={6}>{field('surname', 'Surname', 'text', { placeholder: 'e.g. Vance' })}</Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <div className={'seg' + (errors.gender ? ' invalid' : '')}>
                    {GENDERS.map((g) => (
                      <button
                        type="button"
                        key={g}
                        className={'seg-btn' + (form.gender === g ? ' active' : '')}
                        onClick={() => setForm({ ...form, gender: g })}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  {errors.gender && <div className="field-error">{errors.gender}</div>}
                </Form.Group>
              </Col>
              <Col md={6}>{field('dateOfBirth', 'Date of birth', 'date', { max: new Date().toISOString().slice(0, 10) })}</Col>

              <Col md={6}>{field('idNumber', 'ID / Passport number')}</Col>
              <Col md={6}>{field('email', 'Primary email', 'email', { placeholder: 'client@domain.co.za' })}</Col>

              <Col md={6}>{field('phone', 'Mobile / telephone', 'text', { placeholder: '+27 82 000 0000' })}</Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control as="textarea" rows={2} name="address" value={form.address} onChange={handleChange} isInvalid={!!errors.address} />
                  <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="form-actions">
              <Button variant="outline-secondary" onClick={() => goBack()}>Cancel</Button>
              <Button type="submit" variant="primary">{editingNumber ? 'Save changes' : 'Save Client Record'}</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
