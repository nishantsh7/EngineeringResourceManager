# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Accept build-time environment variables from GitHub Actions
ARG VITE_FIREBASE_API_KEY
ARG VITE_AUTH_DOMAIN
ARG VITE_PROJECT_ID
ARG VITE_STORAGE_BUCKET
ARG VITE_MESSAGING_SENDER_ID
ARG VITE_APP_ID
ARG VITE_MEASUREMENT_ID

# Set environment variables so Vite can access them
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_AUTH_DOMAIN=$VITE_AUTH_DOMAIN
ENV VITE_PROJECT_ID=$VITE_PROJECT_ID
ENV VITE_STORAGE_BUCKET=$VITE_STORAGE_BUCKET
ENV VITE_MESSAGING_SENDER_ID=$VITE_MESSAGING_SENDER_ID
ENV VITE_APP_ID=$VITE_APP_ID
ENV VITE_MEASUREMENT_ID=$VITE_MEASUREMENT_ID

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy frontend code
COPY . .

# Build frontend (Vite will now pick up VITE_ envs)
RUN npm run build

# Install 'serve' to serve the Vite-built app
RUN npm install -g serve

# Expose the port
EXPOSE 8080

# Serve the app
CMD ["npx", "serve", "-s", "dist", "-l", "8080"]
