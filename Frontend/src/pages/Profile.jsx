import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ reportsRun: '—', companiesTracked: '—' });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const AGENT_URL = import.meta.env.VITE_AGENT_URL;

  useEffect(() => {
    if (!token) return;
    fetch(`${BACKEND_URL}/api/reports/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const reports = data.reports;
          const unique = new Set(reports.map((r) => r.company_name.toLowerCase())).size;
          setStats({ reportsRun: reports.length, companiesTracked: unique });
        }
      })
      .catch(() => {});
  }, [token]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const initials = (user.name || user.email || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-left" />
      <div className="auth-glow auth-glow-right" />

      <div className="auth-card profile-card">
        {/* Avatar */}
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-avatar-ring" />
        </div>

        <h1 className="profile-name">{user.name || 'User'}</h1>
        <p className="profile-email">{user.email}</p>

        <div className="profile-divider" />

        <div className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-value">{stats.reportsRun}</div>
            <div className="profile-stat-label">Reports Run</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-value">{stats.companiesTracked}</div>
            <div className="profile-stat-label">Companies Tracked</div>
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-actions">
          <button className="profile-back-btn" onClick={() => navigate('/')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <button className="profile-logout-btn" onClick={() => { logout(); navigate('/'); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
