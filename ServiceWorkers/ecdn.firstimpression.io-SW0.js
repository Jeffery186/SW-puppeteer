'use strict';

class DataBase {
    constructor(name, version, tables) {
        this.tables     = tables;
        this.idb         = null;
        this.name       = name;
        this.version    = version;
    }

    open() {
        return new Promise((resolve, reject) => {

            if(this.idb) {
                resolve();
            }

            const request       = indexedDB.open(this.name, this.version);
            request.onerror     = (event) => reject(event);
            request.onsuccess   = () => {
                if(this.idb) {
                    resolve();
                } else {
                    this.idb = request.result;
                    resolve();
                }
            };

            request.onupgradeneeded = (event) => {
                this.idb = event.target['result'];

                Object.keys(this.tables).forEach(table => {
                    if (!this.idb.objectStoreNames.contains(table)) {
                        this.idb.createObjectStore(table, this.tables[table]);
                    }
                });
            }
        });
    }

    insert(table, data, primary = null) {
        return new Promise((resolve, reject) => {
            const request       = this.idb.transaction([table], 'readwrite').objectStore(table).add(data, primary);
            request.onsuccess   = (event) => resolve(event);
            request.onerror     = (event) => reject(event);
        });
    }

    get(table, primary) {
        return new Promise((resolve, reject) => {
            const transaction   = this.idb.transaction([table]);
            const objectStore   = transaction.objectStore(table);
            const request       = objectStore.get(primary);
            request.onerror     = (event) => reject(event);
            request.onsuccess   = () => {
                if (!request.result) {
                    reject('not found')
                } else {
                    resolve(request.result);
                }
            }
        });
    }

    all(table) {
        return new Promise((resolve, reject) => {
            const rows              = [];
            const objectStore       = this.idb.transaction(table).objectStore(table);
            const openCursor        = objectStore.openCursor();
            openCursor.onerror      = (event) => reject(event);
            openCursor.onsuccess    = (event) => {
                const cursor = event.target['result'];

                if (cursor) {
                    cursor.value.key = cursor.key;
                    rows.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(rows);
                }
            };
        });
    }

    update(table, data) {
        return new Promise((resolve, reject) => {
            const primary = data.id;
            delete data.id;

            const request       = this.idb.transaction([table], 'readwrite').objectStore(table).put(data, primary);
            request.onsuccess   = (event) => resolve(event);
            request.onerror     = (event) => reject(event);
        });
    }

    remove(table, key) {
        return new Promise((resolve, reject) => {
            const request       = this.idb.transaction([table], 'readwrite').objectStore(table).delete(key);
            request.onsuccess   = (event) => resolve(event);
            request.onerror     = (event) => reject(event);
        });
    }
}

class Main {
    timeout;
    pageviewsTrackerURL = 'https://tracking.firstimpression.io/sessions/v1';
    sessionTimeout = 60 * 30 * 1000;

    openDb() {
        const _this = this;
        return new Promise((resolve, reject) => {
            sw.console.log("DB", "Setting DB");
            _this.db.open().then(resolve).catch(reject);
        });
    }

    constructor() {
        this.db = new DataBase('fi_sw', 7, {meta: {autoIncrement: true}, pageviews: {autoIncrement: true}});
        this.dbg = 0;

        this.console.log("Event", "construct");

        self.addEventListener('install', function(event) {
            sw.console.log("Event", "install");
            event.waitUntil(self.skipWaiting());
        });

        let _this = this;
        self.addEventListener('activate', function(event) {
            sw.console.log("Event", "activate");
            event.waitUntil(_this.openDb()
                    .then(() => {_this.checkSessions();     })
                    .then(() => {_this.initSessionsTimer(); })
                    .then(() => { self.clients.claim();     })
            );

        });

        addEventListener('message', message => {
            sw.console.log("Message", ["Got data:", message.data]);

            this.openDb().then(()=> {

                switch (message.data.event) {
                    case 'init':
                        if (message.data.dbg) this.dbg = 1;
                        this.initSessionsTimer();

                        this.checkSessions();
                        break;

                    case 'ping':
                        sw.console.log("Pong", 'pong');
                        break;

                    case 'pageview':
                        this.savePageview(message.data.data);
                        break;

                    default:
                        sw.console.log("Notice", "Unknown event " + message.data.event);
                        break;
                }
            });
        });
    }

