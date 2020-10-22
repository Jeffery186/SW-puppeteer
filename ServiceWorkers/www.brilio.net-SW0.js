importScripts("https://www.gstatic.com/firebasejs/4.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.2.0/firebase-messaging.js");


// Initialize Firebase Cloud Messaging
var config = {
	"apiKey"			: "AIzaSyBpTvt-hRdY3-HfWsZkJbFcgk7w643Zie4",
	"authDomain"		: "asrak-d5e6e.firebaseapp.com",
	"databaseURL"		: "https://asrak-d5e6e.firebaseio.com",
	"storageBucket"		: "asrak-d5e6e.appspot.com",
	"messagingSenderId"	: "993486007939"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

self.addEventListener('notificationclick', function(e) {
	var href = e.notification.data.click_action;

	e.notification.close();

	clients.openWindow(href);
});

// Background
messaging.setBackgroundMessageHandler(function(payload) {
	var notification = payload.data;
    
  	return self.registration.showNotification(notification.title, {
        icon: notification.icon,
        body: notification.body,
        data: notification,
    });;
});