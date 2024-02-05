/// <reference lib="webworker" />
var sw = self;
// Override the "self" variable
//todo => run >> tsc public/sw.ts --watch
var STATIC_ASSETS = "static-data-v" + 4;
var STATIC_FILES = [
    "/",
    "/index.html",
    "/icons/add-post.svg",
    "/icons/arrow.png",
    "/icons/back.svg",
    "/icons/bookmark.svg",
    "/icons/chat.svg",
    "/icons/comment.svg",
    "/icons/delete.svg",
    "/icons/editerror.svg",
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
function isRequestAlreadyCached(url, urls) {
    return urls.some(function (text) { return text === url || (url.indexOf(text) > -1 && text !== "/"); });
}
//! Install Event:
sw.addEventListener("install", function (event) {
    sw.skipWaiting();
    event.waitUntil(caches.open(STATIC_ASSETS).then(function (cache) {
        return cache.addAll(STATIC_FILES);
    }));
});
//! Activate Event:
sw.addEventListener("activate", function (event) {
    event.waitUntil(caches.keys().then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
            if (key !== STATIC_ASSETS) {
                return caches.delete(key);
            }
        }));
    }));
    return sw.clients.claim();
});
//! Fetch Event:
sw.addEventListener("fetch", function (event) {
    if (isRequestAlreadyCached(event.request.url, STATIC_FILES)) {
        event.respondWith(caches.match(event.request));
    }
    else {
        event.respondWith(fetch(event.request));
    }
});
