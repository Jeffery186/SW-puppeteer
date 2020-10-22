// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/6.5.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/6.5.0/firebase-messaging.js')

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
var config = {
    messagingSenderId: "765137232789"
};
firebase.initializeApp(config);

// Retrieve an instance of Firebase Data Messaging so that it can handle background messages.
const messaging = firebase.messaging()
messaging.setBackgroundMessageHandler(function(payload) {
  console.log(payload);
  const notificationTitle = 'Data Message Title';
  const notificationOptions = {
    body: 'Data Message body AA',
    icon: 'alarm.png'
  };
  
  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});