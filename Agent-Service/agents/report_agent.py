import os
from crewai import Agent,LLM
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

gemini_llm = LLM(
    model="gemini/gemini-2.5-flash",
    api_key=os.getenv("GEMINI_API_KEY"),    
    temperature=0.1
)

def create_report_agent():
    # (Fast, cheap formatting)
    # llm = ChatGoogleGenerativeAI(
    #     model="gemini-2.5-flash",
    #     temperature=0.1, # Extremely low so it strictly follows JSON format
    #     google_api_key=os.getenv("GEMINI_API_KEY")
    # )

    return Agent(
        role='Executive JSON Formatter',
        goal='Take verified insights and format them into a strict JSON schema.',
        backstory="""You are a strict data formatter. You do not add new information. 
        You only map the provided context exactly into the required JSON fields.""",
        llm=gemini_llm, # <-- Gemini Flash attached
        verbose=True,
        allow_delegation=False,
        memory=False
    )