const TRENDING = [
  { name: 'NVIDIA',     sector: 'Semiconductors',  change: '+4.2%',  hot: true  },
  { name: 'Tesla',      sector: 'EV / Energy',      change: '+2.3%',  hot: true  },
  { name: 'OpenAI',     sector: 'AI Research',      change: '+6.1%',  hot: true  },
  { name: 'Apple',      sector: 'Consumer Tech',    change: '+1.3%',  hot: false },
  { name: 'Microsoft',  sector: 'Cloud / AI',       change: '+2.1%',  hot: false },
  { name: 'Anthropic',  sector: 'AI Safety',        change: '+5.4%',  hot: true  },
  { name: 'SpaceX',     sector: 'Aerospace',        change: '+3.7%',  hot: false },
  { name: 'Stripe',     sector: 'Fintech',          change: '+1.9%',  hot: false },
  { name: 'Palantir',   sector: 'Data / Defence',   change: '+3.3%',  hot: true  },
  { name: 'Mistral AI', sector: 'AI Models',        change: '+7.0%',  hot: true  },
  { name: 'Figma',      sector: 'Design Tools',     change: '+0.8%',  hot: false },
  { name: 'Notion',     sector: 'Productivity',     change: '+1.1%',  hot: false },
];

export default function TrendingCompanies({ onSelect, disabled }) {
  return (
    <div className="trending-section">
      <div className="trending-header">
        <span className="trending-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }}>
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          Trending Now
        </span>
      </div>
      

      <div className="trending-scroll">
        {TRENDING.map((c) => (
          <button
            key={c.name}
            className={`trending-chip ${c.hot ? 'trending-chip-hot' : ''}`}
            onClick={() => onSelect(c.name)}
            disabled={disabled}
            aria-label={`Analyze ${c.name}`}
          >
            {c.hot && <span className="trending-fire">🔥</span>}
            <span className="trending-chip-name">{c.name}</span>
            <span className="trending-chip-sector">{c.sector}</span>
            <span className="trending-chip-change">{c.change}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
