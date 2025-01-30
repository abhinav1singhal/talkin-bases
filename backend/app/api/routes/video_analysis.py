from fastapi import APIRouter, UploadFile, File, Form
from app.services.gemini_service import analyze_video

router = APIRouter()

@router.post("/analyze")
async def analyze_video_route(video: UploadFile = File(...), question: str = Form(...)):
    video_content = await video.read()
    analysis_result = analyze_video(video_content, question)
    return {"result": analysis_result}

@router.get("/health")
async def health_check():
    return {"status": "OK app halth is okay"}
