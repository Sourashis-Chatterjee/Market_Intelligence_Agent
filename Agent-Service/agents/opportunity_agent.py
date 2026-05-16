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

def create_opportunity_agent():
    # Initialize Groq Llama 3.1 70B
    # llm = ChatGroq(
    #     temperature=0.5, 
    #     model_name="llama-3.1-70b-versatile",
    #     groq_api_key=os.getenv("GROQ_API_KEY")
    # )

    return Agent(
        role='Solution Architect & Innovation Consultant',
        goal='Translate technical weaknesses into a high-impact technical roadmap.',
        backstory="""You are a visionary CTO specializing in the MERN stack, ML and Agentic AI. 
        You design scalable architectures to solve friction points found by the Strategist.""",
        llm=groqllm, # <-- Groq model attached
        max_rpm=10,
        verbose=True,
        allow_delegation=False,
        memory=False
    )