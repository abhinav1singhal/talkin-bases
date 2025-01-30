# Import necessary modules
import os
from qdrant_client import QdrantClient
from qdrant_client.http.models import Filter, SearchRequest
import google.generativeai as genai
from llama_index.core import Document, VectorStoreIndex, Settings, StorageContext, SimpleDirectoryReader
from llama_index.embeddings.gemini import GeminiEmbedding
from llama_index.llms.gemini import Gemini
from google.api_core import exceptions as google_exceptions
import logging
import json

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
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


# Set up Google Gemini 1.5 Flash API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
os.environ['GOOGLE_API_VERBOSE'] = '1'

# Define a function to search Qdrant collections
def search_qdrant(collection_name, query_vector, top_k=5):
    response = qdrant_client.search(
        collection_name=collection_name,
        query_vector=query_vector,
        limit=top_k
    )
    return [hit.payload for hit in response]

# Define a function to generate responses using Gemini
def generate_response(video_content,user_question, context):
     if not any(context.values()):
        full_prompt = f"""
        {user_question} No specific context was found in the database. Please use your general knowledge to provide an accurate response. Be as factual and up-to-date as possible, and clearly state if any information might be uncertain or speculative.
        """
     else:
        logging.info(f"Context Info:{context}")

        # Read video file
        #with open(video_content, 'rb') as f:
        #    video_content = f.read()


        #full_prompt = f"{user_query}\n\nContext:\n{json.dumps(context, indent=2)}"
        full_prompt=f"""
                    Watch the video carefully and consider the following context:
                    {context}

                    Now, answer this question:
                    {user_question}

                    Base your answer on both the information in the video and the provided context.
                    Be concise and to the point.
                    """
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content([full_prompt,
                                            {"mime_type": "video/mp4", "data": video_content}
                                        ])
        return response.text

def get_embedding(text):
    return embed_model.get_text_embedding(text)

def process_context(context):
    processed = []
    for item in context:
        try:
            node_content = json.loads(item['_node_content'])
            processed.append(node_content['text'])
        except json.JSONDecodeError:
            processed.append(item['_node_content'])
    return processed
# Main RAG pipeline function
def rag_pipeline(video_content,user_query, query_vector):
    # Step 1: Retrieve data from Qdrant collections
    player_info = search_qdrant("player_details", query_vector)
    teams_info = search_qdrant("roster", query_vector)
    live_feed = search_qdrant("game_feed", query_vector)
    team_schedule = search_qdrant("schedule", query_vector)

    logging.info("Search Results:")
    logging.info(f"Player Info: {player_info}")
    logging.info(f"Teams Info: {teams_info}")
    logging.info(f"Live Feed: {live_feed}")
    logging.info(f"Team Schedule: {team_schedule}")

    # Step 2: Combine retrieved data into context
    context = {
        "Player Info": process_context(player_info),
        "Teams Info": process_context(teams_info),
        "Live Feed": process_context(live_feed),
        "Team Schedule": process_context(team_schedule)
    }
    logging.info("Combined Context:")
    logging.info(context)

    # Step 3: Generate an engaging response using Gemini
    response = generate_response(video_content,user_query, context)

    logging.info("Generated Response:")
    logging.info(response)
    return response

# Example usage
#user_query = "Tell me about match played in September 13 2024 at Yankee sadium.Mention the date so that I can check the facts in your response"

def rag_chat(video_content, question):
    try:
        query_vector = get_embedding(question)
    except google_exceptions.GoogleAPICallError as e:
        print(f"Google API error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    assert len(query_vector) == 768, f"Expected 768 dimensions, got {len(query_vector)}"
    response = rag_pipeline(video_content,question, query_vector)
    logging.info(f"Generate response from rag_chat: {response}")
    return response
