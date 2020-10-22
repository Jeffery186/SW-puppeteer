importScripts("https://s2.bukalapak.com/marketplace/precache-manifest.bff693ffc9f6bd4ec6765df3f5f69c6a.js", "https://s2.bukalapak.com/marketplace/workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "https://s2.bukalapak.com/marketplace/workbox-v4.3.1"});
/* eslint-disable */
workbox.setConfig({
  debug: false,
});

// https://developers.google.com/web/tools/workbox/guides/generate-complete-sw#skip_waiting_and_clients_claim
workbox.core.clientsClaim();
workbox.core.skipWaiting();

// https://developers.google.com/web/tools/workbox/reference-docs/v4/workbox.precaching#.cleanupOutdatedCaches
workbox.precaching.cleanupOutdatedCaches();

workbox.routing.registerRoute(
  // Cache JS files
  // https://regex101.com/r/QycKmt/2
  /.*bukalapak.*\.m?js\b/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'js-cache-v2',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 48, // 2 days
        maxEntries: 30,
        purgeOnQuotaError: true,
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [200],
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  // Cache ico files
  /.*\.ico/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'favicon-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 48, // 2 days
        maxEntries: 30,
        purgeOnQuotaError: true,
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [200],
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  // Cache CSS files
  /.*\.css/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'css-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 48, // 2 days
        maxEntries: 30,
        purgeOnQuotaError: true,
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [200],
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|webp|svg)/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 48, // 2 days
        purgeOnQuotaError: true,
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [200],
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  // Cache font files
  /.*\.(?:woff|ttf)/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'font-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 48, // 2 days
        maxEntries: 30,
        purgeOnQuotaError: true,
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [200],
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  // cache response api
  /api\.bukalapak\.com\/categories/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
        purgeOnQuotaError: true,
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [200],
      }),
    ],
  }),
);

