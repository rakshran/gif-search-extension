"use strict";

/**
 * TrenGIF popup logic.
 *
 * Flow: the user enters a search term -> we ask our Cloudflare Worker proxy
 * (which holds the GIPHY API key as a server-side secret) for matching GIFs ->
 * we display a random one and expose "shuffle" and "copy link" actions.
 *
 * The proxy keeps the GIPHY key out of the published extension. See
 * proxy/README.md and config.js for setup.
 */

const API_BASE = (window.TRENGIF_CONFIG && window.TRENGIF_CONFIG.API_BASE) || "";

// Cached DOM references.
const form = document.getElementById("searchForm");
const input = document.getElementById("searchTermInput");
const statusEl = document.getElementById("status");
const gifEl = document.getElementById("gif");
const actionsEl = document.getElementById("actions");
const shuffleButton = document.getElementById("shuffleButton");
const copyButton = document.getElementById("copyButton");

// Holds the most recent successful search results so "shuffle" can pick again
// without re-hitting the network.
let currentResults = [];
let currentGif = null;

/** Returns a random integer in the half-open range [min, max). */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

/** Updates the status line. Pass an empty string to clear it. */
function setStatus(message) {
  statusEl.textContent = message || "";
}

/** Clears the rendered GIF and hides the action buttons. */
function clearResults() {
  gifEl.replaceChildren();
  actionsEl.hidden = true;
  currentGif = null;
}

/**
 * Picks a random GIF from currentResults (avoiding an immediate repeat when
 * possible) and renders it via a sandboxed iframe using GIPHY's embed URL.
 */
function renderRandomGif() {
  if (currentResults.length === 0) {
    return;
  }

  let next = currentResults[getRandomInt(0, currentResults.length)];
  if (currentResults.length > 1 && currentGif && next.id === currentGif.id) {
    // Try once more to avoid showing the same GIF back-to-back.
    next = currentResults[getRandomInt(0, currentResults.length)];
  }
  currentGif = next;

  const iframe = document.createElement("iframe");
  iframe.src = next.embedUrl;
  iframe.title = next.title || "GIF result";
  iframe.loading = "lazy";
  iframe.allowFullscreen = true;

  gifEl.replaceChildren(iframe);
  actionsEl.hidden = false;
  copyButton.textContent = "Copy link";
  copyButton.disabled = false;
}

/** Fetches GIFs for the given term from the proxy and renders one. */
async function search(term) {
  const query = term.trim();
  if (!query) {
    setStatus("Type something to search for a GIF.");
    return;
  }

  if (!API_BASE) {
    setStatus("Not configured: set API_BASE in config.js.");
    return;
  }

  clearResults();
  setStatus("Searching…");

  try {
    const url = `${API_BASE.replace(/\/$/, "")}/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    const payload = await response.json();
    currentResults = Array.isArray(payload.data) ? payload.data : [];

    if (currentResults.length === 0) {
      setStatus(`No GIFs found for “${query}”. Try another search.`);
      return;
    }

    setStatus("");
    renderRandomGif();
  } catch (error) {
    console.error("TrenGIF search failed:", error);
    setStatus("Something went wrong. Check your connection and try again.");
    clearResults();
  }
}

/** Copies the current GIF's shareable URL to the clipboard. */
async function copyCurrentLink() {
  if (!currentGif || !currentGif.url) {
    return;
  }

  try {
    await navigator.clipboard.writeText(currentGif.url);
    copyButton.textContent = "Copied!";
    copyButton.disabled = true;
  } catch (error) {
    console.error("TrenGIF copy failed:", error);
    setStatus("Couldn't copy the link.");
  }
}

// Event listeners are attached exactly once, at startup.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  search(input.value);
});

shuffleButton.addEventListener("click", () => {
  if (currentResults.length > 0) {
    renderRandomGif();
  }
});

copyButton.addEventListener("click", copyCurrentLink);
