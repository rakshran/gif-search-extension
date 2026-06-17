# Contributing to TrenGIF

Thanks for your interest! Contributions are welcome.

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
