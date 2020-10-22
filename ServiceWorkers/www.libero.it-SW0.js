/*** HP LIBERO SERVICE WORKER ***/

"use strict";
var _nocache = "2.0";

/* local WorkBox library */
importScripts('/public/workbox_hp.js?nc='+_nocache);

/* Remote CDN WorkBox library */
/* importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js'); */

/* Ignore some GET params while caching */
function cacheKeyWillBeUsed({request, mode}) {
	var urla = request.url;
	var im = urla.indexOf("/?"); // HP GET params management
	if(im>-1) return urla.substr(0,im);
	im = urla.indexOf("?refresh_ce"); // Refresh param management
	if(im>-1) return urla.substr(0,im);
	return request;
}

/* DOCS - NetworkFirst */
workbox.routing.registerRoute(
  ({url}) => (url.hostname === 'www.libero.it' || url.hostname === 'hpdev19.libero.it') && (url.pathname === "/" || url.pathname === "/sceltiperte.php" || url.pathname === "/socialnews.php" || url.pathname === "/custom_page.php" || url.pathname === "/custom.php" || url.pathname === "/notification.php" || url.pathname === "/local.php" || url.pathname.startsWith('/resources/')),
  new workbox.strategies.NetworkFirst({
      cacheName: 'docs',
	  plugins: [
		{cacheKeyWillBeUsed},
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 32
        })
	 ]
  })
);

/* TEMICALDI - NetworkFirst */
workbox.routing.registerRoute(
  ({url}) => (url.hostname === 'www.libero.it' || url.hostname === 'hpdev19.libero.it') && (url.pathname === "/temicaldi.php"),
  new workbox.strategies.NetworkFirst({
      cacheName: 'temi',
	  plugins: [
		{cacheKeyWillBeUsed},
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 64
        })
	 ]
  })
);

/* PUBLIC - CacheFirst */
workbox.routing.registerRoute(
  ({url}) => url.pathname.startsWith('/public/'),
  new workbox.strategies.CacheFirst({
      cacheName: 'public',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 64
        })
      ],
    }),
);

/* WIPS - CacheFirst */
/*
workbox.routing.registerRoute(
  ({url}) => url.hostname === 'wips.plug.it',
  new workbox.strategies.CacheFirst({
      cacheName: 'wips',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 256
        })
      ],
    }),
);
*/

/* MISC - StaleWhileRevalidate */
workbox.routing.registerRoute(
  ({url}) => url.pathname.startsWith('/cmp.js') || url.pathname.startsWith('/c/6201/cc.js') || url.pathname.startsWith('/v60.js') || url.pathname.startsWith('/js/iam2.0.js') || url.pathname.startsWith('/v1/clients/match') || url.pathname.startsWith('/storageframe.html'),
  new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'misc',
	  plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 32
        })
      ],
  })
);

/* ERRORS */
workbox.routing.setCatchHandler(({event}) => {
      switch (event.request.destination) {
        case 'document':
			return caches.match('/offline.php');
			break;
		case 'image':
			if(event.request.url.indexOf('wips.plug.it')>-1) return caches.match('/public/default_image.png?nc='+_nocache);
			else return caches.match('/public/default_empty.png?nc='+_nocache);
			break;
		default:
			return Response.error();
  }
});

/* Update basic cache */
function reCache(event){
  const urls = ['/','/socialnews.php','/sceltiperte.php','/offline.php'];
  event.waitUntil(caches.open('docs').then((cache) => cache.addAll(urls)));
  const urls_tc = ['/temicaldi.php'];
  event.waitUntil(caches.open('temi').then((cache) => cache.addAll(urls_tc)));
  const urls_pub = ['/public/default_image.png?nc='+_nocache,'/public/default_empty.png?nc='+_nocache,'/public/workbox_hp.js?nc='+_nocache];
  event.waitUntil(caches.open('public').then((cache) => cache.addAll(urls_pub)));
}

/* On Install */
self.addEventListener('install', (event) => {
	/* Skip Waiting */
	self.skipWaiting();
	try {
		caches.delete("wips").then(function(b){}).catch(function(b){});
	} catch(er){}
	reCache(event);
});

/* Analytics */
workbox.googleAnalytics.initialize();

/* Periodic Sync */
try {
	async function updateHP() {
	  const hpCache = await caches.open('docs');
	  await hpCache.add('/');
	}
	self.addEventListener('periodicsync', (event) => {
	  if (event.tag === 'update-hp') {
		console.log("*** PERIODIC SYNC EVENT RECEIVED");
		event.waitUntil(updateHP());
	  }
	});
} catch(er){}
	

/* Messaging */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'RECACHE') {
	  reCache(event);
  }
});


/* OneSignal Service Worker Code */
importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');
