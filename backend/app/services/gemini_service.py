import google.generativeai as genai
from app.core.config import GOOGLE_API_KEY

genai.configure(api_key=GOOGLE_API_KEY)

def analyze_video(video_content):
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(video_content)
    return response.text
import google.generativeai as genai
from app.core.config import GOOGLE_API_KEY

genai.configure(api_key=GOOGLE_API_KEY)

def analyze_video(video_content, question):
    model = genai.GenerativeModel('gemini-1.5-flash')
    
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
    
    return response.text

