const VERSION = 'ge-v5-1-2026';
const CORE = 'ge-core-' + VERSION;
const RUNTIME = 'ge-rt-' + VERSION;

const LOCAL_ASSETS = [
  './', './index.html', './404.html', './manifest.webmanifest',
  './robots.txt', './humans.txt', './sitemap.xml'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CORE);
    await Promise.allSettled(LOCAL_ASSETS.map(u => cache.add(new Request(u, { cache: 'reload' }))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CORE && k !== RUNTIME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

const isExternal = url => url.origin !== self.location.origin;
const isMedia = path => /\.(png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot)$/i.test(path);

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  /* CDN esterne: nessuna cache SW */
  if (isExternal(url)) return;

  /* NAVIGAZIONE: network-first */
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CORE);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (e) {
        const cache = await caches.open(CORE);
        const cached = (await cache.match('./index.html')) || (await cache.match('./'));
        if (cached) return cached;
        return new Response(
          '<!doctype html><meta charset="utf-8"><title>offline</title>' +
          '<body style="background:#05060d;color:#ffb020;font-family:monospace;' +
          'display:flex;align-items:center;justify-content:center;height:100vh">' +
          'NODO OFFLINE · ricarica quando torni online</body>',
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      }
    })());
    return;
  }

  /* ASSET LOCALI: cache-first */
  if (isMedia(url.pathname) || /\.(css|js|json|webmanifest|txt|xml)$/i.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME);
      const hit = await cache.match(req);
      if (hit) {
        fetch(req).then(res => {
          if (res && res.status === 200 && res.type === 'basic') cache.put(req, res.clone());
        }).catch(() => {});
        return hit;
      }
      try {
        const res = await fetch(req);
        if (res && res.status === 200 && res.type === 'basic') cache.put(req, res.clone());
        return res;
      } catch (e) {
        return new Response('', { status: 504, statusText: 'offline' });
      }
    })());
    return;
  }

  /* RESTO: stale-while-revalidate */
  event.respondWith((async () => {
    const cache = await caches.open(RUNTIME);
    const hit = await cache.match(req);
    const net = fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') cache.put(req, res.clone());
      return res;
    }).catch(() => hit);
    return hit || net;
  })());
});

self.addEventListener('message', event => {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') self.skipWaiting();
  if (data.type === 'PURGE') {
    event.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k)))));
  }
});
