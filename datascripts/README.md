# Qdrant Embedding Project

This project provides a pipeline for indexing and querying structured JSON data using **Qdrant** as a vector store, **LlamaIndex**, and **Gemini Embedding** for enhanced semantic search capabilities. The system processes various types of baseball-related data, such as player details, game feeds, rosters, and schedules, and makes them queryable.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Usage](#usage)
7. [Deployment](#deployment)
8. [Contributing](#contributing)
9. [License](#license)
10. [Contact](#contact)

---

## Project Overview
This project extracts structured baseball-related data from JSON files, processes it into a vectorized format using **Gemini Embeddings**, and stores it in **Qdrant** for efficient similarity-based retrieval. The data is then indexed using **LlamaIndex**, allowing for advanced queries on player details, game events, team rosters, and schedules.

---

## Features
- Processes various baseball-related JSON files for structured indexing.
- Utilizes **Gemini Embeddings** for vectorizing text data.
- Stores vectorized data in **Qdrant**, a high-performance vector database.
- Implements **LlamaIndex** for efficient retrieval and querying.
- Supports semantic search queries across indexed datasets.
- Docker-compatible for easy deployment.

---

## Technologies Used

### Core Libraries:
- **Qdrant (`qdrant_client`)**: A scalable vector database for storing embeddings.
- **LlamaIndex (`llama_index`)**: Indexing and retrieval framework.
- **Gemini Embeddings (`llama_index.embeddings.gemini`)**: Google's text embedding model.
- **Environment Variables (`dotenv`)**: Secure API key and configuration management.

### Development Tools:
- **Python (3.x)**: Primary language.
- **JSON (`json`)**: Data format for structured input.
- **OS & Glob (`os`, `glob`)**: File handling and automation.

---

## Project Structure

```
qdrant_embedding_project/
├── qdrantembedding.py
├── data/
│   ├── *_player_details.json
│   ├── *_live_feed.json
│   ├── *_roster_2024.json
│   ├── *_schedule_2024.json
├── .env
├── requirements.txt
├── README.md
```

### Key Components
- **`qdrantembedding.py`**: Main script handling data parsing, embedding, indexing, and querying.
- **`data/`**: Folder containing structured JSON data.
- **`.env`**: Stores API keys and database connection settings.
- **`requirements.txt`**: Lists dependencies for easy setup.
- **`README.md`**: Documentation for the project.

---

## Getting Started

### Prerequisites
- Python 3.x
- Virtual environment (optional but recommended)
- Qdrant server instance
- Google Gemini API key

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd qdrant_embedding_project
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up the `.env` file with required API keys and Qdrant connection details:
   ```env
   GOOGLE_API_KEY=your_google_api_key
   QDRANT_URL=your_qdrant_url
   QDRANT_API_KEY=your_qdrant_api_key
   GOOGLE_PROJECT=your_google_project
   ```

---

## Usage

### Indexing Data
To process and index all JSON files in the `data/` directory:
```bash
python qdrantembedding.py
```

### Querying Data
Modify `query_index()` in `qdrantembedding.py` to test queries:
```python
query = "Who played third base for the Yankees?"
response = query_index(index, query)
print(response)
```

---

## Deployment

### Docker Deployment
To containerize the application for production:
1. Create a `Dockerfile` (if not already present):
   ```Dockerfile
   FROM python:3.9
   WORKDIR /app
   COPY . .
   RUN pip install -r requirements.txt
   CMD ["python", "qdrantembedding.py"]
   ```
2. Build the Docker image:
   ```bash
   docker build -t qdrant-embedding-app .
   ```
3. Run the container:
   ```bash
   docker run --env-file .env -v $(pwd)/data:/app/data qdrant-embedding-app
   ```

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
For questions or feedback, please reach out to the repository maintainers or open an issue.

