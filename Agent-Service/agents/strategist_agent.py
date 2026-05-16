import os
from crewai import Agent, LLM
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

groqllm = LLM(
    model="groq/llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.5
)

def create_strategist_agent():
    # Initializing Groq Llama 3.1 70B (High reasoning, extremely fast)
    # llm = ChatGroq(
    #     temperature=0.4, 
    #     model_name="llama-3.1-70b-versatile",
    #     groq_api_key=os.getenv("GROQ_API_KEY")
    # )

    return Agent(
        role='Market Strategy Analyst',
        goal='Synthesize raw research into a technical SWOT analysis and market sentiment report.',
        backstory="""You are a former Tier-1 management consultant. You excel at seeing 
        patterns in messy data, identifying weaknesses, and estimating market maturity.""",
        llm=groqllm, # <-- Groq model attached
        max_rpm=15,
        verbose=True,
        allow_delegation=False,
        memory=False
    )