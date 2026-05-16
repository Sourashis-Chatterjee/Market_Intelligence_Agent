function safeHostname(url) {
  if (!url) return '—';
  try { return new URL(url).hostname; } catch { return url; }
}

/* ── Helpers ──────────────────────────────────────────────────── */
function sentimentClass(score) {
  if (score >= 0.3) return 'positive';
  if (score <= -0.3) return 'negative';
  return 'neutral';
}

function sentimentColor(score) {
  if (score >= 0.3) return 'var(--success)';
  if (score <= -0.3) return 'var(--danger)';
  return 'var(--warning)';
}

function severityClass(s) {
  return (s || '').toLowerCase();
}

function formatTimestamp(ts) {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return ts;
  }
}

/* ── Icon components (inline SVG, no deps) ───────────────────── */
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  zap:      'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  users:    'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  code:     'M16 18l6-6-6-6M8 6l-6 6 6 6',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  star:     'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  alert:    'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  target:   'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  map:      'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z',
  shield:   'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  link:     'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  bar:      'M18 20V10M12 20V4M6 20v-6',
};

/* ── Card wrapper ─────────────────────────────────────────────── */
function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function CardHeader({ iconKey, iconColor = 'blue', title }) {
  return (
    <div className="card-header">
      <div className={`card-icon ${iconColor}`}>
        <Icon d={icons[iconKey]} size={16} />
      </div>
      <span className="card-title">{title}</span>
    </div>
  );
}

/* ── Section: Metadata strip ──────────────────────────────────── */
function MetaStrip({ meta }) {
  if (!meta) return null;
  return (
    <div className="report-meta">
      {meta.analysis_timestamp && (
        <span className="meta-chip">
          🕐 <span className="meta-chip-value">{formatTimestamp(meta.analysis_timestamp)}</span>
        </span>
      )}
      {meta.agent_processing_time_sec != null && (
        <span className="meta-chip">
          ⚡ <span className="meta-chip-value">{Number(meta.agent_processing_time_sec).toFixed(1)}s</span>
        </span>
      )}
      {meta.total_tokens_used != null && (
        <span className="meta-chip">
          🔢 <span className="meta-chip-value">{Number(meta.total_tokens_used).toLocaleString()} tokens</span>
        </span>
      )}
      {meta.confidence_score != null && (
        <span className="meta-chip">
          Confidence&nbsp;
          <span className="confidence-bar-wrap">
            <span className="confidence-bar">
              <span
                className="confidence-fill"
                style={{ width: `${Math.round(parseFloat(meta.confidence_score) * 100)}%` }}
              />
            </span>
            <span className="meta-chip-value">{Math.round(parseFloat(meta.confidence_score) * 100)}%</span>
          </span>
        </span>
      )}
    </div>
  );
}

