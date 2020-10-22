
importScripts('static/js/analytics-helper.js');

const version = '4.0.'+new Date().getUTCDate();
const CACHE_NAME = 'ndtv-pwa-live-v0-'+version;
const CACHE_FILES = ['/','/offline.html'];
const CACHE_HOSTS = ['www.ndtv.com','cdn.ndtv.com','localhost'];

this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_FILES);
    })
  );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match('/offline.html');
        return cachedResponse;
      }
    })());
  }
});

/*
self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    //console.log('fetch:'+url);
    
    if(!navigator.onLine){
        //console.log('offline');
        event.respondWith(
            caches.match(event.request).then(function(response) {
              return response || fetch('/offline.html');
            }));
        //offline message
    }else if (event.request.method === 'GET' && CACHE_HOSTS.indexOf(url.hostname) !== -1) {
        //   console.log('URL HOSTNAME' + url.hostname)
        if (CACHE_HOSTS.indexOf(url.hostname) !== -1) {
            //console.log('GET');
            event.respondWith(
                caches.open(CACHE_NAME).then(function(cache) {
                  return fetch(event.request).then(function(response) {
                    cache.put(event.request, response.clone());
                    return response;
                  });
                })
            );
        }
    }
});
*/
self.addEventListener('notificationclose', function(e) {
  e.waitUntil(
    sendAnalyticsEvent(e.notification.data.url, 'notification-close')
  );
});

// The user has clicked on the notification ...
self.addEventListener('notificationclick', function (event) {
    //console.log(event.notification.data.url);
    event.notification.close();
    event.waitUntil( Promise.all([
      clients.matchAll({
            type: "window"
      })
      .then(function (clientList) {
          for (var i = 0; i < clientList.length; i++) {
              var client = clientList[i];
              if (client.url == '/' && 'focus' in client)
                  return client.focus();
          }
          if (clients.openWindow) {
              return clients.openWindow(event.notification.data.url);
          }
      }),
      sendAnalyticsEvent(event.notification.data.url, 'notification-click')
      ])
    );
});


function initalizeDB() {
    return idbKeyval.vals().then(function(vals) {
        if (vals.length <= 0) {
            //showNotification('ndtv', 'news');
        } else {
            var oldkey = vals.some(function (el) {return el.val === 'ndtv-news';});
            var newkey = vals.some(function (el) {return el.val === 'news-ndtv';});
            if(newkey && oldkey){
                idbKeyval.delete('ndtv-news');
            }
            for (var i = 0; i < vals.length; i++) {
                showNotification(vals[i].id, vals[i].type)
            }
        }
    }).catch(function(reason) {console.log('initalizeDB Err,'+reason);});
}

function showNotification(id, type) {
    var API = 'https://alerts.ndtv.com/alerts/';
    if (type == 'news' || type == 'ndtv') {
        API += 'alerts.json';
    } else if (type == 'profit' || type == 'ndtvtamil' || type == 'ndtvbengali') {
        API += type + '-alerts.json';
    } else if (type == 'profit') {
        API += type + '-alerts.json';
    } else if (type == 'liveblog') {
        API += 'liveblog-' + id + '.json';
    } else if (type == 'election') {
        API += 'elections2017-alerts.json';
    }
    //API = 'http://localhost/awani_extra/abp/json.php?url='+API;
    fetch(API + '?' + Math.round(+new Date() / 1000)).then(function (response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
            throw new Error();
        }

        // Examine the text in the response  
        return response.json().then(function (data) {
            if (data.error || !data.notification) {
                console.log('The API returned an error.', data.error);
                throw new Error();
            }
            if (type == 'election') {
                data.notification = data.notification[id].en;
            }
            console.log('server pushed : ' + data.notification.message);
            idbKeyval.get(id + '-' + type).then(function(val) {
                var lastId = typeof val !== 'undefined' ? val.lastId : '';
                if (lastId === data.notification.message) {
                    console.log('Already sent the notification: ' + data.notification.message);
                    return  true;
                }else{
                    idbKeyval.set(id + '-' + type, {val: id + '-' + type, id: id, type: type, lastId: data.notification.message});
                    Promise.all([
                      showActualMessage(data),
                      sendAnalyticsEvent(data.notification.url, 'notification-received')
                    ]);
                }
            }).catch(function(reason) {console.log('HMM err, '+reason)});
        });
    }).catch(function (err) {
        console.log('Unable to retrieve data, params:id:' + id + ',type:' + type, ',API:' + API, err);
    });
    return true;
}

self.addEventListener('push', function (event) {
    event.waitUntil(
        initalizeDB()
    );
});

(function() {
  'use strict';
  var dbName = 'ndtvNotify', dbTable = 'settings', dbVersion = 1, db;

  function getDB() {
    if (!db) {
      db = new Promise(function(resolve, reject) {
        var openreq = indexedDB.open(dbName, dbVersion);

        openreq.onerror = function() {
          reject(openreq.error);
        };

        openreq.onupgradeneeded = function() {
          // First time setup: create an empty object store
          openreq.result.createObjectStore(dbTable,{keyPath: 'val'});
        };

        openreq.onsuccess = function() {
          resolve(openreq.result);
        };
      });
    }
    return db;
  }

  function withStore(type, callback) {
    return getDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var transaction = db.transaction(dbTable, type);
        transaction.oncomplete = function() {
          resolve();
        };
        transaction.onerror = function() {
          reject(transaction.error);
        };
        callback(transaction.objectStore(dbTable));
      });
    });
  }

  var idbKeyval = {
    get: function(key) {
      var req;
      return withStore('readonly', function(store) {
        req = store.get(key);
      }).then(function() {
        return req.result;
      });
    },
    set: function(key, value) {
      return withStore('readwrite', function(store) {
        store.put(value);
      });
    },
    delete: function(key) {
      return withStore('readwrite', function(store) {
        store.delete(key);
      });
    },
    clear: function() {
      return withStore('readwrite', function(store) {
        store.clear();
      });
    },
    keys: function() {
      var keys = [];
      return withStore('readonly', function(store) {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function() {
          if (!this.result) return;
          keys.push(this.result.key);
          this.result.continue();
        };
      }).then(function() {
        return keys;
      });
    },
    vals: function() {
      var vals = [];
      return withStore('readonly', function(store) {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openCursor).call(store).onsuccess = function() {
          if (!this.result) return;
          vals.push(this.result.value);
          this.result.continue();
        };
      }).then(function() {
        return vals;
      });
    }
  };

  if (typeof module != 'undefined' && module.exports) {
    module.exports = idbKeyval;
  } else if (typeof define === 'function' && define.amd) {
    define('idbKeyval', [], function() {
      return idbKeyval;
    });
  } else {
    self.idbKeyval = idbKeyval;
  }
}());

function showActualMessage(data){
    return self.registration.showNotification(data.notification.title, {
        body: data.notification.message,
        icon: data.notification.icon,
        vibrate: [300, 100, 400],
        image: data.notification.image,
        tag: data.notification.tag,
        requireInteraction: true,
        data: {
            url: data.notification.url
        },
        actions: [
            {action: 'readmore', title: (data.notification.dpl=='1'?'Read more':'Visit NDTV.com'), icon: 'https://alerts.ndtv.com/images/ndtv.png'}
        ]
    });
}