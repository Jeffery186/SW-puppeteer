/* global importScripts, workbox */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.setConfig({
  debug: false,
});

workbox.core.setCacheNameDetails({
  prefix: 'tiktok-app',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime'
});

workbox.precaching.precacheAndRoute([
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/images/tiktok-logo/launch/splash_640x1136.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/images/tiktok-logo/launch/splash_750x1294.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/images/tiktok-logo/launch/splash_1242x2148.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/images/tiktok-logo/launch/splash_1125x2436.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/images/tiktok-logo/launch/splash_1536x2048.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/images/tiktok-logo/launch/splash_1668x2224.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/images/tiktok-logo/launch/splash_2048x2732.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/pwa/icon_128x128.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/pwa/icon_192x192.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/pwa/icon_256x256.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/pwa/icon_384x384.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/pwa/icon_512x512.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/pwa/icon_128x128.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/images/tiktok-logo/amp/1x1.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/images/tiktok-logo/amp/3x4.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/images/tiktok-logo/amp/4x3.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/images/tiktok-logo/amp/m-hashtag-default.png',
  'https://s16.tiktokcdn.com/musical/resource/mtact/static/images/tiktok-logo/amp/amp_tiktok_cover.png',
]);

workbox.routing.registerRoute(
  /^https:\/\/sf-tb-sg.ibytedtos.com\//,
  new workbox.strategies.NetworkFirst(),
  'GET'
);

workbox.routing.registerRoute(
  /^https:\/\/((s16\.tiktokcdn\.com)|(s0-a\.ipstatp\.com))\/tiktok\/falcon\//,
  new workbox.strategies.CacheFirst({
    cacheName: 'cdn-file',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ]
  })
);

workbox.routing.registerRoute(
  /^https:\/\/((s16\.tiktokcdn\.com)|(s0-a\.ipstatp\.com))\/musical\/resource\/mtact\/static\/fonts\//,
  new workbox.strategies.CacheFirst({
    cacheName: 'cdn-font-file',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ]
  })
);