from crewai import Task
from datetime import datetime, timezone

def create_report_task(agent, context):
    now_iso = datetime.now(timezone.utc).isoformat()

    return Task(
        description=f"""
You are the final JSON compiler. Consolidate ALL findings from the researcher,
strategist, opportunity, and auditor agents into one complete JSON object.

Current UTC timestamp: {now_iso}

STRICT RULES:
- Output PURE JSON only. No markdown fences. No explanation text before or after.
- Every field must contain real data pulled from the previous agents.
- Empty objects {{}} and empty strings "" are FORBIDDEN.
- Do not invent data — map what the agents produced.

You must produce a JSON object with EXACTLY these keys and sub-keys:

{{
  "metadata": {{
    "company_name": "<company that was analysed>",
    "analysis_timestamp": "{now_iso}",
    "agent_processing_time_sec": <number, use 60.0 if unknown>,
    "total_tokens_used": <integer, use 4000 if unknown>,
    "confidence_score": <float 0.0-1.0 based on auditor verdict>
  }},

  "market_intelligence": {{
    "core_value_prop": "<one sentence from researcher>",
    "target_persona": "<target customer description from researcher>",
    "estimated_tech_stack": ["<tech>", "<tech>", "..."],
    "recent_trigger_events": [
      {{
        "event": "<event title>",
        "date": "<date>",
        "source_url": "<url>",
        "impact_significance": "high|medium|low"
      }}
    ]
  }},

  "sentiment_analysis": {{
    "aggregate_score": <float -1.0 to 1.0>,
    "market_perception_summary": "<paragraph summary of public sentiment>",
    "praise_points": ["<praise1>", "<praise2>", "<praise3>"],
    "friction_points": [
      {{
        "issue": "<issue title>",
        "frequency_signal": "high|med",
        "evidence_quote": "<verbatim quote from research>",
        "source": "<url>"
      }}
    ]
  }},

  "technical_swot": {{
    "strengths": [{{"point": "<strength>", "evidence": "<supporting evidence>"}}],
    "weaknesses": [{{"point": "<weakness>", "potential_fix_id": null}}],
    "opportunities": [{{"point": "<opportunity>", "market_gap": "<gap description>"}}],
    "threats": [{{"point": "<threat>", "competitor_edge": "<competitor advantage>"}}]
  }},

  "competitor_benchmarking": [
    {{
      "competitor_name": "<name>",
      "advantage_over_target": "<their edge>",
      "technical_vulnerability": "<their weakness>"
    }}
  ],

  "strategic_roadmap": {{
    "vision_statement": "<bold one-sentence vision from opportunity agent>",
    "execution_steps": [
      {{
        "step_number": 1,
        "title": "<initiative name>",
        "technical_description": "<how to build it>",
        "recommended_tech_stack": ["<tech1>", "<tech2>"],
        "estimated_impact": "<business metric improvement>"
      }}
    ]
  }},

  "market_metrics": {{
    "estimated_market_size": "<e.g. $500B>",
    "market_growth_rate": "<e.g. 18% CAGR>",
    "category_maturity": "emerging|growing|saturated"
  }},

  "risk_flags": [
    {{
      "risk_type": "regulatory|competition|technical|adoption",
      "description": "<detailed risk description>",
      "severity": "low|medium|high"
    }}
  ],

  "data_sources": [
    {{
      "type": "news|reddit|producthunt|company_website|documentation|blog",
      "url": "<url>"
    }}
  ]
}}
""",
        expected_output="Pure JSON object with all fields populated. No markdown, no explanation text.",
        agent=agent,
        context=context
        # NOTE: output_json removed intentionally — it causes CrewAI to validate
        # against the loose dict fields and silently accept empty {} objects.
        # We parse result.raw directly in the route instead.
    )
