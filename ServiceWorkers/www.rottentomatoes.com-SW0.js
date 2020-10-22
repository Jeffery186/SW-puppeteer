/* eslint-disable no-undef */
// global self, caches, workbox, importScripts, async

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (!workbox) {
  throw new Error('Workbox didn\'t load');
}

const globalCacheNames = {
  prefix: 'rtv3',
  precache: 'preCache',
  runtime: 'runtime'
};
const regexes = {
  any: /.*/,
  rtv3Fonts: /(?:\/fonts\/).*\.(?:woff|woff2|ttf|otf|svg|eot)(?:\?.*)?$/,
  rtv3Assets: /\.(?:png|gif|jpg|jpeg|svg|js|css|json)$/,
  rtv3DocsBlacklist: [/service-worker\/?.*$/],
  rtv3Napis: {
    movieList: /\/napi\/movieList.*/,
    showtime: /\/napi\/(?:theaterShowtimeGroupings|movieCalendar|showtimes).*/,
    default: /\/napi\/.*/,
  },
};
const cacheMaxAge = {
  default: 30 * 24 * 60 * 60,
  rtv3Docs: 7 * 24 * 60 * 60,
  rtv3Napis: {
    movieList: 24 * 60 * 60,
    showtime: 60 * 60,
  },
};
const maxEntries = {
  default: 100,
  rtv3Fonts: 10,
  rtAssets: 200,
};
const cacheNames = {
  rtv3Docs: globalCacheNames.prefix + '-rtv3Docs',
  rtv3Fonts: globalCacheNames.prefix + '-rtv3Fonts',
  rtv3Assets: globalCacheNames.prefix + '-rtv3Assets',
  rtv3Napis: globalCacheNames.prefix + '-rtv3Napis',
};
const routes = {};

let route;

function cachePages(urls) {
  return Promise.all(urls.map(async (url) => {
    const openedCache = await caches.open(cacheNames.rtv3Docs);
    const responseFromCache = await openedCache.match(url);

    if (!responseFromCache) {
      const responseFromNetwork = await fetch(url);
      await openedCache.put(url, responseFromNetwork);
    }
  }));
}

workbox.setConfig({ debug: false });
workbox.core.setCacheNameDetails(globalCacheNames);
workbox.precaching.precacheAndRoute(['/offline/']);

routes.rtv3DocsRoute = new workbox.routing.NavigationRoute(
  (req) => {
    const tactic = workbox.strategies.staleWhileRevalidate({
      cacheName: cacheNames.rtv3Docs,
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: cacheMaxAge.rtv3Napis.movieList,
          maxEntries: maxEntries.default,
        }),
      ],
    });

    return tactic.handle.call(tactic, req)
      .catch(()=> caches.match('/offline/'));
  },
  {
    blacklist: regexes.rtv3DocsBlacklist,
  }
);

routes.rtv3NapisMovieListRoute = new workbox.routing.RegExpRoute(
  regexes.rtv3Napis.movieList,
  workbox.strategies.cacheFirst({
    cacheName: cacheNames.rtv3Napis,
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: cacheMaxAge.rtv3Napis.movieList,
        maxEntries: maxEntries.default,
      }),
    ],
  }),
  'GET'
);

routes.rtv3NapisShowtimeRoute = new workbox.routing.RegExpRoute(
  regexes.rtv3Napis.showtime,
  workbox.strategies.staleWhileRevalidate({
    cacheName: cacheNames.rtv3Napis,
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: cacheMaxAge.rtv3Napis.showtime,
        maxEntries: maxEntries.default,
      }),
    ],
  }),
  'GET'
);

routes.rtv3NapisAllRoute = new workbox.routing.RegExpRoute(
  regexes.rtv3Napis.default,
  new workbox.strategies.NetworkOnly()
);

routes.rtv3FontsRoute = new workbox.routing.RegExpRoute(
  regexes.rtv3Fonts,
  workbox.strategies.cacheFirst({
    cacheName: cacheNames.rtv3Fonts,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: maxEntries.rtv3Fonts,
      }),
    ],
  }),
  'GET'
);

routes.rtv3Assets = new workbox.routing.RegExpRoute(
  regexes.rtv3Assets,
  workbox.strategies.cacheFirst({
    cacheName: cacheNames.rtv3Assets,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: maxEntries.default,
      }),
    ],
  }),
  'GET'
);

for (route in routes) {
  workbox.routing.registerRoute(routes[route]);
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheNames.rtv3Docs).then(cache => cache.addAll(['/'])));
});

self.addEventListener('message', (event) => {
  if (!event.data){
    return;
  } else if (event.data === 'skipWaiting') {
    // eslint-disable-next-line no-console
    console.log('Updating ServiceWorker...');
    self.skipWaiting();
    return;
  } else {
    try {
      const preCachingPageUrls = JSON.parse(event.data);

      if (preCachingPageUrls) {
        cachePages(preCachingPageUrls)
          .then(()=> {
            // eslint-disable-next-line no-console
            console.log('caching pages is done');
          });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }
});
