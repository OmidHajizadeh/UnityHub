/// <reference lib="webworker" />
var sw = self;
// Override the "self" variable
//todo => run >> tsc public/sw.ts --watch
var STATIC_ASSETS_NAME = "static-files-v" + 6;
var DYNAMIC_ASSETS_NAME = "dynamic-files-v" + 4;
var STATIC_FILES = [
    "/",
    "/index.html",
    "/offline.html",
    "/icons/add-post.svg",
    "/icons/arrow.png",
    "/icons/back.svg",
    "/icons/bookmark.svg",
    "/icons/chat.svg",
    "/icons/comment.svg",
    "/icons/delete.svg",
    "/icons/edit.svg",
    "/icons/error.svg",
    "/icons/file-upload.svg",
    "/icons/filter.svg",
    "/icons/follow.svg",
    "/icons/gallery-add.svg",
    "/icons/home.svg",
    "/icons/like.svg",
    "/icons/liked.svg",
    "/icons/loader.svg",
    "/icons/logout.svg",
    "/icons/muted.svg",
    "/icons/notification.svg",
    "/icons/people.svg",
    "/icons/play.svg",
    "/icons/posts.svg",
    "/icons/profile-placeholder.svg",
    "/icons/save.svg",
    "/icons/saved.svg",
    "/icons/search.svg",
    "/icons/share.svg",
    "/icons/unmuted.svg",
    "/icons/video.svg",
    "/icons/wallpaper.svg",
    "/images/auth-bg.webp",
    "/images/icon.svg",
    "/images/logo.svg",
    "/src/globals.css",
    "/src/fonts/fontiran.css",
];
//! Install Event:
sw.addEventListener("install", function (event) {
    sw.skipWaiting();
    event.waitUntil(caches.open(STATIC_ASSETS_NAME).then(function (cache) {
        return cache.addAll(STATIC_FILES);
    }));
});
//! Activate Event:
sw.addEventListener("activate", function (event) {
    event.waitUntil(caches.keys().then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
            if (key !== STATIC_ASSETS_NAME && key !== DYNAMIC_ASSETS_NAME) {
                return caches.delete(key);
            }
        }));
    }));
    return sw.clients.claim();
});
//! Fetch Event:
sw.addEventListener("fetch", function (event) {
    if (isRequestingStaticFiles(event.request.url, STATIC_FILES)) {
        event.respondWith(caches.match(event.request));
    }
    else {
        event.respondWith(caches.match(event.request).then(function (cachedResponse) {
            return (cachedResponse ||
                fetch(event.request).then(function (networkResponse) {
                    if (networkResponse.ok) {
                        return caches.open(DYNAMIC_ASSETS_NAME).then(function (cache) {
                            //
                            var contentType = networkResponse.headers.get("Content-Type");
                            if (isToBeCached(contentType)) {
                                cache.put(event.request, networkResponse.clone());
                            }
                            return networkResponse;
                        });
                    }
                    else {
                        return networkResponse;
                    }
                })
            // .catch(() => {
            //   console.log("CATCH CALL OF SERVICE WORKER");
            //   return caches.open(STATIC_ASSETS_NAME).then((cache) => {
            //     console.log(cache.match("/offline.html"));
            //     return cache.match("/offline.html");
            //   });
            // })
            );
        }));
    }
});
//
//
//
//! Utility functions
function isRequestingStaticFiles(url, urls) {
    return urls.some(function (text) { return text === url || (url.indexOf(text) > -1 && text !== "/"); });
}
function isRequestingMedia(URL) {
    return URL.includes("/storage/buckets/657de8268e00d19b91c2/");
}
var ALLOWED_CONTENT_TYPES = [
    "text/javascript",
    "text/css",
    "text/html",
    "text/plain",
    "application/javascript",
    "font/woff",
];
function isToBeCached(content) {
    if (!content)
        return false;
    return ALLOWED_CONTENT_TYPES.some(function (contentType) {
        return content.includes(contentType);
    });
}
