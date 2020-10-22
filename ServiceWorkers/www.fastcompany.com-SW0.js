'use strict';

/*
//JSON format for PostUp Push News Alert
{
"title": "[-Subject-]", 
"body": "[-Text-]",
"url": "[-URL-]",
"icon": "[-Image-]"
}
*/

const swversion = 'v1.6';
const CONSOLE_LOG_ON = true;

var onClickURL; 

function swLogConsole(msg) {
	if(CONSOLE_LOG_ON) {
		console.log('[PostUp Service Worker ' + swversion + '] ', msg);
	}
}

swLogConsole('registering');

self.addEventListener('activate', function(event) {
	swLogConsole('Activated');
});

self.addEventListener('install', function(event) {
	swLogConsole('Installed');
});

self.addEventListener('push', function(event) {
	swLogConsole('Push Received');
	swLogConsole(event);
	swLogConsole(event.data.text());

	const optionParams = JSON.parse(event.data.text());

	const title = optionParams.title;
	const options = {
		body: optionParams.body,
		icon: optionParams.icon,
	};

	if(typeof optionParams.requireInteraction == 'boolean') {
		swLogConsole('Push notification using requireInteraction: ' + optionParams.requireInteraction);
		options.requireInteraction = optionParams.requireInteraction;
	}
	
	if(typeof optionParams.badge == 'string' && optionParams.badge) {
		swLogConsole('Push notification using badge: ' + optionParams.badge);
		options.badge = optionParams.badge;
	}
	
	onClickURL = optionParams.url;
	
	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
	swLogConsole('NotificationClick Received');
	swLogConsole(event);

	event.notification.close();

	if(onClickURL) {
		event.waitUntil(
			clients.openWindow(onClickURL)
		);
	} else {
		swLogConsole('No URL in notification for click');
	}
});
