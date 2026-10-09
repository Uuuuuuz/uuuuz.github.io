/*
 * 旧博客模板曾注册过一个 Service Worker，会让访问过的浏览器继续显示缓存的旧页面。
 * 这个脚本替换掉它：清除旧缓存、注销自己，并刷新已打开的页面。
 * 新网站不使用 Service Worker；等旧访客都更新过后，可以删除本文件。
 */
var OLD_CACHES = /^(main-|precache-v1$|runtime$)/;

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return OLD_CACHES.test(k); })
          .map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll({ type: "window" }); })
      .then(function (clients) {
        clients.forEach(function (client) { client.navigate(client.url); });
      })
  );
});
