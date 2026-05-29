# backend/api/routes.py
from fastapi import APIRouter, HTTPException
from schemas import AnalysisRequest # Import the schema we just made


router = APIRouter()

@router.post("/analyze")
async def analyze_company(request: AnalysisRequest):
    try:
        from crew.intelligence_crew import MarketIntelligenceCrew # Import your crew logic
        # 1. Initialize crew with the company name from the request
        crew_instance = MarketIntelligenceCrew(request.company_name)
        
        # 2. Run the crew
        result = await crew_instance.run()
        
        # 3. Return the result to MERN frontend
        return {"status": "success", "data": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
