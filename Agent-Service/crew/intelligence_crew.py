# backend/crew/intelligence_crew.py
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
load_dotenv()

from crewai import Crew, Process, LLM
from agents.researcher_agent import create_researcher_agent
from agents.strategist_agent import create_strategist_agent
from agents.opportunity_agent import create_opportunity_agent
from agents.auditor_agent import create_auditor_agent
from agents.report_agent import create_report_agent

from tasks.researcher_task import create_research_task
from tasks.strategy_task import create_strategy_task
from tasks.opportunity_task import create_opportunity_task
from tasks.auditor_task import create_auditor_task
from tasks.report_task import create_report_task

class MarketIntelligenceCrew:
    def __init__(self, company_name):
        self.company_name = company_name

    def run(self):
        # 1. Initialize all Agents  
        investigator = create_researcher_agent()
        strategist = create_strategist_agent()  
        architect = create_opportunity_agent()
        auditor = create_auditor_agent()
        reporter = create_report_agent()

        # 2. Initialize all Tasks with Contextual Handoffs
        
        # Phase 1: Raw Research
        task_research = create_research_task(investigator)

        # Phase 2: Strategic Analysis (Uses Research as Context)
        task_strategy = create_strategy_task(strategist, [task_research])

        # Phase 3: Technical Roadmap (Uses Strategy as Context)
        task_opportunity = create_opportunity_task(architect, [task_strategy])

        # Phase 4: Quality Audit (Reviews the Roadmap against the Research)
        task_audit = create_auditor_task(auditor, [task_research, task_opportunity])

        # Phase 5: JSON Report Generation (Formats the final verified data)
        task_report = create_report_task(reporter, [task_strategy, task_opportunity, task_audit])

        managerllm = LLM(model="llama-3.1-70b-versatile", api_key=os.getenv("GROQ_API_KEY"))

        # 3. Define the Crew
        intelligence_crew = Crew(
            agents=[investigator, strategist, architect, auditor, reporter],
            tasks=[task_research, task_strategy, task_opportunity, task_audit, task_report],
            process=Process.sequential, # Tasks run one after the other
            manager_llm=managerllm,
            function_calling_llm=managerllm,
            verbose=True,
            memory=False# Enables agents to remember previous turns
        )

        # 4. Kickoff the process
        return intelligence_crew.kickoff(inputs={'company_name': self.company_name})