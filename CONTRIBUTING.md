# Contributing to TrenGIF

Thanks for your interest! Contributions are welcome.

## Project layout

| Path                 | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `manifest.json`      | Manifest V3 extension manifest                   |
| `popup.html` / `.js` | Popup UI and logic                               |
| `style.css`          | Popup styles                                     |
| `config.js`          | Public runtime config (proxy URL — no secrets)   |
| `icons/`             | Extension icons (16 / 32 / 48 / 128)             |
| `proxy/`             | Backend proxy that holds the GIPHY key as a secret |

## Local development

1. **Deploy or run the proxy** (see [`proxy/README.md`](proxy/README.md)). For
   local work, `cd proxy && npm install && npm run dev` serves it on
   `http://localhost:8787`.
2. **Point the extension at it**: set `API_BASE` in `config.js` to your proxy URL
   (e.g. `http://localhost:8787` for local dev).
3. **Load the extension**: go to `chrome://extensions`, enable **Developer mode**,
   click **Load unpacked**, and select the repository root.
4. After editing files, click the **reload** icon on the TrenGIF card to pick up
   changes.

## Guidelines

- Keep the extension Manifest V3 compliant and request only the permissions it
  needs.
- Never commit secrets. The GIPHY key belongs in the proxy as a Wrangler secret
  (or a gitignored `.dev.vars` locally) — never in `config.js` or the extension.
- Match the existing code style (modern, vanilla JS; no frameworks).
- Test the core flows before opening a PR: search, shuffle, copy link, empty
  query, no results, and proxy-unreachable error handling.

## Pull requests

Open a PR against `main` with a clear description of the change and how you tested
it.

## Publishing to the Chrome Web Store

TrenGIF targets current Web Store requirements: Manifest V3, a single clear
purpose, minimal permissions (only the proxy host), no remotely hosted code, a
complete icon set, and a published privacy policy ([`PRIVACY.md`](PRIVACY.md)).

1. Deploy the proxy and point `config.js` `API_BASE` (and the `manifest.json`
   `host_permissions` entry) at its URL — see [`proxy/README.md`](proxy/README.md).
2. Zip the extension files **only** — exclude `proxy/`, `node_modules/`, and other
   dev files.
3. Upload via the
   [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/).
