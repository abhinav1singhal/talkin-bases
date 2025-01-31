# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /backend

# Copy the requirements file into the container
COPY ./app/requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY ./app ./app

# Copy the .env file
COPY .env .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the FastAPI application with uvicorn
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}
