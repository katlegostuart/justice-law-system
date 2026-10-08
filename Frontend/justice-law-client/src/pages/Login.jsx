import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import Icon from '../components/Icon';
import { useAuth, roleHome } from '../context/AuthContext';

export default function Login() {
  const [tab, setTab] = useState('firm'); // 'firm' = Admin / Attorney, 'client' = Client
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const data = await login(email, password);

      // The tab must match the kind of account
      if (tab === 'client' && data.role !== 'Client') {
        logout();
        setError('This is a firm account. Please use the "Firm Personnel" tab.');
        return;
      }
      if (tab === 'firm' && data.role === 'Client') {
        logout();
        setError('This is a client account. Please use the "Client Portal" tab.');
        return;
      }

      navigate(roleHome[data.role]);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <header className="login-top">
        <div className="brand">
          <span className="brand-mark">
            <Icon name="scale" size={22} />
          </span>
          <div className="brand-text">
            <strong>JusticeLaw Attorneys</strong>
            <small>LEGAL PRACTICE MANAGEMENT PORTAL</small>
          </div>
        </div>
        <span className="secure-tag">
          <Icon name="lock" size={14} /> Secure sign-in
        </span>
      </header>

      <main className="login-main">
        <div className="login-card">
          <section className="login-left">
            <div className="brand">
              <span className="brand-mark">
                <Icon name="scale" size={22} />
              </span>
              <div className="brand-text">
                <strong>JUSTICELAW ATTORNEYS</strong>
                <small>LEGAL PRACTICE PORTAL</small>
              </div>
            </div>
            <div>
              <h2>Integrity, Confidentiality &amp; Fiduciary Excellence</h2>
              <p>Direct authenticated access to your legal matters, case dockets and confidential client records.</p>
            </div>
          </section>

          <section className="login-right">
            <h1>Sign In</h1>
            <p className="lead-text">Access your legal matters, dockets and confidential case records.</p>

            <div className="login-tabs" role="tablist">
              <button type="button" className={'login-tab' + (tab === 'firm' ? ' active' : '')} onClick={() => { setTab('firm'); setError(''); }}>
                <Icon name="briefcase" size={16} /> Firm Personnel
              </button>
              <button type="button" className={'login-tab' + (tab === 'client' ? ' active' : '')} onClick={() => { setTab('client'); setError(''); }}>
                <Icon name="user" size={16} /> Client Portal
              </button>
            </div>

            {error && <Alert variant="danger" className="py-2">{error}</Alert>}
            {info && <Alert variant="info" className="py-2">{info}</Alert>}

            <form onSubmit={handleSubmit}>
              <label className="field-label" htmlFor="email">Email address</label>
              <div className="input-icon mt-1">
                <Icon name="mail" size={18} />
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="name@justicelaw.co.za"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field-row">
                <label className="field-label" htmlFor="password">Password</label>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setInfo('Please contact the firm administrator to reset your password.')}
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-icon">
                <Icon name="lock" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="toggle-eye" onClick={() => setShowPassword(!showPassword)} aria-label="Show or hide password">
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
                </button>
              </div>

              <button type="submit" className="btn btn-primary btn-signin" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In to JusticeLaw'}
                {!loading && <Icon name="arrowRight" size={18} />}
              </button>
            </form>

            <div className="help-box">
              <strong>Need assistance?</strong> Contact the firm administrator to set up your account or reset your password.
            </div>
          </section>
        </div>
      </main>

      <footer className="login-foot">
        &copy; {new Date().getFullYear()} JusticeLaw Attorneys. Confidential and privileged access only.
      </footer>
    </div>
  );
}
