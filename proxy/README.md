# TrenGIF GIPHY Proxy

A tiny [Cloudflare Worker](https://workers.cloudflare.com/) that holds your GIPHY
API key as a **server-side secret** and forwards GIF searches for the TrenGIF
extension. This keeps the key out of the published extension, where it would
otherwise be publicly extractable.

```
Extension popup ──HTTPS──> this Worker (holds GIPHY key) ──> GIPHY API
```

## Endpoint

```
GET /search?q=<term>&limit=<1-50>
```

Returns trimmed JSON: `{ "data": [{ "id", "title", "url", "embedUrl" }, ...] }`.

## Prerequisites

- A free [Cloudflare account](https://dash.cloudflare.com/sign-up).
- A free [GIPHY API key](https://developers.giphy.com/dashboard/) (create an app
  to get one).
- [Node.js](https://nodejs.org/) 18+.

## Deploy

```bash
cd proxy
npm install
npx wrangler login                 # opens a browser to authorize
npx wrangler secret put GIPHY_API_KEY   # paste your GIPHY key when prompted
npm run deploy
```

`wrangler deploy` prints your worker URL, e.g.
`https://trengif-proxy.your-subdomain.workers.dev`.

Then wire it into the extension:

1. Open `../config.js` and set `API_BASE` to that URL.
2. Open `../manifest.json` and replace the `host_permissions` entry with the same
   origin (keep the trailing `/*`).

## Local development

```bash
npm install
echo 'GIPHY_API_KEY = "your-key"' > .dev.vars   # gitignored
npm run dev                                       # serves on http://localhost:8787
```

Point the extension's `config.js` `API_BASE` at `http://localhost:8787` while
developing. Test directly with:

```bash
curl "http://localhost:8787/search?q=cat"
```
