import { useState } from 'react';

const AGENTS = [
  {
    id: 'researcher',
    name: 'Researcher',
    role: 'Intelligence Gatherer',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.55)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    description: 'Scours the web, news feeds, Reddit, and product forums to harvest raw intelligence about the target company.',
  },
  {
    id: 'strategist',
    name: 'Strategist',
    role: 'Roadmap Architect',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.55)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" />
        <path d="M9 3v15M15 6v15" />
      </svg>
    ),
    description: 'Transforms raw investigator signals into a high-yield competitive blueprint, identifying market gaps and strategic entry points.',
  },
  {
    id: 'opportunity',
    name: 'Opportunity',
    role: 'Gap Detector',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.55)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    description: 'Bridges the gap between raw research and execution by identifying tactical moats and prioritizing high-probability market plays.',
  },
  
  {
    id: 'auditor',
    name: 'Auditor',
    role: 'Technical Analyst',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.55)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    description: 'Audits tech stack, architecture signals, and engineering quality. Surfaces hidden vulnerabilities and strengths.',
  },
  {
    id: 'report',
    name: 'Report',
    role: 'Output Compiler',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.55)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    description: 'Compiles every agent\'s output into a structured, machine-readable JSON report ready for the dashboard.',
  },
];

export default function AgentRoster() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="roster-section">
      <div className="roster-label">
        <span className="roster-label-line" />
        <span className="roster-label-text">Powered by 5 Specialized Agents</span>
        <span className="roster-label-line" />
      </div>

      <div className="roster-grid">
        {AGENTS.map((agent, idx) => (
          <div
            key={agent.id}
            className={`roster-card ${hovered === agent.id ? 'roster-card-active' : ''}`}
            style={{
              '--agent-color': agent.color,
              '--agent-glow': agent.glow,
              animationDelay: `${idx * 80}ms`,
            }}
            onMouseEnter={() => setHovered(agent.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Glow orb — only visible on hover via CSS */}
            <div className="roster-card-glow" />

            {/* Top row: index + icon */}
            <div className="roster-card-top">
              <span className="roster-card-index">0{idx + 1}</span>
              <div className="roster-card-icon">{agent.icon}</div>
            </div>

            {/* Name + role */}
            <div className="roster-card-name">{agent.name}</div>
            <div className="roster-card-role">{agent.role}</div>

            {/* Description — slides in on hover */}
            <div className="roster-card-desc">{agent.description}</div>

            {/* Bottom accent line */}
            <div className="roster-card-bar" />
          </div>
        ))}
      </div>
    </div>
  );
}
