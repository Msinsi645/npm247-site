# npm247 website

Static one-page site for npm247 (ISO 9001 readiness consulting), served by Nginx in Docker.

## Files
| File | Purpose |
|---|---|
| `index.html` | All page content |
| `styles.css` | Design (colours and fonts are the variables at the top) |
| `main.js` | Mobile menu and enquiry form. **Edit `CONFIG` at the top before going live.** |
| `404.html`, `favicon.svg` | Not-found page and browser icon |
| `Dockerfile`, `nginx.conf` | Container build for Coolify (port 80, health check at `/healthz`) |

## Before you deploy
1. **Email address** — `info@npm247.co.za` is a placeholder. Change it in `main.js` (`CONFIG.email`), `index.html` (contact section) and `404.html`.
2. **Enquiry form** — by default the form opens the visitor's email app with the enquiry filled in. To receive submissions directly, set `CONFIG.formEndpoint` to any URL that accepts a JSON POST (Formspree, an n8n/Make webhook, or your own API).
3. Check the copy: timelines (3–6 months), "work across South Africa", and the FAQ answers should match how npm247 actually operates.

## Test locally
```bash
docker build -t npm247 .
docker run --rm -p 8080:80 npm247
# open http://localhost:8080
```

## Deploy in Coolify
1. Push this folder to a Git repo (GitHub/Gitea), e.g. `npm247-website`.
2. In Coolify: **Projects → your project → + New → Public/Private Repository**, pick the repo and branch.
3. **Build Pack: Dockerfile** (base directory `/`, Dockerfile location `/Dockerfile`).
4. **Ports Exposes: 80**.
5. **Domains:** e.g. `https://npm247.co.za,https://www.npm247.co.za` — Coolify's proxy issues the Let's Encrypt certificate automatically once DNS points at the server.
6. Optional: enable the health check with path `/healthz`.
7. **Deploy.** Turn on auto-deploy (webhook) so every push redeploys.

### If your Coolify server sits behind a Cloudflare Tunnel
Point the tunnel's public hostname (e.g. `npm247.co.za`) at the Coolify proxy (`http://localhost:80` on that host) and set the same domain on the app in Coolify, using `http://` in the Coolify domain field so the proxy doesn't try to get its own certificate (Cloudflare handles TLS).
