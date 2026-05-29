import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import ReportView from './components/ReportView';
import TrendingCompanies from './components/TrendingCompanies';
import AgentRoster from './components/AgentRoster';
import Navbar from './components/Navbar';
import ReportHistory from './components/ReportHistory';
import { useAuth } from './context/AuthContext';

const FULL_TITLE = 'Market Intelligence Agent';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const AGENT_URL = import.meta.env.VITE_AGENT_URL;

function AnimatedTitle({ displayText }) {
  const words = displayText.split(' ');
  return (
    <h1 className="hero-title">
      {words.map((word, i) => {
        let cls = '';
        if (word === 'Market') cls = 'title-word-market';
        else if (word === 'Intelligence') cls = 'title-word-intelligence';
        else if (word === 'Agent') cls = 'title-word-agent';
        return (
          <span key={i} className={cls}>
            {word}{i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
      <span className="cursor" />
    </h1>
  );
}

export default function App() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [displayText, setDisplayText] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [activeReportId, setActiveReportId] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const reportRef = useRef(null);

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayText(FULL_TITLE.slice(0, i));
      if (i >= FULL_TITLE.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Load report history when user logs in
  useEffect(() => {
    if (!user || !token) { setHistory([]); return; }
    fetch(`${BACKEND_URL}/api/reports/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { if (data.success) setHistory(data.reports); })
      .catch(() => {});
  }, [user, token]);

  const handleAnalyze = async () => {
    if (!company.trim()) return;
    if (!user) { navigate('/login'); return; }

    setLoading(true);
    setReport(null);
    setActiveReportId(null);
    setError(null);

    try {
      // 1. Run the agent
      const res = await fetch(`${AGENT_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: company.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }
      const json = await res.json();
      const raw = json.data?.raw;
      const payload = raw ? JSON.parse(raw) : json.data;
      setReport(payload);

      // 2. Save report to MongoDB
      const saveRes = await fetch(`${BACKEND_URL}/api/reports/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company_name: company.trim(),
          report_data: payload,
        }),
      });
      const saveData = await saveRes.json();
      if (saveData.success) {
        // Prepend to history sidebar
        setHistory((prev) => [saveData.report, ...prev]);
        setActiveReportId(saveData.report._id);
      }
    } catch (e) {
      setError(e.message || 'Something went wrong. Is the agent service running?');
    } finally {
      setLoading(false);
    }
  };

  // Load a saved report from history
  const handleHistorySelect = async (reportId) => {
    if (activeReportId === reportId) return; // already showing it
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setReport(data.report.report_data);
      setActiveReportId(reportId);
      setCompany(data.report.company_name);
    } catch (e) {
      setError(e.message || 'Failed to load report.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');

    await new Promise((r) => setTimeout(r, 300));
    const element = reportRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#000000',
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      scrollX: 0,
      scrollY: -window.scrollY,
      onclone: (clonedDoc) => {
        const style = clonedDoc.createElement('style');
        style.textContent = `
          *::before, *::after { display: none !important; }
          * { background-image: none !important; animation: none !important; transition: none !important; }
          .roster-card-glow, .auth-glow, .hero-badge-dot, .loading-orb { display: none !important; }
          body, .app { background: #000000 !important; }
        `;
        clonedDoc.head.appendChild(style);
      },
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yOffset = 0;
    while (yOffset < pdfHeight) {
      if (yOffset > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -yOffset, pdfWidth, pdfHeight);
      yOffset += pageHeight;
    }

    const filename = report?.metadata?.company_name
      ? `${report.metadata.company_name.replace(/\s+/g, '_')}_intelligence_report.pdf`
      : 'market_intelligence_report.pdf';
    pdf.save(filename);
  };

  const showSidebar = user && history.length > 0;

  return (
    <div className="app">
      <Navbar />
      <div className="container">
        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            AI-Powered Analysis
          </div>
          <AnimatedTitle displayText={displayText} />
          <p className="hero-subtitle">Orchestrated Intelligence. Deep-Stack Research.</p>
          <p className="hero-subtitle">
            Experience the power of Agentic AI. Our engine replaces the single prompt with a
            sequential multi-agent workflow. By orchestrating specialized LLMs to act as
            Investigators, Architects, and Auditors, we bypass market noise to uncover
            high-signal insights.
          </p>

          {/* ── Search ── */}
          <div className="search-section">
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="search-input"
                type="text"
                placeholder={user ? "Enter a company name (e.g. Stripe, Notion, Figma)…" : "Sign in to start analyzing companies…"}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading || !user}
                aria-label="Company name"
              />
              <button
                className="search-btn"
                onClick={user ? handleAnalyze : () => navigate('/login')}
                disabled={loading || (user && !company.trim())}
                aria-label="Analyze company"
              >
                {loading ? (
                  <><span className="btn-spinner" /> Analyzing…</>
                ) : !user ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Sign In to Analyze
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    Analyze
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Trending ── */}
          {!report && !loading && (
            <TrendingCompanies onSelect={(name) => setCompany(name)} disabled={loading || !user} />
          )}
        </section>

        

        {/* ── Main layout: sidebar + content ── */}
        <div className={showSidebar ? 'app-layout' : ''}>
          {showSidebar && (
            <ReportHistory
              reports={history}
              onSelect={handleHistorySelect}
              activeId={activeReportId}
              loading={loading}
            />
          )}

          <div className={showSidebar ? 'main-content' : ''}>
            {/* ── Loading ── */}
            {loading && (
              <div className="loading-section" role="status" aria-live="polite">
                <div className="loading-orb" />
                <p className="loading-text">Running multi-agent analysis on <strong>{company}</strong>…</p>
                <div className="loading-steps">
                  {['Researcher Agent', 'Strategist Agent', 'Opportunity Agent', 'Auditor Agent', 'Report Agent'].map((step) => (
                    <div key={step} className="loading-step active">
                      <span className="step-dot" />{step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Error ── */}
            {error && (
              <div className="error-box" role="alert">
                <svg className="error-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <div className="error-title">Analysis Failed</div>
                  <div className="error-msg">{error}</div>
                </div>
              </div>
            )}

            {/* ── Report ── */}
            {report && !loading && (
              <ReportView report={report} reportRef={reportRef} onDownload={handleDownloadPDF} />
            )}
          </div>
        </div>
        {/* ── Agent Roster ── */}
        {!report && !loading && <AgentRoster />}
      </div>
    </div>
  );
}
