importScripts("/assets/precache-manifest.e7e59a9cbf76197ad598ed0a9308660a.js", "/assets/workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "/assets/workbox-v4.3.1"});
// Set debug: true in development
workbox.setConfig({ debug: false });

workbox.core.clientsClaim();
workbox.core.skipWaiting();

workbox.core.setCacheNameDetails({
  prefix: 'target',
});

workbox.loadModule('workbox-strategies');
workbox.loadModule('workbox-expiration');
workbox.loadModule('workbox-routing');

workbox.precaching.cleanupOutdatedCaches();

const precacheManifest = self.__precacheManifest.map(function (entry) {
  return entry.url.replace(/^.*(\/fonts)/, 'https://assets.targetimg1.com/ui/fonts');
});

workbox.precaching.precacheAndRoute(precacheManifest);
console.debug('precacheManifest', precacheManifest);

const SW_VERSION = '1.1.0';

self.addEventListener('activate', (event) => {
  console.debug('SW activate');
});

self.addEventListener('install', (event) => {
  console.debug('SW install');
});

const registerCacheRouters = (routesConfig) => {
  routesConfig.forEach((route) => {
    workbox.routing.registerRoute(
      new RegExp(route.routeRegExp),
      new workbox.strategies.CacheFirst({
        cacheName: route.cacheName,
        plugins: [
          new workbox.expiration.Plugin({
            maxAgeSeconds: route.maxAgeSeconds,
            maxEntries: route.maxEntries,
          }),
        ],
      })
    );
  });
};
self.addEventListener('message', (event) => {
  // eslint-disable-next-line default-case
  switch (event.data.type) {
    case 'GET_VERSION':
      event.ports[0].postMessage(SW_VERSION);
      break;
    case 'CACHE_CONFIG':
      registerCacheRouters(event.data.payload);
      break;
  }
});

