const cacheName = 'demo/v1';
const cacheList = ["./src/download.jpeg"];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheList)
    }).catch((error) => {
      console.log("getting error while connecting with the cache storage", error);
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheList => {
      cacheList.map(cache => {
        if (cacheName !== cache) {
          return caches.delete(cache);
        }
      })
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        console.log("response from server")
        return response;
      })
      .catch(error => {
        return caches.match(event.request).then(response => {
          console.log("response from cache", response);
          return response
        });
      })
  );
})