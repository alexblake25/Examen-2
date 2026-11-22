const CACHE_NAME = "sportschool-v3";
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await precacheAppAssets(cache);
  })());
  self.skipWaiting();
});

async function precacheAppAssets(cache) {
  const origin = self.location.origin;
  const visited = new Set(APP_SHELL.map((path) => new URL(path, origin).href));
  const queue = [];
  const appResponse = await fetch("/");
  if (!appResponse.ok) return;
  const html = await appResponse.text();
  const assetPattern = /(?:src|href)=["']([^"']+)["']/g;
  for (const match of html.matchAll(assetPattern)) {
    const url = new URL(match[1], origin);
    if (url.origin === origin && /\.(?:js|mjs|css|tsx?|jsx)(?:$|\?)/i.test(url.pathname + url.search)) queue.push(url.href);
  }

  while (queue.length) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const body = await response.clone().text();
      await cache.put(url, response);
      if (/\.(?:js|mjs|tsx?|jsx)(?:$|\?)/i.test(new URL(url).pathname + new URL(url).search)) {
        const importPattern = /(?:from\s*|import\s*\(\s*)["']([^"']+)["']/g;
        for (const imported of body.matchAll(importPattern)) {
          try {
            const dependency = new URL(imported[1], url);
            if (dependency.origin === origin && !visited.has(dependency.href)) queue.push(dependency.href);
          } catch {
            // Un import inválido no debe impedir la instalación de la aplicación.
          }
        }
      }
    } catch {
      // La shell básica ya quedó precargada; un recurso secundario puede esperar a la red.
    }
  }
}

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        try {
          await caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
        } catch {
          // El fallo de caché no debe interrumpir una respuesta disponible en red.
        }
      }
      return response;
    } catch {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (event.request.mode === "navigate") {
        const appShell = await caches.match("/");
        if (appShell) return appShell;
      }
      return Response.error();
    }
  })());
});
