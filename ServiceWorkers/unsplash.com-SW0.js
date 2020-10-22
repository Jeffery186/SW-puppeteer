"use strict";
// Note: this file can't import anything until we add `webpack`.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// The type for `self` doesn't include `ServiceWorkerGlobalScope`, so this function provides a
// workaround for that: https://github.com/Microsoft/TypeScript/issues/14877
((self) => {
    // Must match manifest
    const UPLOAD_FILE_NAME = 'images';
    // Must match manifest
    const UPLOAD_PATH = '/upload';
    const checkIsUploadRequest = (request) => new URL(request.url).pathname === UPLOAD_PATH && request.method === 'POST';
    /**
     * This can be tested at https://jsbin.com/tutibal/1/edit?html,output.
     *
     * Note: the foreground page cannot use JS to read the body of a `POST` request. For this reason, we
     * intercept the request in the service worker, and then send the `POST` request body to the
     * foreground page using `postMessage`.
     */
    const handleUploadRequest = (event) => {
        const createAndPostUploadMessage = () => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield event.request.formData();
            const clientId = 
            // eslint-disable-next-line no-nested-ternary
            event.resultingClientId !== ''
                ? event.resultingClientId
                : event.clientId !== ''
                    ? event.clientId
                    : undefined;
            if (clientId === undefined) {
                throw new Error('Expected client ID but got none.');
            }
            // Assertion is workaround for https://github.com/microsoft/TypeScript/issues/36705
            const client = (yield self.clients.get(clientId));
            if (client === undefined) {
                throw new Error('Expected client but got none.');
            }
            const files = data
                .getAll(UPLOAD_FILE_NAME)
                .filter((file) => file instanceof File);
            if (files.length > 0) {
                const message = { tag: 'Upload', files };
                client.postMessage(message);
            }
        });
        event.respondWith(Response.redirect('/'));
        event.waitUntil(createAndPostUploadMessage());
    };
    self.addEventListener('fetch', event => {
        if (checkIsUploadRequest(event.request)) {
            handleUploadRequest(event);
        }
        else {
            /* eslint-disable prettier/prettier */
            // Currently we only define an empty `fetch` event handler. This is (currently) sufficient to meet
            // the criteria for app install banners
            // (https://developers.google.com/web/fundamentals/app-install-banners/).
            // In the future we will add more logic to this event handler, as we go "offline first" (better
            // caching).
            // Caution: responding to the request inside this event handler means request won't be properly
            // aborted, due to browser bugs:
            // - https://developers.google.com/web/updates/2017/09/abortable-fetch#in_a_service_worker
            // - https://bugs.chromium.org/p/chromium/issues/detail?id=823697
            // We can avoid this bug by ignoring the request, which signals to the browser to use the default
            // fetch behaviour.
            /* eslint-enable prettier/prettier */
        }
    });
})(self);
//# sourceMappingURL=service-worker.js.map