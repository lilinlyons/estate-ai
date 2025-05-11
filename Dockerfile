# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy and install backend dependencies
COPY backend ./backend
WORKDIR /app/backend

EXPOSE 3000
EXPOSE 3001

RUN npm install

# Copy and install frontend dependencies
COPY frontend ./../frontend
WORKDIR /app/frontend
RUN npm install

# Install nodemon globally for backend
RUN npm install -g nodemon

# Back to root and run both dev processes
WORKDIR /app

# Install concurrently to run both commands
RUN npm install -g concurrently

# Default command: run backend and frontend dev servers
CMD concurrently "cd backend && nodemon index.js" "cd frontend && npm run dev"
