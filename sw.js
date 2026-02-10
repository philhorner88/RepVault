const CACHE_NAME = “repvault-v13”;
const ASSETS = [
“manifest.json”,
“icon-192.png”,
“icon-512.png”,
“https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js”,
“https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js”,
“https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap”
];

self.addEventListener(“install”, (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
);
self.skipWaiting();
});

self.addEventListener(“activate”, (event) => {
event.waitUntil(
caches.keys().then((keys) =>
Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
)
);
self.clients.claim();
});

self.addEventListener(“fetch”, (event) => {
const url = new URL(event.request.url);

// Network-first for HTML pages — always get fresh version
if (event.request.destination === “document” || url.pathname.endsWith(“index.html”) || url.pathname.endsWith(”/”)) {
event.respondWith(
fetch(event.request).then((response) => {
if (response && response.status === 200) {
const clone = response.clone();
caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
}
return response;
}).catch(() => {
return caches.match(event.request).then(c => c || caches.match(“index.html”));
})
);
return;
}

// Cache-first for static assets (icons, fonts, JS libs)
event.respondWith(
caches.match(event.request).then((cached) => {
if (cached) return cached;
return fetch(event.request).then((response) => {
if (!response || response.status === 0) return response;
const clone = response.clone();
caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
return response;
}).catch(() => {});
})
);
});
