# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers du projet
COPY . .

# Installation des dépendances (si package.json existe)
RUN if [ -f package.json ]; then npm install && npm run build; fi

# Production stage
FROM nginx:alpine

# Copier la configuration nginx
COPY --from=builder /app /usr/share/nginx/html/

# Exposer le port
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
