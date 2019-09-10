/* eslint-env worker */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// @see https://github.com/GoogleChrome/workbox/issues/1410
declare const workbox: typeof import('workbox-sw');

function main() {
  if (!workbox) {
    console.log(`Boo! Workbox didn't load 😬`);
    return;
  }

  workbox.setConfig({ debug: true });

  workbox.precaching.precacheAndRoute([
    'http://localhost:8081/assets/build.main.js',
    'http://localhost:8081/assets/build.copy.js',
    'http://localhost:8081/assets/build.edit.js',
    'http://localhost:8081/assets/build.list.js',
    'http://localhost:8081/assets/build.new.js',
    { url: '/', revision: 'foobar-revision-abcde' },
  ]);

  workbox.routing.registerRoute(
    /http:\/\/localhost:8081\/assets\/build\.[\w]+\.js$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    }),
  );
}

main();
