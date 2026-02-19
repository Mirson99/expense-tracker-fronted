# --- ETAP 1: Budowanie (Build) ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./

# Czysta instalacja - klucz do przewidywalności
RUN npm ci

# Kopiujemy resztę kodu i budujemy
COPY . .
RUN npm run build

# --- ETAP 2: Serwowanie (Runtime) ---
FROM nginx:alpine

# Kopiujemy TYLKO gotowe pliki statyczne do serwera Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80