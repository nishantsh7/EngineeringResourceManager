# Use a slim Node.js image for a smaller footprint
FROM node:18-slim

WORKDIR /app

# Copy only package files first to leverage Docker's layer caching
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

EXPOSE 8080

# Run the app directly with node for a faster startup
CMD ["node", "server.js"]
