/// <reference lib="webworker" />
const sw = self as unknown as ServiceWorkerGlobalScope;
// Override the "self" variable

//todo => run >> tsc public/sw.ts --watch

const STATIC_ASSETS_NAME = "static-files-v" + 6;
const DYNAMIC_ASSETS_NAME = "dynamic-files-v" + 4;

const STATIC_FILES = [
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
sw.addEventListener("install", (event) => {
  sw.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_ASSETS_NAME).then((cache) => {
      return cache.addAll(STATIC_FILES);
    })
  );
});

//! Activate Event:
sw.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== STATIC_ASSETS_NAME && key !== DYNAMIC_ASSETS_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  return sw.clients.claim();
});

//! Fetch Event:
sw.addEventListener("fetch", (event) => {
  if (isRequestingStaticFiles(event.request.url, STATIC_FILES)) {
    event.respondWith(caches.match(event.request) as PromiseLike<Response>);
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          (fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              return caches.open(DYNAMIC_ASSETS_NAME).then((cache) => {
                //
                const contentType = networkResponse.headers.get("Content-Type");
                if (isToBeCached(contentType)) {
                  cache.put(event.request, networkResponse.clone());
                }

                return networkResponse;
              });
            } else {
              return networkResponse;
            }
          }) as PromiseLike<Response>)
          // .catch(() => {
          //   console.log("CATCH CALL OF SERVICE WORKER");
          //   return caches.open(STATIC_ASSETS_NAME).then((cache) => {
          //     console.log(cache.match("/offline.html"));
          //     return cache.match("/offline.html");
          //   });
          // })
        );
      })
    );
  }
});

//
//
//

//! Utility functions
function isRequestingStaticFiles(url: string, urls: string[]) {
  return urls.some(
    (text) => text === url || (url.indexOf(text) > -1 && text !== "/")
  );
}

function isRequestingMedia(URL: string) {
  return URL.includes("/storage/buckets/657de8268e00d19b91c2/");
}

const ALLOWED_CONTENT_TYPES = [
  "text/javascript",
  "text/css",
  "text/html",
  "text/plain",
  "application/javascript",
  "font/woff",
];

function isToBeCached(content: string | null) {
  if (!content) return false;
  return ALLOWED_CONTENT_TYPES.some((contentType) =>
    content.includes(contentType)
  );
}
