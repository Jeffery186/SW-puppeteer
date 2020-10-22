importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");
            self.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'SKIP_WAITING') {
                    self.skipWaiting();
                }
            }); self.__precacheManifest = [{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/attwc-globalnav.esm.js","revision":"e37136c3e46f719fce1daa8cdb3ab7ba"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/attwc-globalnav.js","revision":"6f9f2a90924aba9bf1875e814d64bf0f"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-10c3a6d9.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-2798a69c.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-3ea8955c.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-43e2wrvc.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-59290340.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-69e39edd.system.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-6mqvw8ip.system.entry.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-8b067142.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-8b2adfa7.system.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-aaf72d6b.system.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-bcae8885.system.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-bf81a407.system.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-c68d0961.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-ced5fa7c.system.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-eddd69f2.system.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-m7zotlam.system.entry.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-mutwsnhr.entry.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-susfjqqu.entry.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-w5i1k0xz.entry.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-x7t7b0at.system.entry.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-xkvw9wlh.system.entry.js"},{"url":"./global_all_cms_globalnav/web-components/2.0/attwc-globalnav/p-xypkpkc5.entry.js"}].concat(self.__precacheManifest || []);workbox.routing.registerRoute(
                new RegExp('./ecms/gn/blackbarjson/.*.js$'),
                new workbox.strategies.StaleWhileRevalidate({
                    cacheName: 'ecms-gn-cache',
                    cacheableResponse: {
                        statuses: [0, 200], // Make sure 0 is included in this list.
                    },
                    plugins: [
                        new workbox.expiration.Plugin({
                            maxAgeSeconds: 10080, // 1 week in minutes
                        })
                    ]
                })
            );
            workbox.precaching.precacheAndRoute(self.__precacheManifest, {});workbox.routing.registerRoute(
                new RegExp('./ecms/att/.*(.js|.json)$'),
                new workbox.strategies.StaleWhileRevalidate({
                    cacheName: 'ecms-att-cache',
                    cacheableResponse: {
                        statuses: [0, 200], // Make sure 0 is included in this list.
                    },
                    plugins: [
                        new workbox.expiration.Plugin({
                            maxAgeSeconds: 10080, // 1 week in minutes
                        })
                    ]
                })
            );
            workbox.precaching.precacheAndRoute(self.__precacheManifest, {});