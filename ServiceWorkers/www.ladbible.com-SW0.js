self.addEventListener('push', (event) => {
  console.log("PUSH LISTENER UPDATE");
  if (event.data) {
    const {
      title = "LADbible title notification",
      url = "https://www.ladbible.com",
      body = "click here for the latest",
      icon = "https://pbs.twimg.com/profile_images/841982132981497856/egozMVKe_400x400.jpg",
      image = "https://upload.wikimedia.org/wikipedia/commons/c/cf/Official_LADbible_Logo.png"
    } = event.data.json();
    
    const options = {
      body,
      icon,
      image,
      data: { url }
    };
    const promiseChain = self.registration.showNotification(title, options);
    event.waitUntil(promiseChain);
  } else {
    console.log('This push event has no data.');
  }
});

self.addEventListener('notificationclick', (event) => {
  const source = 'web';
  const medium = 'push_notification';
  const camapign = 'web_push_notification';
  const url = `${event.notification.data.url}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${camapign}`;
  self.clients.openWindow(url);
  event.notification.close();
});
