importScripts('/project_data/firebase-config.js');
importScripts('/project_data/vars.js');
importScripts('/js/firebase/firebase-app.js');
importScripts('/js/firebase/firebase-messaging.js');
importScripts('/js/sw/analytics.js');

self.analytics.trackingId = trackingId;

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload['title'];
  const notificationOptions = {
    body: payload['body'],
    icon: payload['icon']
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('push', function(event) {
  const data = event.data.json();
  let url = 'url unknown';
  if (data.hasOwnProperty('notification') && data.notification.hasOwnProperty('click_action')) {
    url = data.notification.click_action;
  }
  event.waitUntil(
    self.analytics.trackEvent('Pushes showed', url)
  );
});
