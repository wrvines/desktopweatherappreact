# Weather App

Weather app built with **React 19**, **Vite 8**, **Tailwind CSS 4**, and the
OpenWeatherMap + Geoapify APIs. Enter a city to see current conditions and a
7-day forecast.

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
nginx.conf             nginx config (HTTPS redirect, gzip, caching)
docker-compose.yml     web + certbot services
deploy.sh              deploy/renew helpers
```

## Deploying to the home server

Prerequisites on the server:

- Docker + Docker Compose v2
- Ports 80 and 443 forwarded on your router to the server
- DNS A records for your domain → your home IP
- `.env` with real API keys (`deploy.sh up` copies the example if missing)

Then, from this directory on the server:

```bash
./deploy.sh up     # builds, starts, and gets a real SSL cert
./deploy.sh renew  # renews the cert (run monthly)
```

### Automatic renewal

Add a monthly cron job on the server (or a systemd timer):

```
0 3 1 * * cd /path/to/desktopweatherappreact && ./deploy.sh renew >> /var/log/weather-app-renew.log 2>&1
```

## Security note

The API keys previously committed to this repo are compromised and were
removed from tracking. **Regenerate them** in the OpenWeatherMap and Geoapify
dashboards, then update your local `.env` before deploying.

## Notes

- Only one site can serve ports 80/443 at a time. If you host the portfolio on
  the root domain, run this app on a subdomain (edit `DOMAIN` in `deploy.sh`
  and the `server_name`/cert paths in `nginx.conf`).
