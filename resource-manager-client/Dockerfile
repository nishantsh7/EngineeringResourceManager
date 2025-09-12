# --- Stage 1: The Builder ---
# This stage installs all dependencies and builds the React app
FROM node:18 as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Set ARGs for build-time environment variables
ARG VITE_FIREBASE_API_KEY
ARG VITE_AUTH_DOMAIN
ARG VITE_PROJECT_ID
ARG VITE_STORAGE_BUCKET
ARG VITE_MESSAGING_SENDER_ID
ARG VITE_APP_ID
ARG VITE_MEASUREMENT_ID

# Set ENVs so Vite can read them
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_AUTH_DOMAIN=$VITE_AUTH_DOMAIN
ENV VITE_PROJECT_ID=$VITE_PROJECT_ID
ENV VITE_STORAGE_BUCKET=$VITE_STORAGE_BUCKET
ENV VITE_MESSAGING_SENDER_ID=$VITE_MESSAGING_SENDER_ID
ENV VITE_APP_ID=$VITE_APP_ID
ENV VITE_MEASUREMENT_ID=$VITE_MEASUREMENT_ID

# Install dependencies and build the app
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: The Final Production Image ---
# This stage uses a tiny, efficient Nginx web server
FROM nginx:stable-alpine

# Copy the built files from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
