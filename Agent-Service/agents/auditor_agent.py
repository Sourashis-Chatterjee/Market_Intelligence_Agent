import os
from crewai import Agent, LLM
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

gemini_llm = LLM(
    model="gemini/gemini-2.5-flash",
    api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.2 # Lower temperature = more strict/factual
)
def create_auditor_agent():
    #  (Highest logic/context for fact-checking)
    # llm = ChatGoogleGenerativeAI(
    #     model="gemini-2.5-pro",
    #     temperature=0.2, # Lower temperature = more strict/factual
    #     google_api_key=os.getenv("GEMINI_API_KEY")
    # )

    return Agent(
        role='Technical Quality Auditor',
        goal='Critically evaluate the research and roadmap for accuracy and logic.',
        backstory="""You are a cynical, highly experienced Technical Due Diligence expert. 
        You catch hallucinations, vague advice, and logical contradictions.""",
        llm=gemini_llm, # <-- Gemini Pro attached
        max_rpm = 2, # Limit to 2 requests per minute to ensure careful, deliberate analysis
        verbose=True,
        allow_delegation=False,
        memory=False
    )