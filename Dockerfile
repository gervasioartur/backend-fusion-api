# Stage 1 - Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Defining build-time variables
ARG PORT
ARG HOST
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_NAME
ARG SYNCHRONIZE
ARG REDIS_HOST
ARG REDIS_PORT

# Passing ARG variables to ENV so they are available at runtime
ENV PORT=${PORT} 
ENV HOST=${HOST} 
ENV DB_HOST=${DB_HOST} 
ENV DB_PORT=${DB_PORT} 
ENV DB_USERNAME=${DB_USERNAME} 
ENV DB_PASSWORD=${DB_PASSWORD} 
ENV DB_NAME=${DB_NAME} 
ENV SYNCHRONIZE=${SYNCHRONIZE} 
ENV REDIS_HOST=${REDIS_HOST} 
ENV REDIS_PORT=${REDIS_PORT}

RUN npm run build

# Stage 2 - Production
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 8080
CMD ["npm", "start"]
