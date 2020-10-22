importScripts("https://assets.i-scmp.com/production/precache-manifest.9ed6edd6eee689310219f92bb72b023a.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");


/* eslint-disable lodash/prefer-lodash-method */

/* global workbox */
const isDebug = self.location.hostname !== 'www.scmp.com'

// Reads a list of URLs to precache from an externally defined variable, self.__precacheManifest.
// At build-time, Workbox injects code needed set self.__precacheManifest to the correct list of URLs.
try {
  workbox.precaching.precacheAndRoute(self.__precacheManifest)
} catch (err) {
  console.error(err)
}

/* Delete page and graphql cache */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        // eslint-disable-next-line lodash/prefer-lodash-method
        cacheNames.map(function (cacheName) {
          // eslint-disable-next-line lodash/prefer-lodash-method
          if (cacheName.startsWith('cache-pages') || cacheName.startsWith('graphql-results')) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// // Instructs the latest service worker to activate as soon as it enters the waiting phase
workbox.core.skipWaiting()

// // Instructs the latest service worker to take control of all clients as soon as it's activated.
workbox.core.clientsClaim()

// // Cache the Google Fonts webfont files with a cache first strategy for 1 year.
workbox.routing.registerRoute(
  /.*(?:googleapis|gstatic).*/,
  new workbox.strategies.CacheFirst({
    cacheName: 'google-assets',
    cacheExpiration: {
      maxEntries: 30,
      maxAgeSeconds: (1 * 60 * 60),
      purgeOnQuotaError: true,
    },
    cacheableResponse: {
      statuses: [0, 200],
    },
  })
)
// Cache the SCMP weather webfont files with a cache first strategy for 1 year.
workbox.routing.registerRoute(
  /.*(?:scmp-weather-icons).*/,
  new workbox.strategies.CacheFirst({
    cacheName: 'scmp-weather-icons',
    cacheExpiration: {
      maxEntries: 30,
      maxAgeSeconds: (1 * 60 * 60),
      purgeOnQuotaError: true,
    },
    cacheableResponse: {
      statuses: [0, 200],
    },
  })
)
self.addEventListener('fetch', event => {
  const clientUrl = event.request.referrer
  const pathName = clientUrl.replace(location.origin, '')
  if (pathName.startsWith('/scmp_comments') ||
    pathName.startsWith('/photos') || pathName.startsWith('/video') ||
    pathName.startsWith('/cooking') || pathName.startsWith('/sport/racing') ||
    pathName.startsWith('/sport/outdoor') || pathName.startsWith('/year-in-review') ||
    pathName.startsWith('/china-ai-report') || pathName.startsWith('/infographic') ||
    pathName.startsWith('/yp') || pathName.startsWith('/admin') ||
    pathName.startsWith('/core') || pathName.startsWith('/themes') ||
    pathName.startsWith('/api/feed')
  ) {
    return false
  }
})

// Set this to your tracking ID
const scriptURL = new URL(location)
const FIREBASE_API_KEY = scriptURL && scriptURL.href.includes('isDev') ? 'AIzaSyBBqdUTwUGIG16iit47ORy8YwN5CEDpgUI' : 'AIzaSyBCaqXdFS_WkMooIVppcw6ZFB76qjvba9I' // eslint-disable-line
const FIREBASE_AUTH_DOMAIN = scriptURL && scriptURL.href.includes('isDev') ? 'scmp-v4-1483944018736.firebaseapp.com' : 'scmp-162305.firebaseapp.com' // eslint-disable-line
const FIREBASE_PROJECT_ID = scriptURL && scriptURL.href.includes('isDev') ? 'scmp-v4-1483944018736' : 'scmp-162305'
const FIREBASE_STORAGE_BUCKET = scriptURL && scriptURL.href.includes('isDev') ? 'scmp-v4-1483944018736.appspot.com' : 'scmp-162305.appspot.com' // eslint-disable-line
const FIREBASE_MESSAGING_SENDER_ID = scriptURL && scriptURL.href.includes('isDev') ? '79414953154' : '162566681241' // eslint-disable-line
const FIREBASE_APP_ID = scriptURL && scriptURL.href.includes('isDev') ? '1:79414953154:web:5cf4f02b866c94c276675b' : '1:162566681241:web:4f43b73cf52abd5a51fe08' // eslint-disable-line
const GA_TRACKING_ID = scriptURL && scriptURL.href.includes('isDev') ? 'UA-6891676-56' : 'UA-6891676-72'

importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase.js') // eslint-disable-line
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js') // eslint-disable-line

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.notification && event.notification.data && event.notification.data.payload) { // eslint-disable-line
    const data = event.notification.data.payload
    sendAnalyticsEvent('Push Notification/Click to Open', 'Push Notification PWA', `${data.topic},${data.nid},${new Date()}`, scriptURL)
    const url = new URL(event.notification.data.payload.click_action)
    const path = `${url.href}?utm_source=firebase_pwa&utm_medium=push_notification&utm_campaign=article&utm_content=${data.nid}` // eslint-disable-line
    event.waitUntil(self.clients.openWindow(path))
  }
})

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({ // eslint-disable-line
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging() // eslint-disable-line
// [END initialize_firebase_in_sw]

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function (payload) {
  sendAnalyticsEvent('Push Notification/Received', 'Push Notification PWA', `${payload.data.topic},${payload.data.nid},${new Date()}`, scriptURL) // eslint-disable-line
  console.info('[firebase-messaging-sw.js] Received background message ', payload)

  // Customize notification here
  const notificationTitle = payload.data.title
  const notificationOptions = {
    icon: payload.data.icon,
    body: payload.data.body,
    data: {
      payload: payload.data,
    },
    tag: payload.data.nid,
  }
  return self.registration.showNotification(notificationTitle, notificationOptions)
})

// self.addEventListener('activate', function (event) {
//   event.waitUntil(
//     caches.keys().then(function (cacheNames) {
//       return Promise.all(
//         cacheNames.map(function (cacheName) {
//           return caches.delete(cacheName)
//         })
//       )
//     })
//   )
// })

// cache graphql
// const graphQLUrl = isDebug ? /http(s|):\/\/staging-apigw.product-web.dev-2.scmp.tech\/.*/ : /http(s|):\/\/apigw.scmp.com\/.*/
// workbox.routing.registerRoute(
//   graphQLUrl,
//   new workbox.strategies.NetworkFirst({
//     cacheName: 'graphql-results',
//     cacheExpiration: {
//       maxEntries: 100,
//       maxAgeSeconds: (24 * 60 * 60),
//       purgeOnQuotaError: true,
//     },
//     cacheableResponse: {
//       statuses: [0, 200],
//     },
//   })
// )

// Uncomment when finalise cdn image sizes
// workbox.routing.registerRoute(
//   /^http(s|):\/\/cdn.i-scmp.com\/.*\.(?:png|gif|jpg|jpeg|svg).*$/,
//   new workbox.strategies.NetworkFirst({
//     cacheName: 'cache-scmp-cdn-images',
//     cacheExpiration: {
//       maxEntries: 200,
//       maxAgeSeconds: 24 * 60 * 60 * 3,
//       purgeOnQuotaError: true
//     },
//     cacheableResponse: {
//       statuses: [0, 200, 304],
//     },
//   })
// )

if (isDebug) {
  workbox.routing.registerRoute(
    /http(s|):\/\/product-web-scmp-pwa-dev\.oss-cn-hongkong\.aliyuncs\.com\/.*/,
    new workbox.strategies.NetworkFirst({
      cacheName: 'cache-assets-oss',
      cacheExpiration: {
        maxEntries: 200,
        maxAgeSeconds: 24 * 60 * 60 * 3,
        purgeOnQuotaError: true,
      },
      cacheableResponse: {
        statuses: [0, 200, 304],
      },
    })
  )
}

// cache server assets
workbox.routing.registerRoute(
  /http(s|):\/\/assets\.i-scmp\.com\/.*/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'cache-assets',
    cacheExpiration: {
      maxEntries: 200,
      maxAgeSeconds: 24 * 60 * 60 * 3,
      purgeOnQuotaError: true,
    },
    cacheableResponse: {
      statuses: [0, 200, 304],
    },
  })
)

