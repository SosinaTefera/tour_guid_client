# Use official Node.js runtime as base image
FROM node:16-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . .

# Build the React app for production
RUN npm run build

# Install serve to run the production build
RUN npm install -g serve

# Expose port 8080 (matching Cloud Run's expectation)
EXPOSE 8080

# Command to run the application on port 8080
CMD ["serve", "-s", "build", "-l", "8080"]