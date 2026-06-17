# Contributing to TrenGIF

Thanks for your interest! Contributions are welcome.

## Project layout

| Path                 | Purpose                                              |
| -------------------- | ---------------------------------------------------- |
| `manifest.json`      | Manifest V3 extension manifest                       |
| `popup.html` / `.js` | Popup UI and logic                                   |
| `style.css`          | Popup styles                                         |
| `config.sample.js`   | Config template — copy to `config.js` and add a key  |
| `config.js`          | Your local config with the GIPHY key (gitignored)    |
| `icons/`             | Extension icons (16 / 32 / 48 / 128)                 |

## Local development

1. **Add your GIPHY key**: get a free key from the
   [GIPHY developer dashboard](https://developers.giphy.com/dashboard/), then
   `cp config.sample.js config.js` and paste the key into `config.js`.
2. **Load the extension**: go to `chrome://extensions`, enable **Developer mode**,
   click **Load unpacked**, and select the repository root.
3. After editing files, click the **reload** icon on the TrenGIF card to pick up
   changes.

## Guidelines

- Keep the extension Manifest V3 compliant and request only the permissions it
  needs.
- **Never commit `config.js` or your API key.** `config.js` is gitignored for this
  reason. (Be aware the key is still visible inside any published build — that's an
  inherent limitation of client-side extensions.)
- Match the existing code style (modern, vanilla JS; no frameworks).
- Test the core flows before opening a PR: search, shuffle, copy link, empty
  query, no results, and network-error handling.

## Pull requests

Open a PR against `main` with a clear description of the change and how you tested
it.

## Publishing to the Chrome Web Store

TrenGIF targets current Web Store requirements: Manifest V3, a single clear
purpose, minimal permissions (only `api.giphy.com`), no remotely hosted code, a
complete icon set, and a published privacy policy ([`PRIVACY.md`](PRIVACY.md)).

1. Make sure `config.js` contains your real GIPHY key (it must be included in the
   package — that's what makes search work for users).
2. Zip the extension files: `manifest.json`, `popup.html`, `popup.js`,
   `style.css`, `config.js`, and `icons/`. Exclude docs and dev files.
   ```bash
   zip -r trengif.zip manifest.json popup.html popup.js style.css config.js icons
   ```
3. Upload via the
   [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   → your item → **Package** → **Upload new package**, then submit for review.