workbox.routing.registerRoute(
  /\.(jpg$|jpg\?|jpeg$|jpeg\?|png$|png\?|gif$|gif\?|svg$|svg\?)/,
  new workbox.strategies.CacheFirst({
    cacheName: 'cache-3rd-images',
    cacheExpiration: {
      maxEntries: 100,
      maxAgeSeconds: 24 * 60 * 60 * 30,
      purgeOnQuotaError: true,
    },
    cacheableResponse: {
      statuses: [0, 200, 304],
    },
  })
)

// workbox.routing.registerRoute(
//   ({ url }) => url.hostname === self.location.hostname,
//   new workbox.strategies.NetworkFirst({
//     cacheName: 'cache-pages',
//     cacheExpiration: {
//       maxEntries: 100,
//       maxAgeSeconds: 24 * 60 * 60 * 30,
//       purgeOnQuotaError: true,
//     },
//     cacheableResponse: {
//       statuses: [0, 200, 304],
//     },
//   })
// )

// cache gtm request when offlined
// const chartbeatQueue = new workbox.backgroundSync.Queue('chartbeatQueue')
// workbox.routing.registerRoute(/https:\/\/ping.chartbeat.net\/.*/,
//   workbox.strategies.networkOnly({
//     plugins: [{
//       fetchDidFail: async ({request}) => {
//         await chartbeatQueue.addRequest(request)
//       },
//     }],
//   }),
// )

