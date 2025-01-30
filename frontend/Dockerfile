# Use a lightweight Node.js image
FROM node:18-alpine 

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Install a simple static file server (if not using serve)
RUN npm install -g serve

# Set environment variable for Cloud Run
ENV PORT=8080

# Expose port 8080
EXPOSE 8080

# Start the application
CMD ["serve", "-s", "build", "-l", "8080"]
