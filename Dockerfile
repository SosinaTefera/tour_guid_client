# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . .

# Build the React app for production
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build

# Install serve to serve the built app
RUN npm install -g serve

# Expose port 8088 (matching Cloud Run's expectation)
EXPOSE 8088

# Command to run the application on port 8088
CMD ["serve", "-s", "build", "-l", "8088"]