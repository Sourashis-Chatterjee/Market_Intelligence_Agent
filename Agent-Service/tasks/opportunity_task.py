# backend/tasks/opportunity_task.py
from crewai import Task

def create_opportunity_task(agent, context):
    return Task(
        description="""
        Using the Strategic Analysis (SWOT and Friction Points), design a high-impact Technical Roadmap for {company_name}.

        1. **Vision Statement**: Craft a bold technical vision for how they can use modern tech (AI, MERN stack, etc.) to solve their biggest friction point.
        2. **Execution Steps**: Provide a 3-step roadmap. Each step must include:
           - **Title**: Clear name for the initiative.
           - **Technical Description**: Deep dive into how to build it.
           - **Recommended Tech Stack**: Specific tools (e.g., MongoDB, Redis, Pinecone, FastAPI).
           - **Estimated Impact**: What business/technical metric will this improve?
        """,
        expected_output="""
        A technical implementation roadmap including:
        - A strategic vision statement.
        - Three detailed execution steps with specific tech stack recommendations and impact analysis.
        """,
        agent=agent,
        context=context # This will be [task_strategy]
    )