# backend/tasks/auditor_task.py
from crewai import Task

def create_auditor_task(agent, context):
    return Task(
        description="""
        Perform a rigorous Technical Audit on the proposed roadmap for {company_name}.

        1. **Fact-Check**: Does the suggested tech stack conflict with what the Researcher found? 
        2. **Risk Identification**: Identify 3 specific 'Risk Flags' (Regulatory, Competition, Technical, or Adoption). For each, provide a severity (Low/Medium/High) and a description.
        3. **Vagueness Check**: If the roadmap says 'Use AI', demand a specific model or implementation method.
        
        Ensure the final output is 100 percent accurate and free of hallucinations.
        """,
        expected_output="""
        A verification report containing:
        - A list of categorized Risk Flags with severity.
        - A 'Verified' or 'Needs Revision' status for each roadmap step.
        """,
        agent=agent,
        context=context # This will be [task_research, task_opportunity]
    )