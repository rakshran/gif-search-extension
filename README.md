# TrenGIF

A fun, lightweight Chrome extension that lets you search GIFs from your toolbar
and copy a shareable link in one click. Powered by [GIPHY](https://giphy.com/).

![TrenGIF screenshot](Screenshot5.png)

## Features

- 🔍 Search GIFs right from the toolbar popup
- 🎲 "Show me something else!" to shuffle through results
- 🔗 One-click copy of a shareable GIPHY link
- 🔒 Your GIPHY API key stays private — it lives in a server-side proxy, never in
  the published extension
- ✅ Manifest V3, minimal permissions, no analytics or tracking

## How it works

A client-side extension can't truly hide an API key — anything bundled into the
package is extractable. So TrenGIF calls a tiny Cloudflare Worker proxy that holds
the GIPHY key as a server-side secret:

```
Extension popup ──HTTPS──> Cloudflare Worker (holds GIPHY key) ──> GIPHY API
```

The worker URL is public and safe to ship; the key is not.

## Project layout

| Path                | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `manifest.json`     | Manifest V3 extension manifest                       |
| `popup.html` / `.js`| Popup UI and logic                                   |
| `style.css`         | Popup styles                                         |
| `config.js`         | Public runtime config (worker URL — no secrets)      |
| `icons/`            | Extension icons (16 / 32 / 48 / 128)                 |
| `proxy/`            | Cloudflare Worker proxy that holds the GIPHY key     |

## Setup

### 1. Deploy the proxy

The extension needs a running proxy. Follow [`proxy/README.md`](proxy/README.md):

```bash
cd proxy
npm install
npx wrangler login
npx wrangler secret put GIPHY_API_KEY   # paste your free GIPHY key
npm run deploy
```

Copy the worker URL it prints (e.g.
`https://trengif-proxy.your-subdomain.workers.dev`).

### 2. Configure the extension

- In `config.js`, set `API_BASE` to your worker URL.
- In `manifest.json`, set the `host_permissions` entry to the same origin (keep
  the trailing `/*`).

### 3. Load the extension

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select this repository's root folder.
4. Pin TrenGIF and click the icon to start searching.

## Publishing to the Chrome Web Store

This project targets current Web Store requirements: Manifest V3, a single clear
purpose, minimal permissions (only the proxy host), no remotely hosted code, a
complete icon set, and a published privacy policy ([`PRIVACY.md`](PRIVACY.md)).
Zip the extension files (excluding `proxy/`, `node_modules/`, and dev files) and
upload via the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/).

## Privacy

TrenGIF does not collect, store, or sell personal data. Search terms you type are
sent to the proxy and on to GIPHY solely to fetch results. See
[`PRIVACY.md`](PRIVACY.md).

## Attribution

GIF content and search are provided by the [GIPHY API](https://developers.giphy.com/).
The "Powered By GIPHY" attribution is shown in the popup as required by GIPHY's
terms.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2026 Rakshit Ranjan
