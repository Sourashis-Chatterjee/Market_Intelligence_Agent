const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const AGENT_URL = import.meta.env.VITE_AGENT_URL;
const REPORT_BASE = `${BACKEND_URL}/api/reports`;

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ReportHistory({ reports, onSelect, activeId, loading }) {
  if (!reports || reports.length === 0) return null;

  return (
    <aside className="history-sidebar">
      <div className="history-header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Recent Analyses
      </div>

      <div className="history-list">
        {reports.map((r) => (
          <button
            key={r._id}
            className={`history-item ${activeId === r._id ? 'history-item-active' : ''}`}
            onClick={() => onSelect(r._id)}
            disabled={loading}
            title={`View ${r.company_name} report`}
          >
            <div className="history-item-dot" />
            <div className="history-item-body">
              <div className="history-item-name">{r.company_name}</div>
              <div className="history-item-time">{timeAgo(r.created_at)}</div>
            </div>
            <svg className="history-item-arrow" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ))}
      </div>
    </aside>
  );
}
