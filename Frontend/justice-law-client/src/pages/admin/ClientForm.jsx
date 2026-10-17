import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Button, Form, Alert } from 'react-bootstrap';
import Icon from '../../components/Icon';
import { PageHeader } from '../../components/ui';
import { useData } from '../../context/DataContext';
import api from '../../services/api';

const GENDERS = ['Male', 'Female', 'Other'];
const emptyForm = () => ({
  firstName: '', surname: '', gender: '', dateOfBirth: '',
  idNumber: '', email: '', phone: '', address: '',
});

const formFrom = (c) => ({
  firstName: c.firstName || '',
  surname: c.surname || '',
  gender: c.gender || '',
  dateOfBirth: c.dateOfBirth || '',
  idNumber: c.idNumber || '',
  email: c.email || '',
  phone: c.phone || '',
  address: c.address || '',
});

function validate(form, clients, editingId) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  else if (form.firstName.trim().length > 50) errors.firstName = 'First name must be 50 characters or fewer';
  if (!form.surname.trim()) errors.surname = 'Surname is required';
  else if (form.surname.trim().length > 50) errors.surname = 'Surname must be 50 characters or fewer';
  if (!form.gender) errors.gender = 'Please select a gender';
  if (!form.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
  else if (new Date(form.dateOfBirth) > new Date()) errors.dateOfBirth = 'Date of birth cannot be in the future';
  const idNumber = form.idNumber.replace(/\s/g, '');
  if (!idNumber) errors.idNumber = 'ID or passport number is required';
  else if (idNumber.length > 20) errors.idNumber = 'ID or passport number must be 20 characters or fewer';
  // Skip the client being edited (compare by id), otherwise a client "duplicates" themselves.
  else if (clients.some((c) => c.id !== editingId && (c.idNumber || '').replace(/\s/g, '') === idNumber)) {
    errors.idNumber = 'A client with this ID / passport number already exists';
  }
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address';
  else if (form.email.length > 100) errors.email = 'Email must be 100 characters or fewer';
  if (!/^\+?[0-9 ()-]{9,15}$/.test(form.phone)) errors.phone = 'Enter a valid phone number';
  if (!form.address.trim()) errors.address = 'Address is required';
  else if (form.address.length > 200) errors.address = 'Address must be 200 characters or fewer';
  return errors;
}

// /admin/clients/new           -> register a new client
// /admin/clients/edit/:id      -> edit an existing client (:id is the client's GUID)
export default function ClientForm() {
  const { id: editingId } = useParams();
  const navigate = useNavigate();
  const { clients, nextClientNumber, refreshData } = useData();

  const existing = editingId ? clients.find((c) => c.id === editingId) : null;

  const [form, setForm] = useState(() => (existing ? formFrom(existing) : emptyForm()));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadedId, setLoadedId] = useState(existing ? existing.id : null);
  // Worked out ONCE when the page opens, so the number you see is the number that is saved.
  const [generatedNumber] = useState(() => nextClientNumber());

  // If the page is refreshed on an edit URL, the client arrives a moment later: fill the form then.
  useEffect(() => {
    if (existing && loadedId !== existing.id) {
      setForm(formFrom(existing));
      setLoadedId(existing.id);
    }
  }, [existing, loadedId]);

  const goBack = (state) => navigate('/admin/clients', { state });

  if (editingId && !existing) {
    return (
      <div className="form-page-wrap">
        <Alert variant="warning">
          We could not find this client. If the page has just loaded, go back to the client list and try again.
        </Alert>
        <Button variant="primary" onClick={() => goBack()}>Back to clients</Button>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form, clients, editingId);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // Map UI fields to API fields. An existing client KEEPS its client number.
    const payload = {
      clientNumber: existing ? existing.clientNumber : generatedNumber,
      name: form.firstName.trim(),
      surname: form.surname.trim(),
      gender: form.gender,
      dateOfBirth: new Date(form.dateOfBirth).toISOString(),
      homeAddress: form.address.trim(),
      email: form.email.trim(),
      phoneNumber: form.phone.trim(),
      idPassportNumber: form.idNumber.trim(),
    };

    setSaving(true);
    setSubmitError('');
    try {
      if (existing) {
        await api.put(`/Clients/${existing.id}`, payload);
      } else {
        await api.post('/Clients', payload);
      }
      await refreshData(); // replaces the old window.location.reload()
      goBack({ message: existing ? 'Client updated.' : 'Client registered.' });
    } catch (err) {
      const detail = err.response?.data;
      setSubmitError(`Error saving client: ${typeof detail === 'string' && detail ? detail : err.message}`);
      setSaving(false);
    }
  };

  const field = (name, label, type = 'text', extra = {}) => (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control type={type} name={name} value={form[name]} onChange={handleChange} isInvalid={!!errors[name]} {...extra} />
      <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
    </Form.Group>
  );

  const shownNumber = existing ? existing.clientNumber : generatedNumber;

  return (
    <div className="form-page-wrap">
      <button type="button" className="back-link" onClick={() => goBack()}>
        <Icon name="chevronLeft" size={16} /> Back to clients
      </button>

      <PageHeader eyebrow="Entity entry portal" title={existing ? `Edit Client ${existing.clientNumber}` : 'Register New Client'}>
        <span className="auto-badge">{shownNumber} {existing ? '' : '(Auto)'}</span>
      </PageHeader>

      <div className="panel">
        <div className="form-body">
          {submitError && <Alert variant="danger">{submitError}</Alert>}

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
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : existing ? 'Save changes' : 'Save Client Record'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
