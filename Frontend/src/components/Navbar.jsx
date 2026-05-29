import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* ── Brand ── */}
      <button className="navbar-brand" onClick={() => navigate('/')} aria-label="Home">
        <span className="navbar-brand-dot" />
        <span className="navbar-brand-text">
          <span className="navbar-brand-m">Market</span>IntelAI
        </span>
      </button>

      {/* ── Right side ── */}
      <div className="navbar-right">
        {user ? (
          /* ── Logged-in: avatar + dropdown ── */
          <div className="navbar-profile" ref={dropRef}>
            <button
              className="navbar-avatar-btn"
              onClick={() => setDropOpen((p) => !p)}
              aria-label="Profile menu"
              aria-expanded={dropOpen}
            >
              <div className="navbar-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="navbar-username">{user.name || user.email}</span>
              <svg
                className={`navbar-chevron ${dropOpen ? 'open' : ''}`}
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {dropOpen && (
              <div className="navbar-dropdown">
                <div className="navbar-dropdown-header">
                  <div className="navbar-dropdown-name">{user.name || 'User'}</div>
                  <div className="navbar-dropdown-email">{user.email}</div>
                </div>
                <div className="navbar-dropdown-divider" />
                <button
                  className="navbar-dropdown-item"
                  onClick={() => { setDropOpen(false); navigate('/profile'); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  My Profile
                </button>
                <div className="navbar-dropdown-divider" />
                <button className="navbar-dropdown-item danger" onClick={handleLogout}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Guest: login + signup ── */
          <div className="navbar-auth">
            <button className="navbar-login-btn" onClick={() => navigate('/login')}>
              Log In
            </button>
            <button className="navbar-signup-btn" onClick={() => navigate('/register')}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
