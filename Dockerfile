# build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_WEATHER_BASE_URL
ARG VITE_GEOCODE_BASE_URL
ARG VITE_WEATHER_API_KEY
ARG VITE_GEOCODE_API_KEY
ENV VITE_WEATHER_BASE_URL=$VITE_WEATHER_BASE_URL \
    VITE_GEOCODE_BASE_URL=$VITE_GEOCODE_BASE_URL \
    VITE_WEATHER_API_KEY=$VITE_WEATHER_API_KEY \
    VITE_GEOCODE_API_KEY=$VITE_GEOCODE_API_KEY
RUN npm run build

# serve stage
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80 443
