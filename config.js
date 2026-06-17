// TrenGIF runtime configuration.
//
// This file is intentionally committed and contains NO secrets. Your GIPHY API
// key lives only inside the Cloudflare Worker proxy (as a Wrangler secret) and
// is never shipped with the extension. See proxy/README.md for setup.
//
// Replace API_BASE with the URL of your deployed worker, e.g.
//   https://trengif-proxy.your-subdomain.workers.dev
// For local development with `wrangler dev`, use http://localhost:8787
window.TRENGIF_CONFIG = {
  API_BASE: "https://trengif-proxy.YOUR-SUBDOMAIN.workers.dev",
};
