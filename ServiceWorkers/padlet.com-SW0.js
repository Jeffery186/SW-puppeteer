// Cache related tasks
const cacheServiceworkerChunksPaths = ["https://padlet.net/packs/js/runtime~service_worker_cache-db405ba63b1e27774a2b.js", "https://padlet.net/packs/js/service_worker_cache-03622793060586787383.chunk.js"]
for (let i = 0; i < cacheServiceworkerChunksPaths.length; ++i) {
  importScripts(cacheServiceworkerChunksPaths[i])
}

// Notifications related tasks
if (self.registration.pushManager) {
  const notifServiceworkerChunksPaths = ["https://padlet.net/packs/js/runtime~service_worker_notification-59c861f20bc7684f2ef5.js", "https://padlet.net/packs/js/service_worker_notification-f0fe49cc776bcbcfcb75.chunk.js"]
  for (let i = 0; i < notifServiceworkerChunksPaths.length; ++i) {
    importScripts(notifServiceworkerChunksPaths[i])
  }
}
