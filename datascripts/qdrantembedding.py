import os
import json
import glob
from typing import List
from qdrant_client import QdrantClient
from llama_index.core import Document, VectorStoreIndex, Settings, StorageContext
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.core.node_parser import SimpleNodeParser
from llama_index.core.schema import BaseNode
from llama_index.embeddings.gemini import GeminiEmbedding
from llama_index.llms.gemini import Gemini
from dotenv import load_dotenv

load_dotenv()


# Initialize the Gemini Embedding model
embed_model = GeminiEmbedding(
    model_name="models/embedding-001",
    api_key=os.getenv("GOOGLE_API_KEY"),
    project=os.getenv("GOOGLE_PROJECT"),
    location="us-central1"
)

# Initialize Qdrant client
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),  # Replace with your Qdrant endpoint
    api_key=os.getenv("QDRANT_API_KEY")
)

# Set up LlamaIndex settings
Settings.embed_model = embed_model
Settings.llm = Gemini(api_key=os.getenv("GOOGLE_API_KEY"))

# Create storage contexts for each collection
storage_contexts = {
    "player_details": StorageContext.from_defaults(vector_store=QdrantVectorStore(client=qdrant_client, collection_name="player_details")),
    "game_feed": StorageContext.from_defaults(vector_store=QdrantVectorStore(client=qdrant_client, collection_name="game_feed")),
    "roster": StorageContext.from_defaults(vector_store=QdrantVectorStore(client=qdrant_client, collection_name="roster")),
    "schedule": StorageContext.from_defaults(vector_store=QdrantVectorStore(client=qdrant_client, collection_name="schedule")),
}

# File pattern to collection mapping
file_patterns = {
    "*_player_details.json": "player_details",
    "*_live_feed.json": "game_feed",
    "*_roster_2024.json": "roster",
    "*_schedule_2024.json": "schedule"
}

# Get the data folder path
current_dir = os.path.dirname(os.path.abspath(__file__))
data_folder = os.path.join(current_dir, "./data") 

# JSON Parsing Functions
def parse_player_details(json_data: dict) -> List[BaseNode]:
    """Parse player details JSON."""
    parser = SimpleNodeParser.from_defaults()
    nodes = []
    for player_id, player_info in json_data.items():
        for player in player_info.get("people", []):
            text = f"Player: {player['fullName']} (ID: {player_id})\n" \
                   f"Position: {player['primaryPosition']['name']} ({player['primaryPosition']['abbreviation']})\n" \
                   f"Height: {player['height']}, Weight: {player['weight']} lbs\n" \
                   f"Birth: {player['birthDate']} in {player['birthCity']}, {player['birthCountry']}\n" \
                   f"Debut: {player.get('mlbDebutDate', 'N/A')}\n" \
                   f"Bat: {player['batSide']['description']}, Throw: {player['pitchHand']['description']}"
            nodes.append(Document(text=text))
    return parser.get_nodes_from_documents(nodes)

def parse_game_feed(json_data: dict) -> List[BaseNode]:
    """Parse game feed JSON."""
    parser = SimpleNodeParser.from_defaults()
    nodes = []
    for play in json_data.get("liveData", {}).get("plays", {}).get("allPlays", []):
        inning = play['about']['inning']
        half_inning = "top" if play['about']['isTopInning'] else "bottom"
        description = play['result']['description']
        text = f"Inning: {inning}, Half: {half_inning}\nEvent: {description}"
        nodes.append(Document(text=text))
    return parser.get_nodes_from_documents(nodes)

def parse_roster(json_data: dict) -> List[BaseNode]:
    """Parse roster JSON."""
    parser = SimpleNodeParser.from_defaults()
    nodes = []
    for player in json_data.get("roster", []):
        text = f"Player: {player['person']['fullName']} (ID: {player['person']['id']})\n" \
               f"Position: {player['position']['name']} ({player['position']['abbreviation']})\n" \
               f"Status: {player['status']['description']}"
        nodes.append(Document(text=text))
    return parser.get_nodes_from_documents(nodes)

def parse_schedule(json_data: dict) -> List[BaseNode]:
    """Parse schedule JSON."""
    parser = SimpleNodeParser.from_defaults()
    nodes = []
    for date in json_data.get("dates", []):
        for game in date.get("games", []):
            # Safely get scores with a default of "N/A" if the score is missing
            away_score = game.get("teams", {}).get("away", {}).get("score", "N/A")
            home_score = game.get("teams", {}).get("home", {}).get("score", "N/A")
            text = f"Game Date: {game['gameDate']}\n" \
                   f"Teams: {game['teams']['away']['team']['name']} vs {game['teams']['home']['team']['name']}\n" \
                   f"Venue: {game['venue']['name']}\n" \
                   f"Score: {away_score} - {home_score}"
            nodes.append(Document(text=text))
    return parser.get_nodes_from_documents(nodes)

# Process JSON files and create indices
def process_and_index(file_path: str, file_type: str):
    with open(file_path, 'r') as f:
        json_data = json.load(f)

    if file_type == "player_details":
        nodes = parse_player_details(json_data)
    elif file_type == "game_feed":
        nodes = parse_game_feed(json_data)
    elif file_type == "roster":
        nodes = parse_roster(json_data)
    elif file_type == "schedule":
        nodes = parse_schedule(json_data)
    else:
        raise ValueError("Unsupported file type.")

    index = VectorStoreIndex(nodes, storage_context=storage_contexts[file_type])
    print(f"Indexed {len(nodes)} nodes for {file_type}.")
    return index

# Query function
def query_index(index, query: str):
    query_engine = index.as_query_engine(similarity_top_k=5)
    return query_engine.query(query)

if __name__ == "__main__":
   
    indices = {}
    for pattern, file_type in file_patterns.items():
        pattern_path = os.path.join(data_folder, pattern)
        matching_files = glob.glob(pattern_path)
        print(pattern_path)
        for file_path in matching_files:
            print(f"Processing file: {file_path}")
            indices[file_path] = process_and_index(file_path, file_type)
    print ("Indexing completed successfully")

    # testing queries
    '''
        queries = [
            "Who played third base for the Yankees?",
            "What happened in the 4th inning?",
            "When is the next game for the Yankees?",
        ]
        for query in queries:
            for file_path, index in indices.items():
                response = query_index(index, query)
                print(f"Query: {query} (from {file_path})\nResponse: {response}\n")
        '''        
