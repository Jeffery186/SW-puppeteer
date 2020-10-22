self.addEventListener('push', function (event) {
  var options = JSON.parse(event.data.text());
  console.log(options);
  event.waitUntil(self.registration.showNotification(options.title,
    {
      body: options.body,
      icon: options.icon,
      image: options.image,
      data: {
        url: options.clickUrl
      }
    }))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  )
})
