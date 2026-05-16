# backend/tools/search_tools.py
import os
from crewai.tools import tool
from crewai_tools import SerperDevTool, FirecrawlScrapeWebsiteTool
from dotenv import load_dotenv

load_dotenv()

# 1. Initialize the private baseline tool with strict native filters
_base_firecrawl = FirecrawlScrapeWebsiteTool(
    api_key=os.getenv("FIRECRAWL_API_KEY"),
    # Layer 1 Defense: Tell Firecrawl to drop headers, sidebars, footers, and nav menus. 
    # This automatically reduces incoming raw tokens by up to 70%.
    page_options={"onlyMainContent": True}, 
    output_format="markdown"
)

# 2. Build a custom wrapper tool to enforce a definitive code-level token ceiling
@tool("Token-Safe Web Scraper")
def safe_scraper_tool(url: str) -> str:
    """Scrapes a single URL target and returns an aggressively optimized, 
    token-capped markdown version of its core content.
    """
    # Execute the raw scraper tool
    raw_markdown = _base_firecrawl._run(url=url)
    
    # Layer 2 Defense: Hard truncate the return text via string slicing.
    # 1 character roughly maps to 0.25 tokens. 
    # Slicing at 12,000 characters ensures the payload stays under ~3,000 tokens maximum.
    return str(raw_markdown)[:12000]
class MarketTools:
    # Tool for broad Google Searches
    search_tool = SerperDevTool()
    
    # Reference our token-safe wrapper tool instance
    scrape_tool = safe_scraper_tool
    # Tool for deep-scraping specific URLs into Markdown
    # scrape_tool = FirecrawlScrapeWebsiteTool(
    #     api_key=os.getenv("FIRECRAWL_API_KEY"),
    #     max_pages=5,
    #     output_format="markdown"
    # )

#For testing APIs
#if __name__ == "__main__":
#    print("Serper Key Loaded:", bool(os.getenv("SERPER_API_KEY")))
#    print("Firecrawl Key Loaded:", bool(os.getenv("FIRECRAWL_API_KEY")))