// cache facebook pixel request when offlined
// const facebookPixelQueue = new workbox.backgroundSync.Queue('facebookPixelQueue')
// workbox.routing.registerRoute(/https:\/\/www.facebook.com\/tr.*/,
//   workbox.strategies.networkOnly({
//     plugins: [{
//       fetchDidFail: async ({request}) => {
//         await facebookPixelQueue.addRequest(request)
//       },
//     }],
//   }),
// )

// cache ga request when offlined
// const googleAnalyticsQueue = new workbox.backgroundSync.Queue('googleAnalyticsQueue')
// workbox.routing.registerRoute(/https:\/\/www.(google-analytics|googletagmanager|googleadservices).com\/.*/,
//   workbox.strategies.networkOnly({
//     plugins: [{
//       fetchDidFail: async ({request}) => {
//         await googleAnalyticsQueue.addRequest(request)
//       },
//     }],
//   }),
// )

// cache ga ads queue request when offlined
// const googleadsQueue = new workbox.backgroundSync.Queue('googleadsQueue')
// workbox.routing.registerRoute(/https:\/\/googleads.g.doubleclick.net\/.*/,
//   workbox.strategies.networkOnly({
//     plugins: [{
//       fetchDidFail: async ({request}) => {
//         await googleadsQueue.addRequest(request)
//       },
//     }],
//   }),
// )

// cache twotter request when offlined
// const twitterQueue = new workbox.backgroundSync.Queue('twitterQueue')
// workbox.routing.registerRoute(/https:\/\/.*twitter.*/,
//   workbox.strategies.networkOnly({
//     plugins: [{
//       fetchDidFail: async ({request}) => {
//         await twitterQueue.addRequest(request)
//       },
//     }],
//   }),
// )

// cache adsrvr insight request when offlined
// const insightQueue = new workbox.backgroundSync.Queue('insightQueue')
// workbox.routing.registerRoute(/https:\/\/insight.adsrvr.org\/.*/,
//   workbox.strategies.networkOnly({
//     plugins: [{
//       fetchDidFail: async ({request}) => {
//         await insightQueue.addRequest(request)
//       },
//     }],
//   }),
// )

function sendAnalyticsEvent (eventAction, eventCategory, eventLabel, extraPayload) {
  'use strict'

  if (!GA_TRACKING_ID) {
    // We want this to be a safe method, so avoid throwing unless absolutely necessary.
    return Promise.resolve()
  }

  if (!eventAction && !eventCategory) {
    // We want this to be a safe method, so avoid throwing unless absolutely necessary.
    return Promise.resolve()
  }

  return self.registration.pushManager.getSubscription()
    .then(function (subscription) {
      if (subscription === null) {
        throw new Error('No subscription currently available.')
      }

      // Create hit data
      const payloadData = {
        // Version Number
        v: 1,
        // Client ID
        cid: subscription.endpoint,
        // Tracking ID
        tid: GA_TRACKING_ID,
        // Hit Type
        t: 'event',
        // Event Category
        ec: eventCategory,
        // Event Action
        ea: eventAction,
        // Event Label
        el: eventLabel,
      }

      if (typeof extraPayload.hostname !== 'undefined') payloadData.dh = extraPayload.hostname // eslint-disable-line
      if (typeof extraPayload.origin !== 'undefined') payloadData.dl = extraPayload.origin // eslint-disable-line

      // Format hit data into URI
      console.log('payloadData', payloadData)
      const payloadString = Object.keys(payloadData)
        .map(function (analyticsKey) {
          return analyticsKey + '=' + encodeURIComponent(payloadData[analyticsKey])
        })
        .join('&')

      // Post to Google Analytics endpoint
      return fetch('https://www.google-analytics.com/collect', {
        method: 'post',
        body: payloadString,
      })
    })
    .then(function (response) {
      if (!response.ok) {
        return response.text()
          .then(function (responseText) {
            throw new Error(
              'Bad response from Google Analytics:\n' + response.status
            )
          })
      } else {
        console.log(`${eventCategory}: ${eventAction} hit sent, check the Analytics dashboard, ${extraPayload}`)
      }
    })
    .catch(function (err) {
      console.warn('Unable to send the analytics event', err)
    })
}

