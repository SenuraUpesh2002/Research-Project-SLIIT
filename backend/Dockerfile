# Backend Dockerfile
FROM node:18-alpine

# Install netcat for database wait script
RUN apk add --no-cache netcat-openbsd

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for db-migrate)
RUN npm ci

# Copy application code
COPY . .

# Make migration script executable
RUN chmod +x migrate-and-start.sh

# Expose port
EXPOSE 5000

# Use migration script as entrypoint
ENTRYPOINT ["./migrate-and-start.sh"]
CMD ["npm", "start"]
