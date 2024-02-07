/// <reference lib="webworker" />
const sw = self as unknown as ServiceWorkerGlobalScope;
// Override the "self" variable

//todo => run >> tsc public/sw.ts --watch

const STATIC_ASSETS_NAME = "static-files-v" + 1;
const DYNAMIC_ASSETS_NAME = "dynamic-files-v" + 1;
// const IDB_VERSION = 1;

const STATIC_FILES = [
  "/",
  "/index.html",
  "/offline.html",
  "/icons/add-post.svg",
  "/logo/icon-192x192.png",
  "/logo/icon-256x256.png",
  "/logo/icon-384x384.png",
  "/logo/icon-512x512.png",
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
  "/src/fonts/woff/IRANYekanX-Black.woff",
  "/src/fonts/woff/IRANYekanX-Bold.woff",
  "/src/fonts/woff/IRANYekanX-DemiBild.woff",
  "/src/fonts/woff/IRANYekanX-ExtraBlack.woff",
  "/src/fonts/woff/IRANYekanX-ExtraBold.woff",
  "/src/fonts/woff/IRANYekanX-Heavy.woff",
  "/src/fonts/woff/IRANYekanX-Light.woff",
  "/src/fonts/woff/IRANYekanX-Medium.woff",
  "/src/fonts/woff/IRANYekanX-Regular.woff",
  "/src/fonts/woff/IRANYekanX-Thin.woff",
  "/src/fonts/woff/IRANYekanX-UltraLight.woff",
  "/src/fonts/woff2/IRANYekanX-Black.woff2",
  "/src/fonts/woff2/IRANYekanX-Bold.woff2",
  "/src/fonts/woff2/IRANYekanX-DemiBild.woff2",
  "/src/fonts/woff2/IRANYekanX-ExtraBlack.woff2",
  "/src/fonts/woff2/IRANYekanX-ExtraBold.woff2",
  "/src/fonts/woff2/IRANYekanX-Heavy.woff2",
  "/src/fonts/woff2/IRANYekanX-Light.woff2",
  "/src/fonts/woff2/IRANYekanX-Medium.woff2",
  "/src/fonts/woff2/IRANYekanX-Regular.woff2",
  "/src/fonts/woff2/IRANYekanX-Thin.woff2",
  "/src/fonts/woff2/IRANYekanX-UltraLight.woff2",
];

// enum IDBStores {
//   USERS = "users",
//   CURRENT_USER = "current-user",
// }

// function openIDB() {
//   const req = indexedDB.open("Dynamic-JSON", IDB_VERSION);

//   req.onupgradeneeded = (event) => {
//     let IDB = (event.target as IDBOpenDBRequest).result;

//     if (!IDB.objectStoreNames.contains(IDBStores.USERS)) {
//       IDB.createObjectStore(IDBStores.USERS, {
//         keyPath: "$id",
//       });
//     }

//     if (!IDB.objectStoreNames.contains(IDBStores.CURRENT_USER)) {
//       IDB.createObjectStore(IDBStores.CURRENT_USER, {
//         keyPath: "$id",
//       });
//     }
//   };
// }

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
  // openIDB();
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
  if (isRequestFromCacheAssets(event.request.url, STATIC_FILES)) {
    event.respondWith(caches.match(event.request) as PromiseLike<Response>);
    // } else if (isRequestingMedia(event.request.url)) {
    // event.respondWith(fetch(event.request));
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          (fetch(event.request)
            .then((networkResponse) => {
              return caches.open(DYNAMIC_ASSETS_NAME).then((cache) => {
                cache
                  .put(event.request, networkResponse.clone())
                  .catch(() => {});
                return networkResponse;
              });
            })
            .catch(() => {
              return caches.open(STATIC_ASSETS_NAME).then((cache) => {
                return cache.match("/offline.html");
              });
            }) as PromiseLike<Response>)
        );
      })
    );
  }
});

//
//
//

//! Utility functions
function isRequestFromCacheAssets(url: string, urls: string[]) {
  return urls.some(
    (text) => text === url || (url.indexOf(text) > -1 && text !== "/")
  );
}

function isRequestingMedia(URL: string) {
  return URL.indexOf("/storage/buckets/657de8268e00d19b91c2/") !== -1;
}