    savePageview(data) {
        this.saveMeta(data.meta).then((meta) => {
            delete data.meta;

            data.id = meta.data.s;
            this.db.insert('pageviews', data, Date.now()).then(()=>{
                this.console.log("Notice", "SW: Saved a pageview");
            }).catch( e => {
                this.console.log("Error", e);
            });

        });
    }

    saveMeta(data) {
        return new Promise((resolve) => {
            this.db.get('meta', data.s).then(result => {
                result.lastDate = new Date();
                result.id = data.s;

                this.db.update('meta', result).finally(() => resolve(result));
            }).catch(() => {
                const meta = {
                    id: data.s,
                    data: data,
                    date: new Date(),
                    lastDate: new Date()
                };

                this.db.insert('meta', meta, meta.id).then(() => resolve(meta));
            });
        });
    }

    initSessionsTimer() {
        if (!this.timeout) {
            this.timeout = setTimeout(this.checkSessions.bind(this), this.sessionTimeout);
        }
    }

    checkSessions() {
        this.db.all('meta').then(metas => {
            metas.forEach(meta => {
                const metaDate = new Date(meta.lastDate);
                const nowDate = new Date();

                if (nowDate.getDay() !== metaDate.getDay() || metaDate.getTime() < nowDate.getTime() - 60 * 30 * 1000) {
                    this.flushPageviews(meta.data.s, meta);
                }
            });
        }).catch((e) => this.console.log("Error", e));
    }

    flushPageviews(id) {
        let meta = {};
        let pageviews = [];

        this.db.all('pageviews').then(p => {
                pageviews = p;
                if(!pageviews.length) {
                    this.db.remove('meta', id);
                    throw new Error("No pageviews for id " + id);
                }
            })
            .then(() => {
                let _this = this;
                return new Promise(function (resolve, reject) {
                    _this.db.get("meta", id)
                        .then(m => {meta = m.data})
                        .then(resolve);
                });
            })
            .then(() => {
                this.console.log("Notice", "Flushing pageviews for id " + id);

                const rows = pageviews.filter(pageview => pageview.id == id);

                let body = {
                    session: {
                        meta: meta,
                        pageviews: rows
                    }
                };
                if (this.dbg) body.dbg = 1;

                // send pageviews
                return fetch(this.pageviewsTrackerURL, {
                    method: 'POST',
                    body: JSON.stringify(body)
                }).then(() => {
                    // clear sent pageviews
                    this.console.log("Notice", "Removing pageviews from db for id " + id);
                    rows.forEach(row => this.db.remove('pageviews', row.key));
                    this.db.remove('meta', id).catch();
                });
            })
            .catch((e)=>{
                this.console.log("Error", "SW Problem:");
                this.console.log("Error", e);
            });
    }

    console = {
        badgeCode: "padding: .05em .3em;vertical-align: baseline;border-radius: .25rem; margin:0 0.45em; font-weight:bold;",
        log: function(event_cat, msg) {

            if(!this.dbg) return;

            let output = [];
            let css = [];
            let finalOutput;

            output.push("%cFI:");
            css.push(this.badgeCode + "color:white;background-color: #e56e25;");

            output.push("%cSW:");
            css.push(this.badgeCode + "color:white;background-color: #3f51b5;");

            if (!Array.isArray(msg)) {
                msg = [msg];
            }

            output.push("%c" + event_cat + "");
            css.push(this.badgeCode + "color: #fff;background-color: " + (event_cat === "Error" ? "red" : "#3f51b5") + ";");

            output.push("%c" + msg[0]);
            css.push("");

            finalOutput = [output.join(" ")].concat(css);

            if(msg[1]) {
                finalOutput = finalOutput.concat(msg.slice(1, 100));
            }
            console.log.apply(null, finalOutput);

        }

    }

}

let sw = new Main();
