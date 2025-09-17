# Etapa 1: build Angular
FROM node:20 AS build
WORKDIR /app
COPY helloangularnet.client/package*.json ./
RUN npm install --legacy-peer-deps
COPY helloangularnet.client/ ./
RUN npm run build -- --configuration production

# Etapa 2: servir con nginx
FROM nginx:alpine
COPY --from=build /app/dist/helloangularnet.client/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
