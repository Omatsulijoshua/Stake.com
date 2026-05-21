# Deployment Guide

This guide outlines how to deploy the platform to a VPS using Docker.

## 1. Prepare VPS
- OS: Ubuntu 22.04 LTS
- Specs: 2 vCPU, 4GB RAM (Minimum)
- Install Docker & Docker Compose.

## 2. Environment Variables
Ensure all production keys are set in `.env` files.
**CRITICAL**: Keep `JWT_SECRET` and `HOT_WALLET_PRIVATE_KEY` secure.

## 3. SSL Configuration (Nginx)
We recommend using Nginx as a reverse proxy with Let's Encrypt.

```nginx
server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000; # NestJS
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3001; # Next.js
    }
}
```

## 4. Dockerize for Production
Create `Dockerfile` for backend and frontend.

### Backend Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["npm", "run", "start:prod"]
```

### Frontend Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]
```

## 5. CI/CD (GitHub Actions)
Set up a pipeline to build images and push to a registry (e.g., Docker Hub), then pull on the VPS.
