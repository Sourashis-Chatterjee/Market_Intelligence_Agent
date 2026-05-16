import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Field({ id, label, type = 'text', placeholder, iconPath, autoComplete, value, onChange, error, disabled }) {
  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <svg className="auth-input-icon" width="15" height="15" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={iconPath} />
        </svg>
        <input
          id={id}
          name={id}
          type={type}
          className={`auth-input ${error ? 'auth-input-error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
        />
      </div>
      {error && <span className="auth-field-error">{error}</span>}
    </div>
  );
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters.';
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-left" />
      <div className="auth-glow auth-glow-right" />

      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-logo">
            <span className="auth-logo-dot" />
            <span className="auth-logo-text"><span className="auth-logo-accent">M</span>IA</span>
          </div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Start your market intelligence journey</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Field
            id="name" label="Full Name" placeholder="John Doe"
            iconPath="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
            autoComplete="name" value={form.name} onChange={handleChange}
            error={errors.name} disabled={loading}
          />
          <Field
            id="email" label="Email" type="email" placeholder="you@company.com"
            iconPath="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"
            autoComplete="email" value={form.email} onChange={handleChange}
            error={errors.email} disabled={loading}
          />
          <Field
            id="password" label="Password" type="password" placeholder="Min. 6 characters"
            iconPath="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
            autoComplete="new-password" value={form.password} onChange={handleChange}
            error={errors.password} disabled={loading}
          />
          <Field
            id="confirm" label="Confirm Password" type="password" placeholder="Repeat password"
            iconPath="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            autoComplete="new-password" value={form.confirm} onChange={handleChange}
            error={errors.confirm} disabled={loading}
          />

          {serverError && (
            <div className="auth-error">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {serverError}
            </div>
          )}

          <button className="auth-submit-btn" type="submit" disabled={loading}>
            {loading ? (
              <><span className="btn-spinner" /> Creating account…</>
            ) : (
              <>
                Create Account
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