/* ── Section: Market Intelligence ────────────────────────────── */
function MarketIntelligenceSection({ data }) {
  if (!data) return null;
  const { core_value_prop, target_persona, estimated_tech_stack, recent_trigger_events } = data;

  return (
    <>
      {/* Value prop + persona */}
      <div className="col-8">
        <Card>
          <CardHeader iconKey="zap" iconColor="blue" title="Core Value Proposition" />
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
            {core_value_prop || '—'}
          </p>
          {target_persona && (
            <>
              <div className="card-title" style={{ marginBottom: 10 }}>Target Persona</div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {target_persona}
              </p>
            </>
          )}
        </Card>
      </div>

      {/* Tech stack */}
      <div className="col-4">
        <Card>
          <CardHeader iconKey="code" iconColor="cyan" title="Estimated Tech Stack" />
          <div className="tag-list">
            {(estimated_tech_stack || []).map((t, i) => (
              <span key={i} className={`tag ${i % 2 === 0 ? '' : 'cyan'}`}>{t}</span>
            ))}
            {(!estimated_tech_stack || estimated_tech_stack.length === 0) && (
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No data</span>
            )}
          </div>
        </Card>
      </div>

      {/* Trigger events */}
      {recent_trigger_events && recent_trigger_events.length > 0 && (
        <div className="col-12">
          <Card>
            <CardHeader iconKey="activity" iconColor="amber" title="Recent Trigger Events" />
            <div className="event-list">
              {recent_trigger_events.map((ev, i) => (
                <div key={i} className="event-item">
                  <span className={`event-sig ${severityClass(ev.impact_significance)}`}>
                    {ev.impact_significance || 'info'}
                  </span>
                  <div className="event-body">
                    <div className="event-title">{ev.event}</div>
                    {ev.date && <div className="event-date">{ev.date}</div>}
                    {ev.source_url && (
                      <a className="event-link" href={ev.source_url} target="_blank" rel="noreferrer">
                        View source ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

/* ── Section: Sentiment ───────────────────────────────────────── */
function SentimentSection({ data }) {
  if (!data) return null;
  const { aggregate_score, market_perception_summary, praise_points, friction_points } = data;
  const score = parseFloat(aggregate_score) ?? 0;
  const cls = sentimentClass(score);
  const color = sentimentColor(score);
  const pct = Math.round(((score + 1) / 2) * 100);

  return (
    <>
      {/* Score card */}
      <div className="col-4">
        <Card>
          <CardHeader iconKey="star" iconColor="amber" title="Sentiment Score" />
          <div className={`sentiment-score ${cls}`}>
            {score >= 0 ? '+' : ''}{score.toFixed(2)}
          </div>
          <div className="sentiment-label">{cls.charAt(0).toUpperCase() + cls.slice(1)} market perception</div>
          <div className="sentiment-bar-track">
            <div
              className="sentiment-bar-fill"
              style={{ width: `${pct}%`, background: color }}
            />
          </div>
          {market_perception_summary && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {market_perception_summary}
            </p>
          )}
        </Card>
      </div>

      {/* Praise points */}
      <div className="col-4">
        <Card>
          <CardHeader iconKey="star" iconColor="green" title="Praise Points" />
          <ul className="bullet-list">
            {(praise_points || []).map((p, i) => (
              <li key={i}>
                <span className="bullet-dot green" />
                {p}
              </li>
            ))}
            {(!praise_points || praise_points.length === 0) && (
              <li><span className="bullet-dot" />No data</li>
            )}
          </ul>
        </Card>
      </div>

      {/* Friction points */}
      <div className="col-4">
        <Card>
          <CardHeader iconKey="alert" iconColor="red" title="Friction Points" />
          <div className="friction-list">
            {(friction_points || []).map((fp, i) => (
              <div key={i} className="friction-item">
                <div className="friction-issue">{fp.issue}</div>
                {fp.evidence_quote && (
                  <div className="friction-quote">"{fp.evidence_quote}"</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {fp.frequency_signal && (
                    <span className={`friction-freq ${fp.frequency_signal === 'high' ? 'high' : 'med'}`}>
                      ● {fp.frequency_signal} frequency
                    </span>
                  )}
                  {fp.source && (
                    <a className="event-link" href={fp.source} target="_blank" rel="noreferrer">
                      Source ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
            {(!friction_points || friction_points.length === 0) && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No friction points identified.</p>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

/* ── Section: SWOT ────────────────────────────────────────────── */
function SwotSection({ data }) {
  if (!data) return null;
  const { strengths, weaknesses, opportunities, threats } = data;

  const renderItems = (items, field = 'point') =>
    (items || []).map((item, i) => (
      <div key={i} className="swot-item">
        {typeof item === 'string' ? item : item[field] || item.point || JSON.stringify(item)}
      </div>
    ));

  return (
    <div className="col-12">
      <Card>
        <CardHeader iconKey="target" iconColor="blue" title="Technical SWOT Analysis" />
        <div className="swot-grid">
          <div className="swot-quadrant">
            <div className="swot-label s">Strengths</div>
            {renderItems(strengths)}
          </div>
          <div className="swot-quadrant">
            <div className="swot-label w">Weaknesses</div>
            {renderItems(weaknesses)}
          </div>
          <div className="swot-quadrant">
            <div className="swot-label o">Opportunities</div>
            {renderItems(opportunities)}
          </div>
          <div className="swot-quadrant">
            <div className="swot-label t">Threats</div>
            {renderItems(threats)}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ── Section: Competitors ─────────────────────────────────────── */
function CompetitorSection({ data }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="col-6">
      <Card>
        <CardHeader iconKey="bar" iconColor="cyan" title="Competitor Benchmarking" />
        <div className="competitor-list">
          {data.map((c, i) => (
            <div key={i} className="competitor-item">
              <div className="competitor-name">{c.competitor_name}</div>
              {c.advantage_over_target && (
                <div className="competitor-row">
                  <span className="competitor-row-label">Advantage</span>
                  <span className="competitor-row-value">{c.advantage_over_target}</span>
                </div>
              )}
              {c.technical_vulnerability && (
                <div className="competitor-row">
                  <span className="competitor-row-label">Vulnerability</span>
                  <span className="competitor-row-value">{c.technical_vulnerability}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── Section: Market Metrics ──────────────────────────────────── */
function MarketMetricsSection({ data }) {
  if (!data) return null;
  const { estimated_market_size, market_growth_rate, category_maturity } = data;
  const maturity = (category_maturity || '').toLowerCase();

  return (
    <div className="col-6">
      <Card>
        <CardHeader iconKey="bar" iconColor="blue" title="Market Metrics" />
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value">{estimated_market_size || '—'}</div>
            <div className="metric-label">Market Size</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{market_growth_rate || '—'}</div>
            <div className="metric-label">Growth Rate</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">
              {maturity ? (
                <span className={`maturity-badge ${maturity}`}>{maturity}</span>
              ) : '—'}
            </div>
            <div className="metric-label">Maturity</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ── Section: Strategic Roadmap ───────────────────────────────── */
function RoadmapSection({ data }) {
  if (!data) return null;
  const { vision_statement, execution_steps } = data;

  return (
    <div className="col-12">
      <Card>
        <CardHeader iconKey="map" iconColor="cyan" title="Strategic Roadmap" />
        {vision_statement && (
          <div className="vision-text">{vision_statement}</div>
        )}
        <div className="section-divider" />
        <div className="roadmap-list">
          {(execution_steps || []).map((step, i) => (
            <div key={i} className="roadmap-step">
              <div className="roadmap-num">{step.step_number ?? i + 1}</div>
              <div className="roadmap-content">
                <div className="roadmap-title">{step.title}</div>
                {step.technical_description && (
                  <div className="roadmap-desc">{step.technical_description}</div>
                )}
                {step.recommended_tech_stack && step.recommended_tech_stack.length > 0 && (
                  <div className="tag-list" style={{ marginBottom: 10 }}>
                    {step.recommended_tech_stack.map((t, j) => (
                      <span key={j} className="tag">{t}</span>
                    ))}
                  </div>
                )}
                {step.estimated_impact && (
                  <span className="roadmap-impact">
                    <Icon d={icons.zap} size={12} />
                    {step.estimated_impact}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── Section: Risk Flags ──────────────────────────────────────── */
function RiskSection({ data }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="col-6">
      <Card>
        <CardHeader iconKey="shield" iconColor="red" title="Risk Flags" />
        <div className="risk-list">
          {data.map((r, i) => (
            <div key={i} className={`risk-item ${severityClass(r.severity)}`}>
              <span className={`risk-badge ${severityClass(r.severity)}`}>{r.severity || 'info'}</span>
              <div>
                {r.risk_type && <div className="risk-type">{r.risk_type}</div>}
                <div className="risk-desc">{r.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── Section: Data Sources ────────────────────────────────────── */
function DataSourcesSection({ data }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="col-6">
      <Card>
        <CardHeader iconKey="link" iconColor="blue" title="Data Sources" />
        <div className="sources-list">
          {data.map((s, i) => (
            <a
              key={i}
              className="source-chip"
              href={s.url}
              target="_blank"
              rel="noreferrer"
              title={s.url}
            >
              <span className="source-type">{s.type || 'web'}</span>
              <span style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {safeHostname(s.url)}
              </span>
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── Main ReportView ──────────────────────────────────────────── */
export default function ReportView({ report, reportRef, onDownload }) {
  if (!report) return null;

  const {
    metadata,
    market_intelligence,
    sentiment_analysis,
    technical_swot,
    competitor_benchmarking,
    strategic_roadmap,
    market_metrics,
    risk_flags,
    data_sources,
  } = report;

  const companyName = metadata?.company_name || 'Company';

  return (
    <section className="report-section" ref={reportRef}>
      {/* ── Report header ── */}
      <div className="report-header">
        <div>
          <div className="report-company">
            Intelligence Report: <span>{companyName}</span>
          </div>
          <MetaStrip meta={metadata} />
        </div>

        <button className="download-btn" onClick={onDownload} aria-label="Download PDF">
          <Icon d={icons.download} size={16} />
          Download PDF
        </button>
      </div>

      {/* ── All cards ── */}
      <div className="report-grid">
        <MarketIntelligenceSection data={market_intelligence} />
        <SentimentSection data={sentiment_analysis} />
        <SwotSection data={technical_swot} />
        <CompetitorSection data={competitor_benchmarking} />
        <MarketMetricsSection data={market_metrics} />
        <RoadmapSection data={strategic_roadmap} />
        <RiskSection data={risk_flags} />
        <DataSourcesSection data={data_sources} />
      </div>
    </section>
  );
}
