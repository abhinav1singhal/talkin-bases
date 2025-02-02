<p align="center">
  <img src="images/logo.png" alt="Talkin' Bases Logo" width="200"/>
</p>

---

# Talkin' Bases: Gemini Flash 1.5 Based Fan Interation AI System

## Overview
Talkin' Bases is an AI-powered baseball analysis system that captures user questions, processes them through a Retrieval-Augmented Generation (RAG) backend, and provides insightful responses using **Google Gemini Flash 1.5**. The system integrates:

- **Scope of project** : For the purpose for MVP , the scope of data used is for **2024 new york yankee season**. Its player data and live feed from **regular season games in 2024** played in yankee stadium. This scope can be enhanced to larger sets by saving data as Vector embeddings. This can be saved in Vertex AI index , or any embedding vector dbs like PineCone, Qdrant, MongoDB. In this project , I used Qdrant. (https://qdrant.tech/)

- **Frontend (React.js)**: Captures video and audio input from users.
- **Backend (FastAPI & LlamaIndex)**: Processes requests and retrieves contextual information from **Qdrant vector database**.
- **Qdrant Data Ingestion Service**: Manages structured JSON baseball-related data, embedding it into Qdrant for efficient retrieval.
- **Google Cloud Run Deployment**: Scales the services on demand.

## Features
- Real-time video and audio capture.
- Speech-to-text conversion for user queries.
- Retrieval-Augmented Generation (RAG) for intelligent baseball insights.
- High-performance vector database (Qdrant) for contextual retrieval.
- Integration with **Google Gemini Flash 1.5** for AI-powered responses.
- Cloud-native deployment on **Google Cloud Run**.

---
## Steps to test
- Step 1: Navigate to link https://talkin-bases-fe-454636469344.us-central1.run.app , this is your front end application hosted on google cloud.
- Step 2: Turn on camera 
- Step 3 , switch to front "facing camera" or "back camera" based on what device you are using.
- Step 4: click on "start recording" the video and then "stop recording" to capture video
- Step 5: click on finalize recording, to finalize your video version
- Step 6: Now its time to ask questions around recorded video . Click on "start voice input", You can ask questions on what's happening in video etc.
- Step 7: Then click "stop voice input"
- Step 8: Click on "Analyze video" button. This will send questions to Gemini flash 1.5.
- Step 9: wait for few seconds for response it takes around 10 t0 20 sec to respond. You will see response at the bottom of screen.

## System Architecture
![Workflow Diagram](images/Talkinbases-diagram.png)


### **1. Frontend** (React.js - `talkin-bases-fe`)
- **Captures user video/audio** and converts speech to text.
- **Sends video & text input** to backend for processing.
- **Displays AI-generated responses** from backend.
- Deployed as **talkin-bases-fe** on Google Cloud Run.

### **2. Backend** (FastAPI - `talkin-bases`)
- **Handles API requests** from the frontend.
- **Retrieves context** from Qdrant database.
- **Uses Google Gemini Flash 1.5** to generate AI responses.
- Deployed as **talkin-bases** on Google Cloud Run.

### **3. Qdrant Data Service** (Python - `qdrant_embedding_project`)
- **Processes structured JSON baseball data** (player details, live feeds, rosters, schedules).
- **Generates embeddings** using **Gemini Embeddings**.
- **Stores embeddings** in Qdrant for similarity search.

---

## Deployment
### **1. Frontend (React.js)**
```bash
docker build -t gcr.io/your-project-id/talkin-bases-fe .
docker push gcr.io/your-project-id/talkin-bases-fe

gcloud run deploy talkin-bases-fe   --image gcr.io/your-project-id/talkin-bases-fe   --platform managed   --allow-unauthenticated   --region your-region
```

### **2. Backend (FastAPI)**
```bash
docker build -t gcr.io/your-project-id/talkin-bases .
docker push gcr.io/your-project-id/talkin-bases

gcloud run deploy talkin-bases   --image gcr.io/your-project-id/talkin-bases   --platform managed   --allow-unauthenticated   --region your-region
```

### **3. Qdrant Data Service**
```bash
docker build -t gcr.io/your-project-id/qdrant-embedding .
docker push gcr.io/your-project-id/qdrant-embedding

gcloud run deploy qdrant-embedding   --image gcr.io/your-project-id/qdrant-embedding   --platform managed   --allow-unauthenticated   --region your-region
```

---

## UML Sequence Diagram
```mermaid
sequenceDiagram
    participant User
    participant Frontend as Talkin' Bases Frontend (React)
    participant Backend as Talkin' Bases Backend (FastAPI)
    participant Qdrant as Qdrant Vector DB
    participant Gemini as Google Gemini AI

    User->>Frontend: Record video + question (handleAnalyze)
    Frontend->>Backend: Upload video + text (analyzeVideo)
    Backend->>Qdrant: Retrieve relevant vector embeddings
    Qdrant-->>Backend: Return retrieved embeddings
    Backend->>Gemini: Generate AI response (generate_response)
    Gemini-->>Backend: Return AI-generated response
    Backend-->>Frontend: Send response back
    Frontend-->>User: Display insights
```

---

## API Endpoints
### **Frontend → Backend**
- `POST /api/video_analysis`: Sends user question & video data for processing.

### **Backend → Qdrant**
- Fetches context vectors from stored baseball data.

### **Backend → Google Gemini Flash 1.5**
- Queries AI model for generating responses.

---

## Conclusion
This project provides a cloud-scalable **AI-powered baseball analysis** platform, integrating **video/audio capture, vector search, and generative AI** into a seamless user experience.
