from crewai import Task

def create_research_task(agent):
   return Task(
    description="""
You are investigating {company_name}.

Steps:

1. Identify the official website and engineering blog.

2. Determine the primary technology stack by analyzing:
   - engineering blog posts
   - GitHub repositories
   - developer job postings
   -dont just assume MERN stack just because there is a website, look for tech stack.

3. Identify 3 recent trigger events such as:
   - funding announcements
   - product launches
   - leadership changes

4. Analyze user sentiment by searching:
   - Reddit discussions
   - G2 or review platforms

5. Identify:
   - core value proposition
   - target persona

6. Extract early signals for:
   - market size
   - market growth
   - industry momentum

Rules:
- Use at least 3 different sources.
- DO NOT do more than 3 web searches total.
- Every insight must include a source URL.
- If information cannot be verified, return "unknown".
""",
    expected_output="""
Structured research report including:

- company overview
- inferred tech stack
- recent trigger events
- sentiment signals
- target persona
- early market signals
- source URLs for all claims
""",
    agent=agent
)