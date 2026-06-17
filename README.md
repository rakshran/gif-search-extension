# TrenGIF

A fun, lightweight Chrome extension that lets you search GIFs from your toolbar
and copy a shareable link in one click. Powered by [GIPHY](https://giphy.com/).

![TrenGIF screenshot](Screenshot5.png)

## Features

- 🔍 Search GIFs right from the toolbar popup
- 🎲 "Show me something else!" to shuffle through results
- 🔗 One-click copy of a shareable GIPHY link
- ✅ Manifest V3, minimal permissions, no analytics or tracking

## Install

Once published, TrenGIF will be available on the Chrome Web Store. To run the
latest version from source today, see [Development](#development).

## Privacy

TrenGIF does not collect, store, or sell any personal data. The search terms you
type are sent over HTTPS to GIPHY solely to fetch matching GIFs — nothing is
tracked or saved. Full details in [`PRIVACY.md`](PRIVACY.md).

## Powered by GIPHY

GIF search and content are provided by the [GIPHY API](https://developers.giphy.com/).
The "Powered By GIPHY" attribution is shown in the popup as required by GIPHY's
terms.

## Development

TrenGIF is a single Chrome extension that calls the GIPHY API directly using an
API key you supply.

1. Get a free key from the [GIPHY developer dashboard](https://developers.giphy.com/dashboard/).
2. Copy the config template and add your key:
   ```bash
   cp config.sample.js config.js   # then paste your key into config.js
   ```
3. Load it: open `chrome://extensions`, enable **Developer mode**, click
   **Load unpacked**, and select this folder.

More detail in [`CONTRIBUTING.md`](CONTRIBUTING.md).

> **Note on the API key:** a browser extension can't truly hide an API key —
> whatever you ship in `config.js` is bundled into the published extension and is
> extractable by anyone. Use a key dedicated to this project and watch its usage
> limits.

## License

[MIT](LICENSE) © 2026 Rakshit Ranjan
