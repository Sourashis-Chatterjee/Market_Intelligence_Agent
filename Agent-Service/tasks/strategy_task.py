# backend/tasks/strategy_task.py
from crewai import Task

def create_strategy_task(agent, context):
    return Task(
        description="""
        Review the Research Report for {company_name} and perform a deep-dive strategic analysis.

        1. **Market Sentiment Analysis**: 
           - Assign an aggregate sentiment score from -1.0 (very negative) to 1.0 (very positive).
           - Extract at least 3 specific 'Friction Points' from the research (Reddit, reviews, etc.).
           - For each friction point, provide a 'frequency_signal' (High/Med) and the 'evidence_quote' from the research.

        2. **Technical SWOT**:
           - **Strengths**: Identify technical moats (e.g., proprietary algorithms, unique data access).
           - **Weaknesses**: Identify gaps in their current tech stack (e.g., legacy systems, high latency).
           - **Opportunities**: Find market gaps where their competitors are failing.
           - **Threats**: Identify specific technical edges competitors have.

        3. **Market Metrics**:
           - Based on the growth signals found, determine the 'category_maturity' (emerging | growing | saturated).
           - Estimate the 'market_growth_rate' based on industry trends found in research.

        4. **Competitor Benchmarking**:
           - Identify the top 2 competitors and pinpoint one 'technical vulnerability' for each.
        """,
        expected_output="""
        A structured Strategic Analysis Report including:
        - Sentiment Score and evidence-backed Friction Points.
        - 4-quadrant Technical SWOT analysis.
        - Market maturity and growth estimates.
        - Competitor benchmarking table.
        """,
        agent=agent,
        context=context # This will be [task_research]
    )