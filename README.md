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
type are sent over HTTPS solely to fetch matching GIFs — nothing is tracked or
saved. Full details in [`PRIVACY.md`](PRIVACY.md).

## Powered by GIPHY

GIF search and content are provided by the [GIPHY API](https://developers.giphy.com/).
The "Powered By GIPHY" attribution is shown in the popup as required by GIPHY's
terms.

## Development

TrenGIF is two small pieces:

- the **extension** (this folder) — the popup UI and logic, and
- a **backend proxy** ([`proxy/`](proxy/)) — so the GIPHY API key lives on the
  server as a secret and is never bundled into the published extension.

To build, configure, and run it locally, see [`CONTRIBUTING.md`](CONTRIBUTING.md).
Proxy setup and deployment live in [`proxy/README.md`](proxy/README.md).

## License

[MIT](LICENSE) © 2026 Rakshit Ranjan
