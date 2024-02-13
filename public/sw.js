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
    "/assets/IRANYekanX-Thin-zjrTLmN0.woff2",
    "/assets/IRANYekanX-Black-dg_f-2aP.woff2",
    "/assets/IRANYekanX-Regular-0oJJzN1U.woff2",
    "/assets/IRANYekanX-Heavy-U5pxprz_.woff2",
    "/assets/IRANYekanX-ExtraBlack-oBqbAmDO.woff2",
    "/assets/IRANYekanX-UltraLight-zazMF3EC.woff2",
    "/assets/IRANYekanX-Light-ok_Qfrek.woff2",
    "/assets/IRANYekanX-ExtraBold-H8N9Adyk.woff2",
    "/assets/IRANYekanX-Medium-LDXBOaOz.woff2",
    "/assets/IRANYekanX-DemiBold-Xd_9maUu.woff2",
    "/assets/IRANYekanX-Bold-dxFHw5BR.woff2",
    "/assets/IRANYekanX-Thin-MKlu9PXS.woff",
    "/assets/IRANYekanX-Black-ztb90PBT.woff",
    "/assets/IRANYekanX-Regular-6TvQmXc2.woff",
    "/assets/IRANYekanX-Heavy-Kc_6OTue.woff",
    "/assets/IRANYekanX-ExtraBlack-ZOig5NPA.woff",
    "/assets/IRANYekanX-UltraLight-HPZ_3J4L.woff",
    "/assets/IRANYekanX-Light-v7zYw7r7.woff",
    "/assets/IRANYekanX-Medium-l6ZB7i5S.woff",
    "/assets/IRANYekanX-ExtraBold-8sr7PBGc.woff",
    "/assets/IRANYekanX-DemiBold-yk786QtJ.woff",
    "/assets/IRANYekanX-Bold-OFD9JDtF.woff",
    // "/assets/index-9uCojWaM.css",
    // "/assets/video-bjKr2C5s.js",
    // "/assets/delete-kxN_Zkjr.js",
    // "/assets/use-debounce-JwuGpVD_.js",
    // "/assets/textarea-SqWJZ_ge.js",
    // "/assets/InteractedPosts-NoYg99WV.js",
    // "/assets/CreatePost-nMkDN70q.js",
    // "/assets/UpdatePost-F4A_Scfl.js",
    // "/assets/comment-hooks--uQkBxjb.js",
    // "/assets/DeleteComment.form-Gfij9YoU.js",
    // "/assets/DeletePost.form-yC8lQ_sf.js",
    // "/assets/ForgetPasswordForm-AUDBQV-T.js",
    // "/assets/ResetPasswordForm-RPsc5IeX.js",
    // "/assets/AllUsers-jM80BFBC.js",
    // "/assets/Mixcloud-dcG9SaAJ.js",
    // "/assets/SignUpForm-QS1N0C8o.js",
    // "/assets/Kaltura-abV8j1wH.js",
    // "/assets/Vidyard-LbZN6uwY.js",
    // "/assets/SoundCloud-plgSulfG.js",
    // "/assets/Streamable-kwmbCIUB.js",
    // "/assets/Audits-CqQN7Roz.js",
    // "/assets/DailyMotion-a62_r_Dx.js",
    // "/assets/Preview-a_9Lxav-.js",
    // "/assets/Twitch-oVBT0HNJ.js",
    // "/assets/Facebook-wmsvBr9Q.js",
    // "/assets/Wistia-ucoH6TVv.js",
    // "/assets/Vimeo-I91ztYP8.js",
    // "/assets/Explore-JFD3iTH9.js",
    // "/assets/CommentDialog-eVg0KK7u.js",
    // "/assets/UpdateProfile-fxeedowk.js",
    // "/assets/YouTube-5Y4B88yf.js",
    // "/assets/Profile-T10gWQF-.js",
    // "/assets/Post.form-dVWGVtwL.js",
    // "/assets/PostDetails-7s9uI11G.js",
    // "/assets/FilePlayer-LM23bqv8.js",
    // "/assets/index-56oth_nY.js",
    // "/assets/index-yUWG-ebX.js",
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
    // openIDB();
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
