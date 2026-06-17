/**
 * TrenGIF GIPHY proxy (Cloudflare Worker).
 *
 * Holds the GIPHY API key as a server-side secret (`env.GIPHY_API_KEY`) so it
 * never ships inside the browser extension. Exposes a single endpoint:
 *
 *   GET /search?q=<term>&limit=<1-50>
 *
 * It forwards the query to the GIPHY search API, trims the response to just the
 * fields the extension needs, and returns it as JSON with permissive CORS
 * headers (no credentials are involved, so `*` is acceptable).
 */

const GIPHY_SEARCH_URL = "https://api.giphy.com/v1/gifs/search";
const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 50;
const MAX_QUERY_LENGTH = 100;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

/** Reduces a raw GIPHY gif object to the fields the extension uses. */
function slimGif(gif) {
  return {
    id: gif.id,
    title: gif.title,
    url: gif.url,
    embedUrl: gif.embed_url,
  };
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const url = new URL(request.url);
    if (url.pathname !== "/search") {
      return jsonResponse({ error: "Not found" }, 404);
    }

    const query = (url.searchParams.get("q") || "").trim().slice(0, MAX_QUERY_LENGTH);
    if (!query) {
      return jsonResponse({ error: "Missing required query parameter: q" }, 400);
    }

    if (!env.GIPHY_API_KEY) {
      return jsonResponse({ error: "Server is not configured" }, 500);
    }

    const requestedLimit = parseInt(url.searchParams.get("limit"), 10);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), MAX_LIMIT)
      : DEFAULT_LIMIT;

    const giphyUrl = new URL(GIPHY_SEARCH_URL);
    giphyUrl.searchParams.set("api_key", env.GIPHY_API_KEY);
    giphyUrl.searchParams.set("q", query);
    giphyUrl.searchParams.set("limit", String(limit));
    giphyUrl.searchParams.set("offset", "0");
    giphyUrl.searchParams.set("rating", "g");
    giphyUrl.searchParams.set("lang", "en");

    try {
      const giphyResponse = await fetch(giphyUrl.toString(), {
        // Cache identical searches at the edge for a short window.
        cf: { cacheTtl: 300, cacheEverything: true },
      });

      if (!giphyResponse.ok) {
        return jsonResponse(
          { error: "Upstream request failed", status: giphyResponse.status },
          502
        );
      }

      const payload = await giphyResponse.json();
      const data = Array.isArray(payload.data) ? payload.data.map(slimGif) : [];

      return jsonResponse(
        { data },
        200,
        { "Cache-Control": "public, max-age=300" }
      );
    } catch (error) {
      return jsonResponse({ error: "Unexpected error" }, 500);
    }
  },
};
