from pydantic import BaseModel, Field
from typing import List, Literal, Optional

# Request schema
class AnalysisRequest(BaseModel):
    company_name: str

#Detailed report schema
class TriggerEvent(BaseModel):
    event: str
    date: str
    source_url: str
    impact_significance: Literal["high", "medium", "low"]

class FrictionPoint(BaseModel):
    issue: str
    frequency_signal: Literal["high", "med"]
    evidence_quote: str
    source: str

class SWOTItem(BaseModel):
    point: str
    evidence: Optional[str] = None
    potential_fix_id: Optional[str] = None
    market_gap: Optional[str] = None
    competitor_edge: Optional[str] = None

class Competitor(BaseModel):
    competitor_name: str
    advantage_over_target: str
    technical_vulnerability: str

class RoadmapStep(BaseModel):
    step_number: int
    title: str
    technical_description: str
    recommended_tech_stack: List[str]
    estimated_impact: str

class RiskFlag(BaseModel):
    risk_type: Literal["regulatory", "competition", "technical", "adoption"]
    description: str
    severity: Literal["low", "medium", "high"]

class DataSource(BaseModel):
    type: Literal["news", "reddit", "producthunt", "company_website", "documentation", "blog"]
    url: str

class FinalMarketReport(BaseModel):
    metadata: dict = Field(description="Company name, timestamp, processing time, tokens, confidence")
    market_intelligence: dict = Field(description="Value prop, persona, tech stack, and trigger events")
    sentiment_analysis: dict = Field(description="Aggregate score, summary, praise and friction points")
    technical_swot: dict = Field(description="Strengths, Weaknesses, Opportunities, and Threats")
    competitor_benchmarking: List[Competitor]
    strategic_roadmap: dict = Field(description="Vision statement and execution steps")
    market_metrics: dict = Field(description="Size, growth rate, and category maturity")
    risk_flags: List[RiskFlag]
    data_sources: List[DataSource]
