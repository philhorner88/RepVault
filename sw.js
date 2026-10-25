const CACHE_NAME = 'repvault-v51';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
// React is loaded from cdnjs. Without caching it here, the app shows a blank
// screen when opened with no signal, even though index.html is cached.
const CDN = [
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'
];
const NETWORK_TIMEOUT_MS = 3000; // weak gym signal: fall back to the cached copy quickly

// Install: cache each asset separately, so one missing file (e.g. an icon)
// doesn't stop everything else from being cached.
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(cache =>
    Promise.all([...CORE, ...CDN].map(url => cache.add(url).catch(() => {})))
  ));
});

// Activate: clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function fromCache(request) {
  // Navigations (including ?query links) fall back to the cached app shell.
  return caches.match(request, { ignoreSearch: request.mode === 'navigate' })
    .then(hit => hit || (request.mode === 'navigate' ? caches.match('./index.html') : undefined));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // CDN scripts are versioned and never change: cache-first.
  if (CDN.includes(req.url)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then(c => c.put(req, copy)); }
      return res;
    })));
    return;
  }
  if (!req.url.startsWith(self.location.origin)) return;

  // Same-origin: network-first with a timeout, so updates arrive straight away
  // but a slow connection doesn't leave you staring at a white screen.
  e.respondWith(new Promise(resolve => {
    let settled = false;
    const useCache = () => fromCache(req).then(hit => {
      if (hit && !settled) { settled = true; resolve(hit); }
      return hit;
    });
    const timer = setTimeout(useCache, NETWORK_TIMEOUT_MS);
    fetch(req).then(res => {
      clearTimeout(timer);
      // Only cache good responses; a 404/500 must not replace the working copy.
      if (res.ok) { const copy = res.clone(); e.waitUntil(caches.open(CACHE_NAME).then(c => c.put(req, copy))); }
      if (!settled) { settled = true; resolve(res); }
    }).catch(() => {
      clearTimeout(timer);
      useCache().then(hit => { if (!settled) { settled = true; resolve(hit || Response.error()); } });
    });
  }));
});
