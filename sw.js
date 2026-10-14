// 離線快取：第一次打開時把遊戲檔案存起來，之後沒網路也能玩。
// 每次更新遊戲時把 VERSION 改掉，手機下次連上網就會換成新版。
const VERSION = 'lh-m-1';
const FILES = [
  './', 'index.html', 'style.css?v=1', 'm.css?v=1', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  'js/core.js?v=1', 'js/data.js?v=1', 'js/items.js?v=1', 'js/character.js?v=1', 'js/map.js?v=1', 'js/pack.js?v=1',
  'js/sim.js?v=1', 'js/game.js?v=1', 'js/sprites.js?v=1', 'js/audio.js?v=1', 'js/music.js?v=1', 'js/render.js?v=1',
  'js/ui.js?v=1', 'js/main.js?v=1',
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
