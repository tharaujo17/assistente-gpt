# Stage 1: Builder
FROM node:20 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Build do Vite
RUN npm run build

# Stage 2: Final
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

# Copia o build
COPY --from=builder /app/dist .

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
