# Weather App

Weather app built with **React 19**, **Vite 8**, **Tailwind CSS 4**, and the
OpenWeatherMap + Geoapify APIs. Enter a city to see current conditions and a
7-day forecast. Served from a home server as a Docker container behind
**Nginx Proxy Manager**.

## Local development

```bash
npm install
cp .env.example .env   # fill in your API keys
npm run dev            # http://localhost:5173
npm run build          # production build to dist/
npm run preview        # serve the production build locally
```

## Project structure

```
src/
  pages/Weather.jsx    current conditions + forecast grid
  components/Forecast.jsx
  App.jsx              city search / geocoding
  index.css            Tailwind entry
public/                favicon, manifest, robots.txt
.env.example           env template (API keys — never commit the real .env)
nginx.conf             plain HTTP config (SPA fallback, gzip, caching)
docker-compose.yml     web service on the shared "proxy" network
deploy.sh              up/down/logs/rebuild helpers
```

## Deploying with Nginx Proxy Manager

Prerequisites on the server:

- Docker + Docker Compose v2 and Nginx Proxy Manager running
- Ports 80 and 443 forwarded on your router to the NPM host (needed for
  Let's Encrypt validation)
- DNS A records for your domain → your home IP
- `.env` with real API keys (`deploy.sh up` copies the example if missing)

One-time network setup:

```bash
docker network create proxy
```

Make sure the NPM container is attached to that network too (add it in NPM's
compose file under `networks:` or recreate it joined to `proxy`).

Then, from this directory on the server:

```bash
./deploy.sh up    # builds and starts weather-app:80
```

### In the NPM UI

Create a **Proxy Host** (use a subdomain like `weather.williamvines.com` if
your portfolio already uses the root domain):

- Forward hostname: `weather-app`, Forward port: `80`
- Block common exploits / websockets off
- SSL tab: request a Let's Encrypt certificate, enable *Force SSL*

NPM handles certificate issuance and renewal, so there is no certbot or cron
on the app side.

## Security note

The API keys previously committed to this repo are compromised and were
removed from tracking. **Regenerate them** in the OpenWeatherMap and Geoapify
dashboards, then update your local `.env` before deploying.
