/* eslint-disable */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

const PREFIX = 'desktop';
const HEAD_PATHS = [
  'main',
  'moscow_city',
  'world',
  'politics',
  'incidents',
  'starlife',
  'auto',
  'sport',
  'games',
  'woman',
  'economics',
  'health',
  'kino',
  'scitech', //?
  'ua',
  'kiev',
  'all',
  'qex'
];

workbox.core.setCacheNameDetails({
  prefix: PREFIX,
  suffix: 'v1',
});

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/static\.rambler\.ru/,
  workbox.strategies.cacheFirst({
    cacheName: 'static-rambler-ru',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /\/assets\/.*\.(?:js|css)$/i,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'assets',
  })
);

workbox.routing.registerRoute(
  /(?:\/api\/v3\/.*|https:\/\/api\.games\.rambler\.ru\/.*)/i,
  workbox.strategies.networkFirst({
    networkTimeoutSeconds: 3,
    cacheName: 'api',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10,
        maxAgeSeconds: 30 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /https?:\/\/ssp\.rambler\.ru\/.*/,
  workbox.strategies.networkOnly()
);

workbox.routing.registerRoute(
  /\/location\/.*/,
  workbox.strategies.networkOnly()
);

workbox.routing.registerRoute(
  /^https:\/\/soft\.rambler\.ru/,
  workbox.strategies.cacheFirst({
    cacheName: 'sort',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 7,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  new RegExp(`\\/(?:${HEAD_PATHS.join('|')})?\\/?(\\?.*)?$`, 'i'), //'https:/www.rambler.ru/(.*)',
  workbox.strategies.networkFirst({
    networkTimeoutSeconds: 3,
    cacheName: `${PREFIX}-pages`,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 12,
        maxAgeSeconds: 30 * 60,
      }),
    ]
  })
);

// images
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/i,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 12 * 24 * 60 * 60, // 12 Days
      }),
    ],
  }),
);

// workbox.routing.registerRoute(
//   /https:\/\/store\.rambler\.ru/,
//   workbox.strategies.staleWhileRevalidate({
//     cacheName: 'rstorage',
//     plugins: [
//       new workbox.expiration.Plugin({
//         maxAgeSeconds: 2 * 60 * 60,
//         purgeOnQuotaError: true,
//       }),
//     ],
//   })
// );
//
// workbox.routing.registerRoute(
//   /^https:\/\/img\d{2}\.rl0\.ru\/.*\.(?:jpg|jpeg|png)$/i,
//   workbox.strategies.cacheFirst({
//     cacheName: 'images-rl0',
//     plugins: [
//       new workbox.expiration.Plugin({
//         maxEntries: 75,
//         maxAgeSeconds: 24 * 60 * 60,
//         purgeOnQuotaError: true,
//       }),
//     ],
//   }),
// );
