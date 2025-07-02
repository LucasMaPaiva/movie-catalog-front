# Etapa 1: build
FROM node:20 AS builder

WORKDIR /app
COPY ../.. .
RUN npm install
RUN npm run build

# Etapa 2: servir arquivos com nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
