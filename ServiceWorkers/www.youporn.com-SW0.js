importScripts('//storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst } = workbox.strategies;
const { CacheableResponse } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

const locationHost= self.location.host;
const isGaySite = (locationHost.indexOf('youporngay') !== -1);
var ypAssets = 'yp-assets-fonts';

if(isGaySite){
	ypAssets = 'yp-assets-fonts-gay';
}

/**
 * This is what we control and create revisions for in a format:
 * <filename>_hash-<md5_hash>.<extension>
 * That is why we use here Cache-first strategy:
 * https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-runtime-caching.CacheFirst
 * Ex: https://fs.ypncdn.com/cb/assets/js/3232805.js?v=cf88412ef28e9ce9383208b05ad493a63d813fae
 */
//assets, except folder /fonts/
registerRoute(
	new RegExp(/https:\/\/fs\.ypncdn\.com\/(cb|stage\d{0,2})\/assets\/(?!fonts)([A-Za-z0-9]+)\/.*/),
	new CacheFirst({
		cacheName: 'yp-assets',
		plugins: [
			new CacheableResponse({
				statuses: [0, 200]
			}),
			new ExpirationPlugin({
				maxEntries: 100
			})
		],
	})
);

//assets, just folder /fonts/
registerRoute(
	new RegExp(/https:\/\/fs\.ypncdn\.com\/(cb|stage\d{0,2})\/assets\/fonts\/.*/),
	new CacheFirst({
		cacheName: ypAssets,
		plugins: [
			new CacheableResponse({
				statuses: [0, 200],
			}),
			new ExpirationPlugin({
				maxEntries: 100
			})
		],
	})
);

//images
registerRoute(
	new RegExp(/\/youpornwebfront\/images\/(?:[^\/]+\/)*.+\.(?:png|gif|jpg)(?:\?v=.+)?$/),
	new CacheFirst({
		cacheName: 'yp-images',
		plugins: [
			new CacheableResponse({
				statuses: [0, 200]
			}),
			new ExpirationPlugin({
				maxEntries: 100
			})
		],
	})
);

/**
 * This is external resource that we do not control. It can change any time, it's not revisioned.
 * In this case if we have cache - we serve from cache, but doing network request to refresh cache for subsequent run
 * https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-runtime-caching.StaleWhileRevalidate
 * Ex: https://cdn1d-static-shared.phncdn.com/mg_utils-1.0.0.js
 */
registerRoute(
	new RegExp(/https:\/\/(cdn1d-static-shared|ss)\.phncdn\.com\/.*\.js/),
	new CacheFirst({
		cacheName: 'yp-sharedcdn',
		plugins: [
			new CacheableResponse({
				statuses: [0, 200]
			}),
			new ExpirationPlugin({
				maxEntries: 30
			})
		],
	})
);

/**
 * This is external resource that we do not control. It can change any time, it's not revisioned.
 * In this case if we have cache - we serve from cache, but doing network request to refresh cache for subsequent run
 * https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-runtime-caching.StaleWhileRevalidate
 */
 /*
workboxSW.router.registerRoute(new RegExp(/https:\/\/media.trafficjunky.net\/(?!js\/holiday\-promo\.js)/),
	workboxSW.strategies.staleWhileRevalidate({
		cacheName: 'yp-trafficjunky',
		cacheExpiration: {
			maxEntries: 20
		},
		cacheableResponse: {statuses: [0, 200]}
	})
);
*/