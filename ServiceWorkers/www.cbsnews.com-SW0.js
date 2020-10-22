// Source and license: https://github.com/jakearchibald/async-waituntil-polyfill
{
	const waitUntil = ExtendableEvent.prototype.waitUntil;
	const respondWith = FetchEvent.prototype.respondWith;
	const promisesMap = new WeakMap();

	ExtendableEvent.prototype.waitUntil = function(promise) {
		const extendableEvent = this;
		let promises = promisesMap.get(extendableEvent);

		if (promises) {
			promises.push(Promise.resolve(promise));
			return;
		}

		promises = [Promise.resolve(promise)];
		promisesMap.set(extendableEvent, promises);

		// call original method
		return waitUntil.call(extendableEvent, Promise.resolve().then(function processPromises() {
			const len = promises.length;

			// wait for all to settle
			return Promise.all(promises.map(p => p.catch(()=>{}))).then(() => {
				// have new items been added? If so, wait again
				if (promises.length != len) return processPromises();
				// we're done!
				promisesMap.delete(extendableEvent);
				// reject if one of the promises rejected
				return Promise.all(promises);
			});
		}));
	};

	FetchEvent.prototype.respondWith = function(promise) {
		this.waitUntil(promise);
		return respondWith.call(this, promise);
	};
}

const CBSNEWS = {
	assetsVersion: "80c994f4141e16ae2db386379632a923",
	features: {},
};

const LOG_PREFIX = `%c[CBSNEWS SW ${CBSNEWS.assetsVersion}]`;
const LOG_STYLE = `font-weight: bold;`;

const PRELOAD_CACHE = 'precache-v1';
// A list of local resources we always want to be cached.
const PRELOAD_CACHE_URLS = [
	'/fly/bundles/cbsnewscore/js-build/main.js',
	'/fly/bundles/cbsnewscore/js-build/main.responsive.js',
	'/fly/bundles/cbsnewscore/js-build/main.video.js',
	'/fly/bundles/cbsnewscore/js-build/main.video-embed.js',
];

const OFFLINE_CACHE = 'offline-v1';

self.addEventListener('install', event => {
	console.log(LOG_PREFIX, LOG_STYLE, 'installing');

	self.skipWaiting();

	event.waitUntil(async _ => {
		if (self.registration.navigationPreload) {
			// Enable navigation preloads
			await self.registration.navigationPreload.enable();
		}
	});

	fetchPreloadResources();
	fetchOfflinePage();
});

self.addEventListener('activate', async event => {
	console.log(LOG_PREFIX, LOG_STYLE, 'now ready to handle fetches');

	try {
		await event.waitUntil(clients.claim());

		console.log(LOG_PREFIX, LOG_STYLE, 'all clients claimed', clients);
	} catch (error) {
		console.error(LOG_PREFIX, LOG_STYLE, 'failed to claim clients with error', error.message);
	}
});

self.addEventListener('fetch', async event => {
	const request = event.request;

	const LOG_FETCH_STYLE = LOG_STYLE + 'color: hsl('+getInt(0, 360)+','+getInt(35, 80)+'%,'+getInt(20, 45)+'%)';

	// Let the browser do its default thing
	// for non-GET requests.
	if (request.method != 'GET') {
		console.log(LOG_PREFIX, LOG_FETCH_STYLE, 'not a GET request', request.url, event);
		return;
	}


	const preloadResponse = await event.preloadResponse;
	if (preloadResponse) {
		console.log(LOG_PREFIX, LOG_FETCH_STYLE, 'returning preload response', request.url, event);
		return event.respondWith(preloadResponse);
	}

	// request.mode = navigate isn't supported in all browsers
	// so include a check for Accept: text/html header.
	if (
		request.mode === 'navigate' ||
		(request.method === 'GET' && request.headers.get('accept').includes('text/html'))
	) {
		console.log(LOG_PREFIX, LOG_FETCH_STYLE, 'fetching navigation request', request.url, event);

		return event.respondWith(fetch(request).catch(error => {
			console.log(LOG_PREFIX, LOG_FETCH_STYLE, 'navigation request failed, responding with offline page', error.message);
			return caches.match('/offline.html');
		}));
	}
	else if (
		request.destination === "script" &&
		new RegExp(PRELOAD_CACHE_URLS.join('|')).test(request.url)
	) {
		return event.respondWith(caches.match(request).then(response => {
			if (response) {
				console.log(LOG_PREFIX, LOG_FETCH_STYLE, 'HIT - returning cached script', request.url);
				return response;
			}

			console.log(LOG_PREFIX, LOG_FETCH_STYLE, 'MISS - fetching script', request.url);
			return fetch(request);
		}));
	}
});

// async function fetchFeatures () {
// 	const featuresRequest = new Request('/feedfiles/features.json');
// 	const fearuresResponse = await fetch(featuresRequest);
// 	CBSNEWS.features = await fearuresResponse.json();
// 	console.log(LOG_PREFIX, LOG_STYLE, 'fetched features', CBSNEWS.features);
// }

async function fetchPreloadResources () {
	console.log(LOG_PREFIX, LOG_STYLE, 'delete old cache');
	await caches.delete(PRELOAD_CACHE);

	const preloadCache = await caches.open(PRELOAD_CACHE);
	await PRELOAD_CACHE_URLS.map(url => {
		const request = new Request(url + '?v=' + CBSNEWS.assetsVersion);
		return fetch(request).then(response => preloadCache.put(request, response));
	});

	console.log(LOG_PREFIX, LOG_STYLE, 'fetched preload resources', PRELOAD_CACHE_URLS);
}

async function fetchOfflinePage () {
	const offlinePageRequest = new Request('/offline.html');
	const offlinePageResponse = await fetch(offlinePageRequest);
	const offlineCache = await caches.open(OFFLINE_CACHE);
	await offlineCache.put(offlinePageRequest, offlinePageResponse)

	console.log(LOG_PREFIX, LOG_STYLE, 'fetched offline page');
}

function getInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
