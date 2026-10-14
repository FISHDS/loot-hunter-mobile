// 離線快取：第一次打開時把遊戲檔案存起來，之後沒網路也能玩。
// 每次更新遊戲時把 VERSION 改掉，手機下次連上網就會換成新版。
const VERSION = 'lh-m-6';
const FILES = [
  './', 'index.html', 'style.css?v=6', 'm.css?v=6', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  'js/core.js?v=6', 'js/data.js?v=6', 'js/items.js?v=6', 'js/character.js?v=6', 'js/map.js?v=6', 'js/pack.js?v=6',
  'js/sim.js?v=6', 'js/game.js?v=6', 'js/sprites.js?v=6', 'js/kid.js?v=6', 'js/audio.js?v=6', 'js/music.js?v=6', 'js/render.js?v=6',
  'js/ui.js?v=6', 'js/main.js?v=6',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// 遊戲檔案：先用快取（快、可離線）；字型等外部檔案：有網路就抓，順便存一份
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && (res.ok || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy));
      }
      return res;
    }).catch(() => hit))
  );
});
