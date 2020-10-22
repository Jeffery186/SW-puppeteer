// Prod airship config

// 86acbd31cd7c09cf30acb66d2fbedc91daa48b86:1559154665.27
importScripts('https://aswpsdkus.com/notify/v1/ua-sdk.min.js')
uaSetup.worker(self, {
  defaultIcon: 'https://s3.amazonaws.com/com.urbanairship.appicons/8S2Xb7NvSCyRq7j59BglFw/icon.PNG',
  defaultTitle: 'GameSpot',
  defaultActionURL: 'https://www.gamespot.com',
  appKey: '8S2Xb7NvSCyRq7j59BglFw',
  token: 'MTo4UzJYYjdOdlNDeVJxN2o1OUJnbEZ3OnlIZUsyVVF3bzF2RVl2c0NDajNJb0w4UTZKSEEtZTQtalFTZkRQMzRuUzA',
  vapidPublicKey: 'BGvvu-r4pqIhnpzAhFo7MWLGslOlUVrqKMiM-r8QpidHy6Ueuflj9Af5OPp0NrM53f_FFUq00Fniuvv83vLr93I='
})

// DO NOT REMOVE THIS SECTION:
// QA Box airship config (uncomment this when we do airship testing)
// (please test that on this QA: testpush.qa.gamespot.com)

// 86acbd31cd7c09cf30acb66d2fbedc91daa48b86:1592417130.9335413
// importScripts('https://aswpsdkus.com/notify/v1/ua-sdk.min.js')
// uaSetup.worker(self, {
//   defaultIcon: 'https://s3.amazonaws.com/com.urbanairship.appicons/8S2Xb7NvSCyRq7j59BglFw/icon.PNG',
//   defaultTitle: 'GameSpot',
//   defaultActionURL: 'https://testpush.qa.gamespot.com',
//   appKey: 'ofQ5ofP8QAiC93NS82GkLA',
//   vapidPublicKey: 'BFN2xSIkZAIFcMFiOuRnD-cU3sc3uqrx3jYcOjrALkvJQ6wPLA9xCJA9K2x6XVGMBftI7FZH2xWQJfvzs62nTPg=',
//   token: 'MTo4UzJYYjdOdlNDeVJxN2o1OUJnbEZ3OnlIZUsyVVF3bzF2RVl2c0NDajNJb0w4UTZKSEEtZTQtalFTZkRQMzRuUzA'
// })

const worker = this;

/**
 * Generic utilities
 *
 * @class Utils
 */
class Utils {
  /**
   * Wrapper for the standard console methods with added formatting.
   *
   * @method log
   */
  static log() {
    const method = arguments[0];
    const args =  [].slice.call(arguments, 1);
    args.unshift('%c ServiceWorker ', 'color:#FFF;border-radius:3px;background-color:#B80000;');
    console[method].apply(console, args);
  }

  /**
   * Creates an indexedDB database to temporarily store push notification payload data.
   *
   * @method createDB
   */
  static createDB(payload) {
    if("indexedDB" in self) {

      let openRequest = indexedDB.open("notifications", 1);

      // create notifications database without version checks
      openRequest.onupgradeneeded = function() {
        let db = openRequest.result;
        if (!db.objectStoreNames.contains('items')) {
          let notificationItems = db.createObjectStore('items', {autoIncrement:true});
          let request = notificationItems.add(payload);
        }
      };

      //notifications database already exists
      openRequest.onsuccess = function() {
        let db = openRequest.result;
        if (db.objectStoreNames.contains('items')) {
          db.transaction(["items"], 'readwrite').objectStore("items").add(payload).onsuccess = function(event) {
            Utils.log("info", 'ADDED TO TABLE');
          };
        }
      };

    } else {
      Utils.log("info", "IndexedDB not supported");
    }
  }
}

/**
 * Map of all service worker events that are to be registered.
 *
 * @type {Map} events
 */

const events = new Map([

  /**
   * @method notificationclick
   */
  ['notificationclick', function(event) {
    const notification = event.notification;
    const payload = event.notification.data;
    const sendId = payload.send_id;
    Utils.log("info", payload);
    Utils.createDB(sendId);
  }]
]);


/**
 *  Add all event listeners
 */
events.forEach(function(eventHandler, eventName) {
  worker.addEventListener(eventName, eventHandler.bind(worker));
});
