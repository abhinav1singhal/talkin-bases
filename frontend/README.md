# Frontend Application

Welcome to the **Frontend Application** repository! This project is built using React and provides a robust platform for video capture, analysis, and speech recognition with a modern and responsive design.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Scripts](#scripts)
7. [Deployment](#deployment)
8. [Contributing](#contributing)
9. [License](#license)
10. [Contact](#contact)

---

## Project Overview

This project leverages **React** to create an intuitive and responsive web application. It integrates functionalities such as video capture, real-time speech recognition, and backend API communication for data processing. The application is designed for seamless deployment with **Docker**.

---

## Features
- Webcam video capture powered by **react-webcam**.
- Real-time speech-to-text functionality using **react-speech-recognition**.
- A clean and responsive user interface built with **Material-UI**.
- Backend API communication using **Axios**.
- Progressive Web App (PWA) capabilities.

---

## Technologies Used

### Core Dependencies
- **React**: Core framework for building the user interface.
- **Material-UI (`@mui/material`)**: Modern and responsive UI components.
- **Emotion (`@emotion/react` and `@emotion/styled`)**: For CSS-in-JS styling.
- **Axios**: Handles HTTP requests to backend APIs.
- **react-webcam**: For webcam integration and video stream capture.
- **react-speech-recognition**: Real-time speech recognition functionality.

### Development Tools
- **React Scripts**: Simplifies the development workflow.
- **Docker**: For containerization and scalable deployment.

---

## Project Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── AnalysisResult.js
│   │   └── VideoCapture.js
│   ├── pages/
│   │   └── MainPage.js
│   ├── services/
│   │   └── api.js
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   └── setupTests.js
├── package.json
├── package-lock.json
├── .gitignore
├── Dockerfile
└── README.md
```

### Key Directories
- **`public/`**: Contains static assets and the root HTML file.
- **`src/`**: Holds the core application logic and components.
  - **`components/`**: Modular React components for specific functionalities.
  - **`pages/`**: High-level page components for layout and routing.
  - **`services/`**: API service layer to interact with the backend.
- **`Dockerfile`**: Configuration for creating a Docker container.

---
## UML Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Talkin' Bases Frontend (React)
    participant Backend as Talkin' Bases Backend (Cloud Run)
    participant Gemini as Gemini AI
    participant Qdrant as Qdrant Vector DB

    User->>Frontend: Start recording (handleStartCaptureClick)
    User->>Frontend: Stop recording (handleStopCaptureClick)
    User->>Frontend: Retake video (handleFinalizeVideo)
    User->>Frontend: Start speaking (handleStartListening)
    User->>Frontend: Stop speaking (handleStopListening)
    User->>Frontend: Enter question (setQuestion)
    User->>Frontend: Send video + question (handleAnalyze)
    Frontend->>Backend: Upload video + question (analyzeVideo)
    Backend->>Gemini: Process video + question
    Gemini->>Qdrant: Retrieve relevant data
    Qdrant-->>Gemini: Return vector search results
    Gemini-->>Backend: Generate response
    Backend-->>Frontend: Send response
    Frontend-->>User: Display result


## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- Docker (optional, for containerized deployment)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000/`.

---

## Scripts

### Available Commands
- **`npm start`**: Runs the app in development mode with hot reloading.
- **`npm run build`**: Builds the app for production and outputs files to the `build` folder.
- **`npm test`**: Launches the test runner in interactive watch mode.
- **`npm run eject`**: Ejects the app from Create React App (irreversible action).

---

## Deployment

### Docker Deployment
1. Build the Docker image:
   ```bash
   docker build -t frontend-app .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 frontend-app
   ```

The application will be accessible at `http://localhost:3000/`.

---

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add a descriptive commit message"
   ```
4. Push the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Contact

For questions or feedback, feel free to contact the repository maintainers or open an issue.
