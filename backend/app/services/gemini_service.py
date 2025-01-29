import google.generativeai as genai
from app.core.config import GOOGLE_API_KEY
import app.services.rag_service as rag_service
import logging

genai.configure(api_key=GOOGLE_API_KEY)

def analyze_video(video_content, question):
    model = genai.GenerativeModel('gemini-1.5-flash')

    response=rag_service.rag_chat(video_content, question)
    logging.info(f"Rag respopnse:  {response}")

    '''
    prompt = f"""
    Watch the video carefully and answer the following question:
    {question}
    Only base your answer on the information available in the video.
    Be concise and to the point.
    """
    print(prompt)
    response = model.generate_content([
        prompt,
        {"mime_type": "video/mp4", "data": video_content}
    ])
    '''
    
    return response

