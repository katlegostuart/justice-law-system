import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Button, Form, Alert } from 'react-bootstrap';
import Icon from '../../components/Icon';
import { useData } from '../../context/DataContext';
import { SPECIALIZATIONS } from '../../services/attorneyConfig';

const NAME_RE = /^[A-Za-z' -]{2,}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9 ()-]{10,18}$/;

const emptyForm = () => ({ firstName: '', surname: '', gender: '', specialization: '', email: '', phone: '' });

function validate(form, attorneys, editingNumber) {
  const errors = {};
  const email = form.email.trim().toLowerCase();
  if (!NAME_RE.test(form.firstName.trim())) errors.firstName = 'Enter a name using letters only (at least 2)';
  if (!NAME_RE.test(form.surname.trim())) errors.surname = 'Enter a surname using letters only (at least 2)';
  if (!form.gender) errors.gender = 'Select a gender';
  if (!form.specialization) errors.specialization = 'Select a specialization';
  if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email, e.g. name@justicelaw.co.za';
  else if (attorneys.some((a) => a.staffNumber !== editingNumber && String(a.email).toLowerCase() === email)) {
    errors.email = 'This email is already registered';
  }
  if (!PHONE_RE.test(form.phone.trim())) errors.phone = 'Enter a valid phone number, e.g. +27 11 555 0192';
  return errors;
}

// /admin/attorneys/new        -> register an attorney
// /admin/attorneys/edit/STF-102 -> edit an existing attorney
export default function AttorneyForm() {
  const { id: editingNumber } = useParams();
  const navigate = useNavigate();
  const { attorneys, setAttorneys, nextStaffNumber } = useData();

  const existing = editingNumber ? attorneys.find((a) => a.staffNumber === editingNumber) : null;
  const editing = !!editingNumber;

  const [form, setForm] = useState(() =>
    existing
      ? { firstName: existing.firstName || '', surname: existing.surname || '', gender: existing.gender || '', specialization: existing.specialization || '', email: existing.email || '', phone: existing.phone || '' }
      : emptyForm()
  );
  const [errors, setErrors] = useState({});

  const goBack = (state) => navigate('/admin/attorneys', { state });

  if (editing && !existing) {
    return (
      <div className="form-page-wrap">
        <Alert variant="warning">Attorney {editingNumber} was not found. Go back to the list and open it from there.</Alert>
        <Button variant="primary" onClick={() => goBack()}>Back to attorneys</Button>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form, attorneys, editingNumber);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const data = {
      firstName: form.firstName.trim(),
      surname: form.surname.trim(),
      gender: form.gender,
      specialization: form.specialization,
      email: form.email.trim(),
      phone: form.phone.trim(),
    };
    const name = `${data.firstName} ${data.surname}`;

    if (editing) {
      setAttorneys(attorneys.map((a) => (a.staffNumber === editingNumber ? { ...a, ...data, name } : a)));
      goBack({ message: `${name} updated.` });
    } else {
      setAttorneys([...attorneys, { staffNumber: nextStaffNumber(), ...data, name }]);
      goBack({ message: `${name} registered.` });
    }
  };

  return (
    <div className="form-page-wrap">
      <button type="button" className="back-link" onClick={() => goBack()}>
        <Icon name="chevronLeft" size={16} /> Back to attorneys
      </button>

      <div className="panel">
        <div className="form-head dark">
          <div className="eyebrow">Personnel &amp; roster</div>
          <h3>{editing ? `Edit ${editingNumber}` : 'Register Legal Counsel'}</h3>
          <p>Add an attorney to the roster so they can be assigned to cases.</p>
        </div>

        <div className="form-body">
          <Form onSubmit={handleSubmit} noValidate>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Staff number (auto-generated)</Form.Label>
                  <Form.Control value={editingNumber || nextStaffNumber()} readOnly style={{ fontWeight: 700 }} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Gender *</Form.Label>
                  <div>
                    {['Male', 'Female', 'Other'].map((g) => (
                      <Form.Check key={g} inline type="radio" id={`gender-${g}`} name="gender" label={g} value={g} checked={form.gender === g} onChange={handleChange} />
                    ))}
                  </div>
                  {errors.gender && <div className="field-error">{errors.gender}</div>}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Name *</Form.Label>
                  <Form.Control name="firstName" value={form.firstName} onChange={handleChange} isInvalid={!!errors.firstName} placeholder="e.g. Bhekisisa" />
                  <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Surname *</Form.Label>
                  <Form.Control name="surname" value={form.surname} onChange={handleChange} isInvalid={!!errors.surname} placeholder="e.g. Cele" />
                  <Form.Control.Feedback type="invalid">{errors.surname}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Legal specialization *</Form.Label>
                  <Form.Select name="specialization" value={form.specialization} onChange={handleChange} isInvalid={!!errors.specialization}>
                    <option value="">Select...</option>
                    {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.specialization}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone number *</Form.Label>
                  <Form.Control type="tel" name="phone" value={form.phone} onChange={handleChange} isInvalid={!!errors.phone} placeholder="+27 11 555 9012" />
                  <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Firm email address *</Form.Label>
                  <Form.Control type="email" name="email" value={form.email} onChange={handleChange} isInvalid={!!errors.email} placeholder="b.cele@justicelaw.co.za" />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="form-actions">
              <Button variant="outline-secondary" onClick={() => goBack()}>Cancel</Button>
              <Button type="submit" variant="primary">{editing ? 'Save changes' : 'Register Attorney'}</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}