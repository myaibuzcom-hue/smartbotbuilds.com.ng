const CACHE_NAME = 'smartbillings-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './html2pdf.bundle.min.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Install the Service Worker and cache the files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Fetch files from cache first (for offline support), then from network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});