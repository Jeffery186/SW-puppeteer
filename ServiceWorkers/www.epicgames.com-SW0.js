/* eslint-disable */
// epic-sw.txt
// built January 27 at 7:13pm HQ time
// https://developers.google.com/web/tools/workbox/guides/advanced-recipes

const cdnHost = 'https://static-assets-prod.epicgames.com/static/';
const precacheManifest = [{"url":"https://static-assets-prod.epicgames.com/epic-store/static/webpack/main.diesel-site.c7ae3ab4d4c29d8e1259.js"},{"url":"https://static-assets-prod.epicgames.com/epic-store/static/webpack/main.diesel-site.c7ae3ab4d4c29d8e1259.css"},{"url":"https://static-assets-prod.epicgames.com/epic-store/static/webpack/webAppStyles.diesel-site.c7ae3ab4d4c29d8e1259.css"},{"url":"https://static-assets-prod.epicgames.com/epic-store/static/webpack/launcherAppStyles.diesel-site.c7ae3ab4d4c29d8e1259.css"},{"url":"https://static-assets-prod.epicgames.com/epic-store/static/webpack/polyfill.diesel-site.c7ae3ab4d4c29d8e1259.js"}];
const navigationFallback = '/store/offline-cache';
const debug = false;
const shouldSkipWaiting = true;

// EPIC EDITED
importScripts(`${cdnHost}workbox-v3.3.1/workbox-sw.js`);

workbox.setConfig({
    modulePathPrefix: `${cdnHost}workbox-v3.3.1`
    // ,
    // debug, // boolean that enables debug logging in the console
});

// This will trigger the importScripts() for workbox.strategies, workbox.cacheableResponse, and workbox.expiration and their dependencies:
workbox.loadModule('workbox-core');
workbox.loadModule('workbox-strategies');
workbox.loadModule('workbox-cache-expiration');
workbox.loadModule('workbox-cacheable-response');
workbox.loadModule('workbox-precaching');

// if there is no revision property, we just want the url, because the url should have a hash in it's filename
workbox.precaching.precacheAndRoute(
    precacheManifest.map((entry) => (entry.revision ? entry : entry.url))
);

const runtimeCacheName = workbox.core.cacheNames.runtime;
const precacheCacheName = workbox.core.cacheNames.precache;
const offlineCacheName = 'offline-page';

const isImageRequest = new RegExp('.(?:png|gif|jpg|jpeg|svg)$');
const isVideoRequest = new RegExp('.(?:mp4|webm)$');
const isAssetRequest = new RegExp('.(?:js|css)$');
const isBlobRequest = new RegExp('.(^blob:)$');

const isNavigationRequest = ({event, url}) => {
    return event.request.mode === 'navigate';
};

// only writes to console if this is running on a non-prod environment
const debugLog = (msg) => {
    if (debug) console.log(msg);
};

self.addEventListener('install', (event) => {
    console.log('service worker installed');

    event.waitUntil(
        caches.open(offlineCacheName).then((cache) => {
            return fetch(navigationFallback, {credentials: 'omit', redirect: 'follow'}).then(
                (resp) => {
                    return cache.put(navigationFallback, new Response(resp.body));
                }
            );
        })
    );
    if (shouldSkipWaiting) {
        debugLog('activating service worker now');
        self.skipWaiting();
    }
});

self.addEventListener('activate', (_) => {
    console.log('service worker activated!');
});

workbox.routing.registerRoute(
    isImageRequest,
    new workbox.strategies.CacheFirst({
        cacheName: 'epic-image-cache',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
                purgeOnQuotaError: true,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    isAssetRequest,
    new workbox.strategies.CacheFirst({
        cacheName: 'epic-asset-cache',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                purgeOnQuotaError: true,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [200], // 0 for cors from code example, probably not necessary
            }),
        ],
    })
);

workbox.routing.registerRoute(isVideoRequest, new workbox.strategies.NetworkOnly());

workbox.routing.registerRoute(isBlobRequest, new workbox.strategies.NetworkOnly());

workbox.routing.registerRoute(isNavigationRequest, ({event}) => {
    event.respondWith(
        (async function getNavigateResponse() {
            const networkOnly = new workbox.strategies.NetworkOnly();
            try {
                const response = await networkOnly.handle({event});
                return response.clone();
            } catch (networkFirstError) {
                const offlineCacheResponse = await caches.match(navigationFallback, {
                    cacheName: offlineCacheName,
                });
                debugLog(
                    'offline cache response loaded from cache\nreturning offline cache response'
                );
                if (offlineCacheResponse && offlineCacheResponse.ok) {
                    debugLog(`offline cache response is .ok\n returning it`);
                    return offlineCacheResponse.clone();
                }
                return new Response(null, {
                    status: 500,
                    statusText: 'Failed to load offline page from service worker.',
                });
            }
        })()
    );
});
