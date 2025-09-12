# Use Node.js as the base image for the build stage
FROM node:18 as builder

WORKDIR /app

# Accept all the build-time environment variables from GitHub Actions
ARG VITE_FIREBASE_API_KEY
ARG VITE_AUTH_DOMAIN
ARG VITE_PROJECT_ID
ARG VITE_STORAGE_BUCKET
ARG VITE_MESSAGING_SENDER_ID
ARG VITE_APP_ID
ARG VITE_MEASUREMENT_ID

# Set environment variables so Vite can use them during the build
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_AUTH_DOMAIN=$VITE_AUTH_DOMAIN
ENV VITE_PROJECT_ID=$VITE_PROJECT_ID
ENV VITE_STORAGE_BUCKET=$VITE_STORAGE_BUCKET
ENV VITE_MESSAGING_SENDER_ID=$VITE_MESSAGING_SENDER_ID
ENV VITE_APP_ID=$VITE_APP_ID
ENV VITE_MEASUREMENT_ID=$VITE_MEASUREMENT_ID

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the production-ready static files
RUN npm run build

# --- Stage 2: The Production Server ---
# This stage uses a slim image with only what's needed to serve the files
FROM node:18-slim

WORKDIR /app

# Copy the built 'dist' folder from the 'builder' stage
COPY --from=builder /app/dist ./dist

# Install ONLY the 'serve' package
RUN npm install -g serve

# Expose port 8080 (this is just metadata; the actual port is set by Cloud Run)
EXPOSE 8080

# --- THIS IS THE FIX ---
# Run 'serve' without the '-l 8080' flag.
# 'serve' will now automatically listen on the PORT environment variable provided by Cloud Run.
CMD ["npx", "serve", "-s", "dist"]

