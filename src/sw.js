const Version = "Mycelium-v0.0.0";

self.addEventListener("install", event => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
                "/",
                "index.html",
                "manifest.json"
            ]);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
		caches.keys().then(keys => {
			Promise.all(
				keys.map(key => {
					if (![cacheName].includes(key)) {
						return caches.delete(key);
					}
				})
			)
		})
	);
});

self.addEventListener("fetch", event => {
	event.respondWith(
		caches.open(cacheName).then(cache => {
			return cache.match(event.request).then(response => {
				return response || fetch(event.request).then(networkResponse => {
					cache.put(event.request, networkResponse.clone());
					return networkResponse;
				});
			})
		})
	);
});
