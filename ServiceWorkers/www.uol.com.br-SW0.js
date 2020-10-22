importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/5.1.3/workbox-sw.js',
  '/sw-home.js',
  '/sw-common.js'
);
self.AreaStorage = self.AreaStorage || [];
/**
 * Estratégia padrão para o cache.
 * https://developers.google.com/web/tools/workbox/reference-docs/v4/workbox.strategies
 *
 * Valores permitidos:
 * - CacheFirst
 * - CacheOnly
 * - NetworkFirst
 * - NetworkOnly
 * - StaleWhileRevalidate
 */
const DEFAULT_STRATEGY = 'StaleWhileRevalidate';
/**
 * Recebe um objeto de configuração de cache e retorna a classe Plugin do workbox,
 * configurada conforme a `cfg` recebida.
 *
 * @param {Object} cfg
 * @returns workbox.Plugin
 */
const getPluginClass = (cfg = {}) => {
  const plugins = [];
  for(const plugin of Object.keys(cfg)) {
    switch(plugin) {
      case 'expiration':
        plugins.push(new workbox.expiration.ExpirationPlugin({
          ...cfg[plugin]
        }));
        break;
    }
  }
  return plugins;
}
workbox.setConfig({ debug: false });
for(const area of self.AreaStorage) {
  const {
    cache = undefined,
    config = undefined,
  } = area;
  if(config === undefined) {
    console.error(`sw: object "config" not defined`);
    continue;
  }
  if(cache === undefined) {
    console.error(`sw: object "cache" not defined`);
    continue;
  }
  // valida se a estratégia é válida
  if(workbox.strategies[config.strategy] === undefined) {
    console.error(`sw: strategy ${config.strategy} is not a valida value`);
    continue;
  }
  if(cache.precache instanceof Array === true &&
      /^(home-uol|common-assets)$/.test(config.cacheName) === true) {
    workbox.precaching.precacheAndRoute(cache.precache, {
      // padrão de index.htm, usado quando é feito um request que terminam em "/"
      // https://developers.google.com/web/tools/workbox/modules/workbox-precaching#directory_index
      directoryIndex: 'index.htm',
      // não adiciona .html em urls que são diterório
      // https://developers.google.com/web/tools/workbox/modules/workbox-precaching#clean_urls
      cleanUrls: false,
    });
  }
  const plugins = getPluginClass(config.plugins);
  for(const asset of cache.assets) {
    workbox.routing.registerRoute(
      asset.url,
      new workbox.strategies[config.strategy || DEFAULT_STRATEGY]({
        cacheName: config.cacheName,
        plugins
      })
    );
  }
}
// remove cache antigo
Promise.all([
  caches.delete("[Home UOL] Assets"),
  caches.delete("[Home UOL] Images"),
  caches.delete("[UOL Conteúdo] Common assets")
]).catch(err => {});
