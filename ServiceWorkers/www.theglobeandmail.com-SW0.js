// Font caching groups
var cash = {
  font: "tgam.arc.fonts.v" + 2 // increment when files are changed
};

// Cache the fonts when SW is initially installed (once)
self.addEventListener("install", function listen(event) {
  event.waitUntil(
    caches.open(cash.font).then(function add(cache) {
      return cache.addAll([
        "/pb/resources/assets/panther/fonts/Pratt.woff2",
        "/pb/resources/assets/panther/fonts/Pratt-Italic.woff2",
        "/pb/resources/assets/panther/fonts/Pratt-Bold.woff2",
        "/pb/resources/assets/panther/fonts/Pratt-BoldItalic.woff2",
        "/pb/resources/assets/panther/fonts/GMsanC-Regular.woff2",
        "/pb/resources/assets/panther/fonts/GMsanC-Bold.woff2"
      ])
        .catch(function error(e) {
          console.info("[Service Worker] cache.addAll failed:", e);
        });
    })
  );
  return self.skipWaiting();
});

// Process all fetch requests, to check for cached response.
// See https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Custom_responses_to_requests
self.addEventListener("fetch", function listen(event) {
  // We only want to intercept requests going to TGAM assets, exclude external requests.
  if (event.request.url.indexOf("/pb/resources/assets/") !== -1) {
    event.respondWith(
      caches.match(event.request).then(function get(resp) {
        return resp || fetch(event.request)
          .catch(function error() {
            // Don't re-throw. Swallow JS console error: Uncaught (in promise) TypeError: Failed to fetch
            // The error will still show up in the console, but not display a duplicate error for this SW.
          });
      })
    );
  }
});

// Delete all caches that aren't on the whitelist.
// Remember that caches are shared across the whole origin, between all TGAM service workers.
self.addEventListener("activate", function listen(event) {
  var whitelist = Object.keys(cash).map(function k(key) {
    return cash[key];
  });
  // console.log("[Service Worker] cache whitelist: ", whitelist);
  event.waitUntil(
    caches.keys().then(function all(keyList) {
      return Promise.all(keyList.map(function each(key) {
        if (whitelist.indexOf(key) === -1) {
          return caches.delete(key).catch(function error() {
            // Nothing - no penalty for trying to delete a non-existent item from cache.
          });
        }
      }));
    })
  );
});
// End font caching
