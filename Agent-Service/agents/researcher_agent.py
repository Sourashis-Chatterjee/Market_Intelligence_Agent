
import os
from crewai import Agent, LLM
from tools.search_tools import MarketTools
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

#we cant define an llm directly on the agent function scope, rather we have to use the LLM class of 
# crewai to define the llm for each agent and then pass it as a parameter to the agent function. 
# This is because the agent function expects an instance of the LLM class, which encapsulates the configuration for the language model, including the model name, API key, temperature, and other parameters.
#  By defining the llm separately using the LLM class, we can ensure that it is properly configured and can be reused across different agents if needed.
groqllm = LLM(
    model="groq/llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.5
)

def create_researcher_agent():

   # print(f"DEBUG: Key found? {os.getenv('GEMINI_API_KEY')[:5]}...") # Prints first 5 chars
    # 1. Initialize the Gemini LLM
    # Use "gemini-1.5-flash" for the researcher (fast & free)
    # llm = ChatGoogleGenerativeAI(
    #     model="gemini-2.5-flash",
    #     verbose=True,
    #     temperature=0.5,
    #     google_api_key=os.getenv("GEMINI_API_KEY")
    # )
    # llm = ChatGroq(
    #     temperature=0.5, 
    #     model_name="llama-3.1-70b-versatile",
    #     groq_api_key=os.getenv("GROQ_API_KEY")
    # )
    return Agent(
        role='Technical Market Investigator',
        goal='Uncover deep technical stacks, recent engineering shifts, and market friction for {company_name}',
        backstory="""You are a veteran technical journalist. You don't trust marketing pages. 
        You look for job descriptions to find real tech stacks, Reddit for user complaints, 
        and engineering blogs for architectural pivots. Your data is the foundation 
        for the entire strategic analysis.""",
        tools=[MarketTools.search_tool, MarketTools.scrape_tool],
        llm=groqllm,
        max_rpm = 3,
        max_iterations=2,
        verbose=True,
        allow_delegation=False,
        memory=False #initially set to False, can be enabled if want the researcher to remember previous searches
        #also memory =true cause more api calls and need embedders. so will use it afterwards
    )   