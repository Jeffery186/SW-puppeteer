'use strict';

var path = new URL(location.href).searchParams.get('path'),
	offlineURL = '/offline-page',
	offlineCache = [
		offlineURL,
		path + '/img/branding/metro-logo-black.svg'
	],
	offlineCacheV = 1,
	offlineCacheName = 'offline-cache-v' + offlineCacheV;

self.addEventListener('install', function(event) {

	var promises = [];

	promises.push(
		caches.open(offlineCacheName)
			.then(function(cache) {
				return cache.addAll(offlineCache);
			}).catch(function() {
			//catching any non 200 responses
		})
	);

	event.waitUntil(Promise.all(promises));
});



self.addEventListener('fetch', function(event) {
	if( event.request.url.startsWith(self.location.origin) && ! event.request.url.includes('/wp-admin') && ! event.request.url.includes('/wp-login') && event.request.method === 'GET' ){
		//page
		if ( (event.request.mode === 'navigate' ||  event.request.headers.get('accept').includes('text/html')) ) {
			event.respondWith(
				//if there's a non 200 response, take action and return the cached offline page.
				fetch(event.request).catch(function() {
					return caches.match(offlineURL);
				})
			);
			//asset
		} else if ( event.request.url.includes('/img/branding/metro-logo-black.svg') ){
			event.respondWith(caches.match(event.request)
				.then(function (response) {
					return response || fetch(event.request);
				})
			);
		}
	}

});

var scriptBase = self.location.origin === 'https://metro.co.uk'
	?	'https://www.dailymail.co.uk'
	: 'https://www.dailymailint.co.uk';
importScripts(scriptBase + '/api/web-push-notification/v1/static/latest/mol-fe-web-push-sw/sw.js');
