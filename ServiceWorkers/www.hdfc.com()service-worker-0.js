'use strict';

var izCacheVer = 1;

var izVersion = "3.8",
    izooto = {
        client: "9423",
        gaId: "",
        url_redirect: "https://erd.izooto.com/erd?pid=",
        fetchData: "https://fetch.izooto.com/getCachedCampaignTemplate.php",
        campData: null,
        debug: !1,
        log: function(b) {
            !0 === izooto.debug && console.log(b)
        },
        vapidkey: "BGi0J1AQe_jl-taXR_F5uCwVBqMPQ05ANLLTEMwSXoMDa8lewDnUiqS1_--Vs1oLiAkDvjUvRE6CzyUM388u4VE"
    };
izooto.url_redirect += izooto.client + "&ver=" + izVersion;
izooto.viewFlag = 0;
izooto.clickFlag = 0;
izooto.sysEvents = 0;
izooto.domainNum = 0;
izooto.viewSent = 0;
izooto.clickSent = 0;
izooto.domain = ".izooto.com";
izooto.syncViewUrl = ["imp", "wimp"];
izooto.syncClickUrl = ["clk", "clk"];
izooto.syncErrUrl = ["err", "err"];
izooto.syncUnsub = ["usub", "nunsub"];
izooto.syncVersion = ["vr", "vr"];
izooto.syncSysEventUrl = {
    view: ["lim", "lim"],
    click: ["lci", "lci"]
};
izooto.syncAmpVersion = ["enp", "enp"];
izooto.log("SW " + izVersion + " : Debug mode on");
var izSwFetch = this.fetch;
izooto.syncMediatorView = "https://med.izooto.com/medi";
izooto.syncMediatorClick = "https://med.izooto.com/medc";
izooto.syncMediatorUrls = function(b) {
    if (Array.isArray(b) && Array.isArray(b[0]))
        for (var a in b) {
            var c = b[a];
            var e = c[0];
            c = c[1];
            izSwFetch(e, c)
        } else c = b, e = c[0], c = c[1], izSwFetch(e, c)
};
izooto.jsonpResToTxt = function(b) {
    try {
        b = b.substring(6), b = b.substring(0, b.length - 1), b = b.replace(";", "")
    } catch (a) {}
    return b
};
var izMediationLogger = {
    sendErrorLog: function(b, a) {
        1 == izooto.debug && console.log("Error: " + b + ": " + a.message + "\nStackTrace: [" + a.stack + "]\n")
    },
    sendSuccessResponse: function(b) {
        1 == izooto.debug && console.log("Response: " + b + "\n")
    },
    consoleLog: function(b) {
        1 == izooto.debug && console.log("Logger: " + b + "\n")
    }
};
izooto.swUpdate = function(b) {
    void 0 != b && "" != b && b != izVersion && (self.registration.update(), izooto.log("updating sw to version:: " + b))
};
izooto.filterHeaderOptions = function(b) {
    var a = {};
    if (0 <= b.indexOf("~>")) {
        var c = b.split("~>");
        b = c[0];
        try {
            a = JSON.parse(c[1])
        } catch (e) {}
        try {
            void 0 != a && "object" == typeof a && (c = [b], c.push(a), b = c)
        } catch (e) {}
    }
    return b
};
izooto.checkHeaderOptions = function(b) {
    b = izooto.filterHeaderOptions(b);
    var a = [],
        c = {};
    if ("object" == typeof b) {
        if (a.push(b[0]), void 0 != b[1]) {
            b = b[1];
            for (var e in b)
                if ("object" == typeof b[e])
                    for (var d in b[e]) c[d] = b[e][d];
                else "ci" == b[e] ? c.credentials = "include" : "mnc" == b[e] && (c.mode = "no-cors")
        }
    } else a.push(b);
    a.push(c);
    return a
};

function IZMediationPayloadClass(b) {
    var a = "IZMediationPayloadClass(" + b + ")";
    try {
        var c = JSON.parse(b);
        this.fetchType = c.g.tp;
        this.createdOn = c.g.ct;
        this.cid = c.g.id;
        this.pid = c.g.k;
        this.rid = c.g.r;
        this.message = c.g.m;
        this.icon = c.g.i;
        this.bannerImage = c.g.bi;
        this.buttonCount = c.g.b;
        this.button1Text = c.g.b1;
        this.button1Icon = c.g.ib1;
        this.button1Link = c.g.l1;
        this.button2Text = c.g.b2;
        this.button2Icon = c.g.ib2;
        this.button2Link = c.g.l2;
        this.badge = c.g.ba;
        this.passiveFlag = c.g.pf;
        this.requireInteraction = c.g.ri;
        this.tag = c.g.tg;
        this.ttl = c.g.tl;
        this.cfg = c.g.cfg;
        this.callbackFunction = null;
        this.fallbackSubDomain = c.g.fsd;
        this.fallbackDomain = c.g.fbd;
        this.fallbackPath = c.g.fbu;
        this.swVersion = c.g.sw;
        this.evaluate = c.g.ev;
        this.adNetworkArray = [];
        var e = this;
        c.an.forEach(function(d, f) {
            var g = {};
            g.fetchUrl = d.fu;
            void 0 != g.fetchUrl && (g.fetchUrl = izooto.checkHeaderOptions(g.fetchUrl));
            g.credentialsInclude = d.ci;
            g.title = d.t;
            g.landingUrl = d.ln;
            g.id = d.id;
            g.reportViewed = d.rv;
            g.reportClicked = d.rc;
            g.postBidAdFetchURL = d.pb;
            void 0 != g.reportViewed && (Array.isArray(g.reportViewed) ? g.reportViewed.forEach(function(h, k) {
                g.reportViewed[k] = izooto.checkHeaderOptions(g.reportViewed[k])
            }) : g.reportViewed = izooto.checkHeaderOptions(g.reportViewed));
            void 0 != g.reportClicked && (Array.isArray(g.reportClicked) ? g.reportClicked.forEach(function(h, k) {
                g.reportClicked[k] = izooto.checkHeaderOptions(g.reportClicked[k])
            }) : g.reportClicked = izooto.checkHeaderOptions(g.reportClicked));
            void 0 != g.postBidAdFetchURL && (g.postBidAdFetchURL = izooto.checkHeaderOptions(g.postBidAdFetchURL));
            g.message = d.m;
            g.icon = d.i;
            g.bannerImage = d.bi;
            g.buttonCount = d.b;
            g.button1Text = d.b1;
            g.button1Icon = d.ib1;
            g.button1Link = d.l1;
            g.button2Text = d.b2;
            g.button2Icon = d.ib2;
            g.button2Link = d.l2;
            g.requireInteraction = d.ri;
            g.tag = d.tag;
            g.ttl = d.tl;
            g.cfg = d.cfg;
            g.passiveFlag = d.pf;
            g.badge = d.ba;
            g.cpm = d.cpm;
            g.ctr = d.ctr;
            g.cpc = d.cpc;
            g.rcvBid = d.rb;
            g.bid = -1;
            g.responseTime = -1;
            g.winner = !1;
            g.success = !1;
            g.completed = !1;
            g.httpSuccess = !1;
            e.adNetworkArray.push(g)
        })
    } catch (d) {
        izMediationLogger.sendErrorLog(a, d)
    }
}

function IZMediatorClass(b) {
    this.mediationPayloadJson = b;
    this.mediationObj = new IZMediationPayloadClass(this.mediationPayloadJson);
    this.startTime = new Date;
    this.fallbackLocalPayload = '{"k":"100","id":"1","r":"1001001","ct":"1588227796","ln":"https://www.izooto.com?utm-source=izooto-med","t":"iZooto - Own your audience ","m":"An own audoence marketing platform","i":"https://www.izooto.com/hs-fs/hubfs/izooto-logo-160-1.png?width=150&name=izooto-logo-160-1.png","b":"1","b1":"~Sponsored","l1":"https://www.izooto.com?utm-source=izooto-med","ri":"0","tg":"100","tl":"14400","cfg":"3"}';
    this.getPayload = function(a) {
        var c = "getPayload(" + this.mediationPayloadJson + ")";
        this.mediationObj.hasOwnProperty("evaluate") && void 0 != this.mediationObj.evaluate && izooto.evaluator(this.mediationObj.evaluate);
        try {
            this.mediationObj.callbackFunction = a, void 0 == this.mediationObj && this.buildPayload(null), void 0 == this.mediationObj.fetchType && (this.mediationObj.fetchType = 4), 4 >= parseInt(this.mediationObj.fetchType) ? this.executeFetch() : 5 == parseInt(this.mediationObj.fetchType) ? this.executeFallback() : 6 == parseInt(this.mediationObj.fetchType) && this.executeRealtimeBid()
        } catch (e) {
            izMediationLogger.sendErrorLog(c, e)
        }
    };
    this.fetchHTTPAndAdResponseWithBid = function(a, c, e, d, f) {
        var g = new Date,
            h = a.fetchUrl;
        e && void 0 != a.postBidAdFetchURL && (h = a.postBidAdFetchURL);
        var k = {},
            l = h[0];
        k = h[1];
        k.method = "get";
        a.hasOwnProperty("credentialsInclude") && 1 == a.credentialsInclude && (k.credentials = "include");
        izSwFetch(l, k).then(function(m) {
            m.text().then(function(p) {
                a.httpSuccess = !0;
                var u = !1;
                void 0 != a.postBidAdFetchURL && e && (u = !0);
                izMediationLogger.consoleLog("HTTP responded text [" +
                    a.id + "]: " + p);
                p.startsWith("izexe(") && (p = izooto.jsonpResToTxt(p));
                c.verifyAndEnrichAdnetworkObject(a, JSON.parse(p), g, u) ? (a.winner = !0, izMediationLogger.consoleLog("[" + a.id + "] JSON Response verification success."), d(a)) : (izMediationLogger.consoleLog("[" + a.id + "] JSON Response verification failed"), f(a, g))
            })["catch"](function(p) {
                izMediationLogger.consoleLog("[" + a.id + "] Response failed. Not a JSON: " + p.message);
                f(a, g)
            })
        })["catch"](function(m) {
            izMediationLogger.consoleLog("[" + a.id + "] Error fetching ad:" +
                m);
            f(a)
        })
    };
    this.verifyAndEnrichAdnetworkObject = function(a, c, e, d) {
        var f = "verifyAndEnrichAdnetworkObject(" + a.id + ")";
        try {
            if (!this.verifyAdNetworkResponseJson(a, c, d)) return a.responseTime = this.timeDiffInMillisFromNow(e), a.success = !1, a.completed = !0, izMediationLogger.consoleLog(f + " JSON Verification failed."), !1;
            if (d) a.cpc = this.extractAndEvaluateValue("cpc", a.cpc, c), a.cpm = this.extractAndEvaluateValue("cpm", a.cpm, c), a.ctr = this.extractAndEvaluateValue("ctr", a.ctr, c), a.postBidAdFetchURL = this.extractAndEvaluateValue("postBidAdFetchURL", a.postBidAdFetchURL, c);
            else
                for (var g in a) {
                    var h = a[g];
                    if (void 0 != h && ("string" == typeof h || Array.isArray(h))) {
                        var k = this;
                        if (Array.isArray(h))
                            if (Array.isArray(h[0])) h.forEach(function(m, p) {
                                var u = k.extractAndEvaluateValue(g, m[0], c);
                                a[g][p] = [u, m[1]]
                            });
                            else {
                                var l = k.extractAndEvaluateValue(g, h[0], c);
                                a[g] = [l, h[1]]
                            }
                        else a[g] = this.extractAndEvaluateValue(g, h, c)
                    }
                }
            this.setAndCalculateBidPrice(a);
            a.responseTime = this.timeDiffInMillisFromNow(e);
            a.completed = !0;
            return a.success = !0
        } catch (m) {
            izMediationLogger.sendErrorLog(f, m)
        }
        a.responseTime = this.timeDiffInMillisFromNow(e);
        a.success = !1;
        a.completed = !0;
        return !1
    };
    this.verifyAdNetworkResponseJson = function(a, c, e) {
        var d = "verifyAdNetworkResponseJson(" + a.id + ")";
        try {
            if (e) {
                var f = this.extractAndEvaluateValue("cpc", a.cpc, c),
                    g = this.extractAndEvaluateValue("cpm", a.cpm, c),
                    h = a.postBidAdFetchURL = this.extractAndEvaluateValue("postBidAdFetchURL", a.postBidAdFetchURL, c);
                return void 0 == f && void 0 == g || !h.includes("//") ? !1 : !0
            }
            var k = this.extractAndEvaluateValue("landingUrl", a.landingUrl, c),
                l = this.extractAndEvaluateValue("title", a.title, c);
            return void 0 == k || !k.includes("//") || void 0 == l || 2 > l.length ? !1 : !0
        } catch (m) {
            izMediationLogger.sendErrorLog(d, m)
        }
    };
    this.executeFetch = function() {
        var a = "executeFetch(" + this.mediationObj.pid + ", " + this.startTime + ")";
        try {
            var c = this;
            this.fetchHTTPAndAdResponseWithBid(this.mediationObj.adNetworkArray[0], this, !1, function(e) {
                c.buildPayload(e)
            }, function(e, d) {
                c.buildPayload(null)
            })
        } catch (e) {
            izMediationLogger.sendErrorLog(a, e)
        }
    };
    this.executeFallback = function() {
        var a = "executeFallback(" + this.mediationObj.pid + ", " + this.startTime + ")";
        try {
            var c = function(d, f) {
                    d.fetchHTTPAndAdResponseWithBid(f, d, !1, function(g) {
                        g.winner = !0;
                        d.buildPayload(g)
                    }, function(g, h) {
                        e < d.mediationObj.adNetworkArray.length ? (e++, c(d, d.mediationObj.adNetworkArray[e])) : d.buildPayload(null)
                    })
                },
                e = 0;
            c(this, this.mediationObj.adNetworkArray[e])
        } catch (d) {
            izMediationLogger.sendErrorLog(a, d)
        }
    };
    this.executeRealtimeBid = function() {
        var a = "executeRealtimeBid(" + this.mediationObj.pid + ", " + this.startTime + ")";
        try {
            var c = function(q) {
                    if (void 0 != p[q] && h >= g.mediationObj.adNetworkArray.length - k.length) {
                        clearInterval(m);
                        izMediationLogger.consoleLog("passiveFlag processing...");
                        var t = p[q];
                        e > parseFloat(t.cpc) ? (g.setAndCalculateBidPrice(t), h++, izMediationLogger.consoleLog("passiveFlag lower bid"), c(q + 1)) : g.fetchHTTPAndAdResponseWithBid(t, g, !1, function(r) {
                            d = f;
                            f = r;
                            e = parseFloat(t.cpc);
                            h++;
                            c(q + 1)
                        }, function(r, v) {
                            h++;
                            izMediationLogger.consoleLog("Invalid network response.");
                            c(q + 1)
                        })
                    }
                },
                e = 0,
                d = null,
                f = null;
            Array.isArray(this.mediationObj.adNetworkArray) || this.buildPayload(null);
            var g = this,
                h = 0,
                k = [],
                l = function(q) {
                    var t = [],
                        r = null;
                    q.forEach(function(v, w) {
                        parseFloat(v.cpc) > r ? (r = parseFloat(v.cpc), t.unshift(v)) : t.push(v)
                    });
                    return t
                };
            this.mediationObj.adNetworkArray.forEach(function(q, t) {
                1 == q.passiveFlag && q.cpc && !isNaN(parseFloat(q.cpc)) ? (izMediationLogger.consoleLog("passiveFlag found"), k.push(q)) : g.fetchHTTPAndAdResponseWithBid(q, g, !1, function(r) {
                    e <= parseFloat(r.bid) && (d = f, f = r, e = parseFloat(r.bid));
                    h++
                }, function(r, v) {
                    h++;
                    izMediationLogger.consoleLog("Invalid network response.")
                })
            });
            var m = null,
                p = [];
            0 < k.length && (p = l(k), m = setInterval(function() {
                c(0)
            }, 1E3));
            var u = null;
            u = setInterval(function() {
                h >= g.mediationObj.adNetworkArray.length && (null != f && (f.winner = !0), g.buildPayload(f, d), clearInterval(u))
            }, 1E3)
        } catch (q) {
            izMediationLogger.sendErrorLog(a, q)
        }
    };
    this.setAndCalculateBidPrice = function(a) {
        var c = "setAndCalculateBidPrice(" + a.id + ")";
        try {
            void 0 == a.bid && -1 == a.bid, a.ctr = void 0 == a.ctr ? .01 : parseFloat(a.ctr), void 0 != a.cpc ? (a.bid = parseFloat(a.cpc), isNaN(a.bid) && (a.bid = -1)) : void 0 != a.cpm && (a.bid = a.cpm / (10 * a.ctr))
        } catch (e) {
            izMediationLogger.sendErrorLog(c, e)
        }
    };
    this.extractAndEvaluateValue = function(a, c, e) {
        a = "extractAndEvaluateValue(" + c + ")";
        izooto.tmpExe = e;
        try {
            if (void 0 == e) return izMediationLogger.consoleLog(a + " Response Object Undefined."), c;
            if (void 0 == c || "string" != typeof c) return c;
            if (c.startsWith("~")) return izMediationLogger.consoleLog("RETURNED " + c.substr(1)), c.substr(1);
            try {
                var d = eval("izooto.tmpExe" + c);
                d.includes("http://") && (d = d.replace("http://", "https://"))
            } catch (f) {}
            return void 0 == d ? c : d
        } catch (f) {
            izMediationLogger.sendErrorLog(a, f), izMediationLogger.consoleLog(f)
        }
    };
    this.addPidRidEtc = function(a) {
        var c = a;
        try {
            c = JSON.parse(a)
        } catch (e) {}
        c.k = this.mediationObj.pid;
        c.r = this.mediationObj.rid;
        c.id = this.mediationObj.cid;
        c.ct = this.mediationObj.createdOn;
        return JSON.stringify(c)
    };
    this.buildPayload = function(a, c) {
        var e = new Date,
            d = this;
        null == a ? izSwFetch(this.getFailureFallbackURL(), {
            method: "get"
        }).then(function(f) {
            f.text().then(function(g) {
                var h = d.buildAndExecuteResult(null, 1, d.timeDiffInMillisFromNow(e));
                d.executeCallback(d.addPidRidEtc(g), h)
            })
        })["catch"](function(f) {
            f = d.buildAndExecuteResult(n, 2, d.timeDiffInMillisFromNow(e));
            d.executeCallback(d.addPidRidEtc(d.fallbackLocalPayload), f)
        }) : void 0 != a.postBidAdFetchURL ? this.buildPayloadPostBiddingFetch(a, c) : this.buildPayloadWithAdResponse(a)
    };
    this.executeCallback = function(a, c) {
        var e = JSON.parse(a);
        void 0 != c && (e.res = JSON.parse(c));
        izMediationLogger.consoleLog("Returned payload: " + JSON.stringify(e));
        this.mediationObj.callbackFunction(JSON.stringify(e))
    };
    this.buildPayloadPostBiddingFetch = function(a, c) {
        var e = this;
        this.fetchHTTPAndAdResponseWithBid(a, this, !0, function(d) {
            e.buildPayloadWithAdResponse(d)
        }, function(d, f) {
            void 0 != c && null != c ? e.buildPayloadWithAdResponse(c) : e.buildPayload(null)
        })
    };
    this.buildPayloadWithAdResponse = function(a) {
        var c = "buildPayload(" + a + ", " + this.mediationObj.pid + ", " + this.startTime + ")",
            e = "";
        try {
            var d = {};
            d.k = this.mediationObj.pid;
            d.id = this.mediationObj.cid;
            d.r = this.mediationObj.rid;
            d.ct = this.mediationObj.createdOn;
            d.ln = a.landingUrl;
            d.t = a.title;
            d.sw = this.mediationObj.swVersion;
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "message", "m");
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "icon", "i");
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "bannerImage", "bi");
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "buttonCount", "b");
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "button1Text", "b1");
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "button1Link", "l1");
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "button1Icon", "ib1");
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "button2Text", "b2");
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "button2Link", "l2");
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "button2Icon", "ib2");
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "requireInteraction", "ri");
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "tag", "tg");
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "ttl", "tl");
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "cfg", "cfg");
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "reportClicked", "rc");
            this.addToOutputPayloadJsonFromAdnOrGlobal(d, a, "badge", "ba");
            e = JSON.stringify(d);
            var f = this.buildAndExecuteResult(a, 0, 0);
            e = this.executeCallback(e, f);
            this.callReportViewesCallback(a);
            return e
        } catch (g) {
            izMediationLogger.sendErrorLog(c, g)
        }
        return e
    };
    this.callReportViewesCallback = function(a) {
        if (void 0 != a.reportViewed) {
            if (Array.isArray(a.reportViewed) && Array.isArray(a.reportViewed[0]))
                for (var c in a.reportViewed) {
                    var e = {};
                    e = a.reportViewed[c];
                    var d = e[0];
                    e = e[1];
                    e.method = "get";
                    izSwFetch(d, e).then(function(f) {
                        f.text().then(function(g) {
                            izMediationLogger.consoleLog("Report url hit: " + d)
                        })
                    })["catch"](function(f) {
                        return izMediationLogger.consoleLog(f.message)
                    })
                }
            Array.isArray(a.reportViewed) && "string" == typeof a.reportViewed[0] && (e = {}, e = a.reportViewed, d = e[0], e = e[1], e.method = "get", izSwFetch(d, e).then(function(f) {
                f.text().then(function(g) {
                    izMediationLogger.consoleLog("Report url hit: " + a.reportViewed)
                })
            })["catch"](function(f) {
                return izMediationLogger.consoleLog(f.message)
            }))
        }
    };
    this.addToOutputPayloadJsonFromAdnOrGlobal = function(a, c, e, d) {
        try {
            void 0 != c[e] ? a[d] = c[e] : void 0 != this.mediationObj[e] && (a[d] = this.mediationObj[e])
        } catch (f) {
            izMediationLogger.sendErrorLog("addToOutputPayloadJsonFromAdnOrGlobal(" + c + ", " + e + ", " + d + ")", f)
        }
    };
    this.getFailureFallbackURL = function() {
        var a = "flbk.izooto.com";
        try {
            void 0 != this.mediationObj.fallbackSubDomain ? a = this.mediationObj.fallbackSubDomain + ".izooto.com" : void 0 != this.mediationObj.fallbackDomain && (a = this.mediationObj.fallbackDomain);
            var c = "default.json";
            void 0 != this.mediationObj.fallbackPath && (c = "default.fallbackPath");
            return "https://" + a + "/" + c
        } catch (e) {
            izMediationLogger.sendErrorLog("fetchFailureFallback()", e)
        }
    };
    this.buildAndExecuteResult = function(a, c, e) {
        var d = "buildAndExecuteResult(" + a + ", " + this.mediationObj.pid + ", " + c + ", " + e + ", " + this.startTime + ")";
        try {
            var f = {};
            f.pid = this.mediationObj.pid;
            f.rid = this.mediationObj.rid;
            f.type = this.mediationObj.fetchType;
            null != a ? (f.result = a.id, f.served = {}, f.served.a = a.id, f.served.b = a.bid, f.served.t = a.responseTime, a.rcvBid && (a.rcvBid = parseFloat(a.rcvBid), f.served.rb = -1, isNaN(a.rcvBid) || (f.served.rb = a.rcvBid))) : 1 == c ? (f.result = 0, f.served = {}, f.served.a = 0, f.served.b = 0, f.served.t = e) : 2 == c && (f.result = -1, f.served = {}, f.served.a = -1, f.served.b = -1, f.served.t = e);
            f.bids = [];
            this.mediationObj.adNetworkArray.forEach(function(h, k) {
                f.bids[k] = {};
                f.bids[k].a = h.id;
                f.bids[k].b = h.bid;
                f.bids[k].t = h.responseTime;
                h.rcvBid && (h.rcvBid = parseFloat(h.rcvBid), f.bids[k].rb = -1, isNaN(h.rcvBid) || (f.bids[k].rb = h.rcvBid))
            });
            f.ta = this.timeDiffInMillisFromNow(this.startTime);
            var g = JSON.stringify(f);
            izMediationLogger.sendSuccessResponse(g);
            return g
        } catch (h) {
            izMediationLogger.sendErrorLog(d, h)
        }
    };
    this.timeDiffInMillisFromNow = function(a) {
        return new Date - a
    }
}
izooto.sendChurn = function(b, a) {
    setTimeout(function() {
        var c = {};
        c.pid = izooto.client;
        c.bkey = b;
        c.ver = izVersion;
        if ("granted" != Notification.permission) {
            var e = izooto.getEndpointToSync(izooto.syncUnsub, a.domainNum);
            izooto.httpRequest(e, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: Object.keys(c).map(function(d) {
                    return d + "=" + c[d]
                }).join("&")
            }, function(d) {}, function(d) {
                izooto.log(d)
            })
        }
    }, 1E4)
};
izooto.izPushGaEvent = function(b, a) {
    var c = "",
        e = function(d) {
            if (null !== d) {
                var f = {
                    v: 1,
                    cid: d.endpoint,
                    tid: c,
                    t: "event",
                    ec: "izooto_notifications",
                    ea: b,
                    el: a,
                    ni: 1
                };
                d = Object.keys(f).filter(function(g) {
                    return f[g]
                }).map(function(g) {
                    return g + "=" + encodeURIComponent(f[g])
                }).join("&");
                return fetch("https://www.google-analytics.com/collect", {
                    method: "post",
                    body: d
                })
            }
        };
    izooto.log("GA :: " + b);
    return izooto.db.init().then(function(d) {
        return izooto.db.getData(d, "options", "gaId").then(function(f) {
            izooto.log(f);
            return (c = f.hasOwnProperty("val") ? f.val : izooto.gaId) && (b || a) ? self.registration.pushManager.getSubscription().then(e).then(function(g) {
                if (g.ok) izooto.log("Sending to GA " + a + " " + b);
                else return g.text()
            })["catch"](function(g) {
                izooto.log("Unable to send to GA" + g)
            }) : Promise.resolve()
        })["catch"](function(f) {
            izooto.log(f)
        })
    })["catch"](function(d) {
        izooto.log(d)
    })
};
izooto.getEndpointToSync = function(b, a) {
    var c = void 0 != a ? a : 0,
        e = b[0],
        d = b[1];
    0 != c && (e += c, d += c);
    return "https://" + e + izooto.domain + "/" + d
};
izooto.db = {};
izooto.db.tbl = {};
izooto.db.instance = "";
izooto.db.addUpdate = function(b, a, c, e, d) {
    b = b.transaction([a], "readwrite").objectStore(a).put(c);
    b.onsuccess = function(f) {
        e(c + " added to " + a)
    };
    b.onerror = function(f) {
        d("Unable to add data " + c + " in " + a)
    }
};
izooto.db.optionsUpdate = function(b, a, c) {
    return new Promise(function(e, d) {
        izooto.db.addUpdate(b, "options", {
            key: a,
            val: c
        }, e, d)
    })
};
izooto.db.swEventsUpdate = function(b, a) {
    return new Promise(function(c, e) {
        var d = new Date,
            f = d.getMonth() + 1 + "-" + d.getDate() + "-" + d.getFullYear(),
            g = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        d = Math.abs(Math.round(d.getTime() / 1E3));
        izooto.db.addUpdate(b, "swEvents", {
            date: f,
            time: g,
            timestamp: d,
            eventName: a
        }, c, e)
    })
};
izooto.db.getAll = function(b, a, c, e, d) {
    var f = [];
    c.openCursor().onsuccess = function(g) {
        (g = g.target.result) ? (f.push(g.value), g["continue"]()) : e(f)
    }
};
izooto.db.getData = function(b, a, c) {
    return new Promise(function(e, d) {
        var f = b.transaction([a]).objectStore(a);
        if ("all" == c && void 0 == f.getAll) izooto.log("getAll not found"), izooto.db.getAll(b, a, f, e, d);
        else {
            var g = "all" == c ? f.getAll() : f.get(c);
            g.onerror = function(h) {
                d("Unable to retrieve data from db!")
            };
            g.onsuccess = function(h) {
                h = "";
                g.result ? h = g.result : izooto.log("Not found in db! " + a + "::" + c);
                e(h)
            }
        }
    })
};
izooto.db.init = function(b) {
    return new Promise(function(a, c) {
        "" !== izooto.db.instance && (a(izooto.db.instance), izooto.log("DB already loaded"));
        var e = indexedDB.open("izooto", 2);
        e.onerror = function(d) {
            c("DB not load")
        };
        e.onsuccess = function(d) {
            izooto.db.instance = e.result;
            izooto.log("success:: " + izooto.db.instance);
            a(izooto.db.instance)
        };
        e.onupgradeneeded = function(d) {
            d = d.target.result;
            d.createObjectStore("swEvents", {
                keyPath: "eventName"
            });
            d.createObjectStore("options", {
                keyPath: "key"
            })
        }
    })
};
izooto.httpRequest = function(b, a, c, e) {
    fetch(b, a).then(function(d) {
        c && c(d.text())
    })["catch"](function(d) {
        e && e(d)
    })
};
izooto.db.tblExtract = function(b, a, c) {
    for (var e in b)
        if (b[e].hasOwnProperty(a) && b[e][a] == c) return b[e];
    return {}
};
izooto.versionHandler = function(b, a, c) {
    var e = izVersion,
        d = {};
    izooto.db.tblExtract(a, "key", "swVer");
    izooto.db.tblExtract(a, "key", "noRootAlllowed");
    var f = function(h, k, l) {
            izooto.db.optionsUpdate(b, h, k).then(function(m) {
                l && l(m);
                izooto.log(m)
            })["catch"](function(m) {
                izooto.log(m)
            })
        },
        g = izooto.getEndpointToSync(izooto.syncVersion, 0);
    d.pid = izooto.client;
    d.ver = izVersion;
    self.registration.pushManager.getSubscription().then(function(h) {
        if (h) {
            try {
                h = JSON.parse(JSON.stringify(h))
            } catch (k) {
                izooto.log(k)
            }
            izooto.bKey = izooto.getEndPoint(h);
            d.bkey = izooto.bKey;
            "object" === typeof h && void 0 !== h.keys && (void 0 !== h.keys.auth && (d.auth = h.keys.auth), void 0 !== h.keys.p256dh && (d.pk = h.keys.p256dh));
            izooto.httpRequest(g, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: Object.keys(d).map(function(k) {
                    return k + "=" + d[k]
                }).join("&")
            }, function(k) {
                f("swVer", e)
            }, function(k) {
                izooto.log(k)
            })
        } else f("swVer", e)
    })
};
izooto.logSwEvent = function(b, a, c) {
    var e = function(f) {
            var g = new Date;
            g = g.getMonth() + 1 + "-" + g.getDate() + "-" + g.getFullYear();
            f = new Date(f);
            f = ((new Date(g)).getTime() - f.getTime()) / 864E5;
            isNaN(f) && (f = 7);
            return f
        },
        d = function(f, g) {
            izooto.log(a);
            if (!g || !g.date || g.date && 7 <= e(g.date)) {
                izooto.log("Sending last... ::" + b);
                if ("view" == b) {
                    if (1 == izooto.viewSent) return;
                    izooto.viewSent = 1
                } else if ("click" == b) {
                    if (1 == izooto.clickSent) return;
                    izooto.clickSent = 1
                }
                var h = izooto.getEndpointToSync(izooto.syncSysEventUrl[b], c.domainNum);
                izooto.httpRequest(h, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: Object.keys(a).map(function(k) {
                        return k + "=" + a[k]
                    }).join("&")
                }, function(k) {
                    izooto.db.swEventsUpdate(f, b).then(function(l) {
                        izooto.log(l)
                    })["catch"](function(l) {
                        izooto.log(l)
                    })
                }, function(k) {
                    izooto.log(k)
                })
            } else izooto.log("Already Synced ::" + b)
        };
    izooto.db.init().then(function(f) {
        izooto.db.getData(f, "swEvents", "all").then(function(g) {
            izooto.db.tbl.swEvents = g;
            1 == c.sysEvents && (izooto.log("sysEvents : true"), g = izooto.db.tblExtract(g, "eventName", b), d(f, g))
        })["catch"](function(g) {
            izooto.log(g)
        })
    })["catch"](function(f) {
        izooto.log(f)
    });
    izooto.log("logging :: " + b)
};
izooto.getCampaignLink = function(b, a, c) {
    izooto.log("getCampaignLink ---");
    a = a.substr(a.indexOf("?") + 1).split("&");
    "act" == b ? (a = a[0].split("="), c = "campUrl" == a[0] ? decodeURIComponent(a[1]) : izooto.url_redirect) : "act1" == b ? (a = a[1].split("="), c = "act1" == a[0] ? decodeURIComponent(a[1]) : izooto.url_redirect) : "act2" == b && (a = a[2].split("="), c = "act2" == a[0] ? decodeURIComponent(a[1]) : izooto.url_redirect);
    return c
};
izooto.filterVal = function(b) {
    return b = b.replace("~", "")
};
izooto.izEval = function(b, a) {
    izooto.tmpExe = b;
    var c = "";
    try {
        c = eval("izooto.tmpExe." + a)
    } catch (e) {
        try {
            c = eval("izooto.tmpExe" + a)
        } catch (d) {}
    }
    return c
};
izooto.evaluator = function(b) {
    izooto.tmpExe = b;
    try {
        eval(izooto.tmpExe)
    } catch (a) {}
};
izooto.evalHandler = function(b, a) {
    return a.startsWith("~") ? izooto.filterVal(a) : izooto.izEval(b, a)
};
izooto.getEndPoint = function(b) {
    izooto.log("getEndpoint ---");
    var a = {
        fcm: "https://fcm.googleapis.com/fcm/send/",
        chrome: "https://android.googleapis.com/gcm/send/",
        ffox: "https://updates.push.services.mozilla.com/wpush/",
        uc: "https://uccm-intl.ucweb.com/wpush/m/"
    };
    b = b.endpoint;
    for (var c in a) {
        var e = a[c];
        if (0 === b.indexOf(e)) return b.replace(e, "")
    }
    if (0 < b.indexOf("?token=")) return encodeURIComponent(b.substring(b.indexOf("=") + 1));
    a = "Endpoint Mismatch :: " + b;
    c = izooto.getEndpointToSync(izooto.syncErrUrl, izooto.domainNum);
    izooto.sendLog(c, {
        client: izooto.client,
        op: "error",
        endpoint: b,
        response: encodeURIComponent(a),
        ver: izVersion
    });
    return ""
};
izooto.populateMacros = function(b) {
    var a = "@title @message @icon @act1link @act2link @link @banner @act1icon @act2icon".split(" "),
        c;
    for (c in b) 0 <= a.indexOf(b[c]) && b.hasOwnProperty(b[c].substring(1)) && (b[c] = b[b[c].substring(1)]);
    izooto.log(b);
    return b
};
izooto.showNotification = function(b) {
    izooto.log("showNotification ---");
    izooto.log(b);
    b = izooto.populateMacros(b);
    izooto.sendChurn(izooto.bKey, b);
    var a = b.title,
        c = b.message,
        e = b.tag,
        d = !0;
    b.hasOwnProperty("reqInt") && 0 == b.reqInt && (d = !1);
    if (b.hasOwnProperty("banner") && "" != b.banner) var f = b.banner;
    var g = b.link,
        h = izooto.bKey ? izooto.bKey : "";
    0 <= g.indexOf("{BROWSERKEYID}") && (g += g.includes("?") ? "&" : "?", g += "ver=" + izVersion);
    g = g.replace("{BROWSERKEYID}", h);
    izooto.url_redirect = g;
    var k = b.icon;
    var l = {};
    l.link = g;
    l.cid = b.id;
    l.rid = b.rid;
    l.pid = b.key ? b.key : izooto.client;
    l.viewFlag = b.viewFlag;
    l.clickFlag = b.clickFlag;
    l.sysEvents = b.sysEvents;
    l.domainNum = b.domainNum;
    b.hasOwnProperty("res") && (l.res = b.res);
    b.hasOwnProperty("rc") && (l.rc = b.rc);
    1 != b.pl && (izooto.log("appending in icon"), k = k.includes("?") ? k + "&" : k + "?", k = k + "campUrl=" + encodeURIComponent(g));
    c = {
        body: c,
        icon: k,
        requireInteraction: d,
        tag: e,
        image: f,
        data: l
    };
    b.hasOwnProperty("badge") && (c.badge = b.badge);
    b.hasOwnProperty("sound") && (c.sound = b.sound);
    b.hasOwnProperty("vibrate") && (c.vibrate = b.vibrate);
    0 != b.act_num && 0 < b.act_num && b.act1name && b.act1link && (izooto.action_link1 = b.act1link, 0 <= izooto.action_link1.indexOf("{BROWSERKEYID}") && (izooto.action_link1 += izooto.action_link1.includes("?") ? "&" : "?", izooto.action_link1 += "ver=" + izVersion), izooto.action_link1 = izooto.action_link1.replace("{BROWSERKEYID}", h), l.act1link = izooto.action_link1, e = {
        action: "action1",
        title: b.act1name
    }, b.hasOwnProperty("act1icon") && "" != b.act1icon && (e.icon = b.act1icon), f = [e], 1 != b.pl && (c.icon = k + "&act1=" + encodeURIComponent(izooto.action_link1)), c.link = izooto.url_redirect, 2 == b.act_num && b.act2name && b.act2link && (izooto.action_link2 = b.act2link, 0 <= izooto.action_link2.indexOf("{BROWSERKEYID}") && (izooto.action_link2 += izooto.action_link2.includes("?") ? "&" : "?", izooto.action_link2 += "ver=" + izVersion), izooto.action_link2 = izooto.action_link2.replace("{BROWSERKEYID}", h), l.act2link = izooto.action_link2, 1 != b.pl && (c.icon = k + "&act2=" + encodeURIComponent(izooto.action_link2)), k = {
        action: "action2",
        title: b.act2name
    }, b.hasOwnProperty("act2icon") && "" != b.act2icon && (k.icon = b.act2icon), f = [e, k]), c.data = l, c.actions = f);
    return self.registration.showNotification(a, c)
};
izooto.sendLog = function(b, a) {
    izooto.log("--\x3e URL : " + b);
    izooto.log("---\x3e Payload :" + JSON.stringify(a, null, 4));
    izooto.httpRequest(b, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: Object.keys(a).map(function(c) {
            return c + "=" + a[c]
        }).join("&")
    }, function(c) {}, function(c) {
        izooto.log("Failed to send log :: " + c)
    })
};
izooto.sendJsonLog = function(b, a) {
    izooto.log("--\x3e URL : " + b);
    izooto.log("---\x3e Payload :" + JSON.stringify(a, null, 4));
    izooto.httpRequest(b, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(a)
    }, function(c) {}, function(c) {
        izooto.log("Failed to send JSON log :: " + c)
    })
};
izooto.getParamFromRoute = function(b, a) {
    var c = "";
    try {
        var e = new URL(b);
        e = e.searchParams.get("frwd");
        e = atob(e);
        c = new URL(e);
        c = c.searchParams.get(a)
    } catch (d) {}
    return c
};
izooto.logNotificationView = function(b, a, c) {
    var e = izooto.getEndpointToSync(izooto.syncViewUrl, c.domainNum);
    try {
        b = JSON.parse(JSON.stringify(b))
    } catch (f) {
        izooto.log("found err"), izooto.logError(f)
    }
    var d = izooto.getParamFromRoute(c.link, "utm_campaign");
    izooto.izPushGaEvent("view", d);
    izooto.log("logNotificationView ---");
    d = {
        pid: c.key,
        bKey: izooto.bKey,
        et: "userp",
        act: "add",
        val: JSON.stringify({
            last_notification_viewed: !0
        }),
        ver: izVersion
    };
    izooto.log(b);
    "object" === typeof b && void 0 !== b.keys && (void 0 !== b.keys.auth && (d.auth = b.keys.auth), void 0 !== b.keys.p256dh && (d.pk = b.keys.p256dh));
    izooto.logSwEvent("view", d, c);
    b = {
        pid: c.key,
        bkey: izooto.bKey,
        cid: c.id,
        rid: c.rid,
        op: "view",
        ver: izVersion
    };
    b.pl = a ? 1 : 0;
    1 == c.viewFlag && (izooto.sendLog(e, b), izooto.log("Notification view has been logged successfully : "));
    c.hasOwnProperty("res") && izooto.sendJsonLog(izooto.syncMediatorView, c.res);
    izooto.syncHook("syncNotificationView", b, c, "view")
};
izooto.hookProcessor = function(b, a) {
    var c = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(a)
    };
    izooto.httpRequest(b, c)
};
izooto.syncHook = function(b, a, c, e) {
    try {
        izooto.log("Sync " + b), izooto.db.init().then(function(d) {
            izooto.db.getData(d, "options", "all").then(function(f) {
                izooto.db.tbl.options = f;
                var g = izooto.db.tblExtract(f, "key", b);
                f = izooto.db.tblExtract(f, "key", "IZCID");
                g = g.val ? g.val : "";
                f = f.val ? f.val : "";
                var h = a.cid,
                    k = a.rid;
                if ("" == g) izooto.log("hook not found " + b);
                else {
                    f = {
                        cookie_id: f,
                        cid: h,
                        reference_id: k,
                        action: e,
                        notification_title: c.title
                    };
                    h = izooto.getParamFromRoute(c.link, "utm_source");
                    k = izooto.getParamFromRoute(c.link, "utm_medium");
                    var l = izooto.getParamFromRoute(c.link, "utm_campaign"),
                        m = izooto.getParamFromRoute(c.link, "utm_term"),
                        p = izooto.getParamFromRoute(c.link, "utm_content");
                    f.utm_source = h;
                    f.utm_medium = k;
                    f.utm_campaign = l;
                    f.utm_term = m;
                    f.utm_content = p;
                    a.btn && (f.clicked_button = a.btn);
                    izooto.hookProcessor(g, f)
                }
            })["catch"](function(f) {
                izooto.log(f)
            })
        })["catch"](function(d) {
            izooto.log(d)
        })
    } catch (d) {}
};
izooto.logError = function(b) {
    izooto.log("logError ---");
    izooto.log(b.message);
    var a = izooto.getEndpointToSync(izooto.syncErrUrl, izooto.domainNum);
    izooto.sendLog(a, {
        pid: izooto.client,
        bkey: izooto.bKey,
        op: "error",
        response: encodeURIComponent(b.message),
        ver: izVersion
    })
};
izooto.logNotificationClick = function(b, a) {
    var c = izooto.getParamFromRoute(a.link, "utm_campaign"),
        e = izooto.getEndpointToSync(izooto.syncClickUrl, a.domainNum);
    izooto.izPushGaEvent("click", c);
    izooto.log("logNotificationClick ---");
    self.registration.pushManager.getSubscription().then(function(d) {
        izooto.bKey = izooto.getEndPoint(d);
        d = JSON.parse(JSON.stringify(d));
        var f = {
            pid: a.pid,
            bKey: izooto.bKey,
            et: "userp",
            act: "add",
            val: JSON.stringify({
                last_notification_clicked: !0
            }),
            ver: izVersion
        };
        "object" === typeof d && void 0 !== d.keys && (void 0 !== d.keys.auth && (f.auth = d.keys.auth), void 0 !== d.keys.p256dh && (f.pk = d.keys.p256dh));
        izooto.logSwEvent("click", f, a);
        d = {
            pid: a.pid,
            bkey: izooto.bKey,
            cid: a.cid,
            rid: a.rid,
            op: "click",
            ver: izVersion
        };
        "action1" == b ? d.btn = 1 : "action2" == b && (d.btn = 2);
        1 == a.clickFlag && (izooto.sendLog(e, d), izooto.log("Notification click has been logged successfully : "));
        a.hasOwnProperty("res") && izooto.sendJsonLog(izooto.syncMediatorClick, a.res);
        a.hasOwnProperty("rc") && izooto.syncMediatorUrls(a.rc);
        izooto.syncHook("syncNotificationClick", d, a, "click")
    })
};
izooto.validateCampaignData = function(b, a) {
    izooto.log("validateCampaignData ---");
    if (!b && a.error) throw Error(a.error);
    if (!a) throw Error("No " + (b ? "Payload " : "") + "json return");
    if (!a.hasOwnProperty("title") || !a.hasOwnProperty("message")) throw Error("Incomplete Json");
};
izooto.dataFetcher = function(b, a, c) {
    if (200 !== b.status) throw izooto.log("Looks like there was a problem. Status Code: " + b.status), Error("Status Code: " + b.status);
    return b.json().then(function(e) {
        var d = a;
        izooto.log("Payload Rcv :: ");
        izooto.log(d);
        d.title = izooto.evalHandler(e, d.title);
        d.message = izooto.evalHandler(e, d.message);
        d.icon = izooto.evalHandler(e, d.icon).replace("http://", "https://");
        d.link = izooto.evalHandler(e, d.link);
        d.hasOwnProperty("banner") && "" != d.banner && (d.banner = izooto.evalHandler(e, d.banner).replace("http://", "https://"));
        d.hasOwnProperty("act1name") && d.hasOwnProperty("act1link") && (d.act1name = izooto.evalHandler(e, d.act1name), d.act1link = izooto.evalHandler(e, d.act1link), "" != d.act1name && "" != d.act1link && (d.act_num = 1, d.hasOwnProperty("act1icon") && "" != d.act1icon && (d.act1icon = izooto.evalHandler(e, d.act1icon).replace("http://", "https://")), d.hasOwnProperty("act2name") && d.hasOwnProperty("act2link") && (d.act2name = izooto.evalHandler(e, d.act2name), d.act2link = izooto.evalHandler(e, d.act2link), "" != d.act2name && "" != d.act2link && (d.act_num = 2, d.hasOwnProperty("act2icon") && "" != d.act2icon && (d.act2icon = izooto.evalHandler(e, d.act2icon).replace("http://", "https://"))))));
        a = d;
        return izooto.showNotification(a).then(function(f) {
            izooto.logNotificationView(c, !1, a);
            a.hasOwnProperty("sw") && izooto.swUpdate(a.sw)
        })
    })
};
izooto.dec2bin = function(b) {
    return parseInt(b).toString(2)
};
izooto.bin2dec = function(b) {
    b = parseInt(b, 2);
    isNaN(b) && (b = 0);
    return b
};
izooto.bitParser = function(b, a) {
    var c = 0;
    b = b.toString();
    if ("object" == typeof a) {
        c = "";
        for (var e = 0; e < a.length; e++) c = void 0 == b[a[e]] ? c + 0 : c + b[a[e]];
        c = "" == c ? 0 : izooto.bin2dec(c)
    } else if (void 0 != b[a]) return b[a];
    return c
};
izooto.parseCfg = function(b) {
    b = izooto.dec2bin(b);
    var a = {};
    b = b.split("").reverse().join("");
    a.viewFlag = izooto.bitParser(b, 0);
    a.clickFlag = izooto.bitParser(b, 1);
    a.sysEvents = izooto.bitParser(b, 2);
    a.domainNum = izooto.bitParser(b, [5, 4, 3]);
    izooto.viewFlag = a.viewFlag;
    izooto.clickFlag = a.clickFlag;
    izooto.sysEvents = a.sysEvents;
    izooto.domainNum = a.domainNum;
    return a
};
izooto.getUpdatedPayload = function(b) {
    var a = {
            k: "key",
            id: "id",
            t: "title",
            m: "message",
            ln: "link",
            i: "icon",
            bi: "banner",
            tg: "tag",
            r: "rid",
            tl: "ttl",
            b: "act_num",
            b1: "act1name",
            l1: "act1link",
            ib1: "act1icon",
            b2: "act2name",
            l2: "act2link",
            ib2: "act2icon",
            ri: "reqInt",
            fu: "fetchURL",
            ba: "badge",
            vi: "vibrate",
            sd: "sound"
        },
        c = {};
    if (b.hasOwnProperty("data")) {
        if (b = b.data, b.hasOwnProperty("campaignDetails")) try {
            b = JSON.parse(b.campaignDetails)
        } catch (f) {
            b = b.campaignDetails
        }
    } else b = b.hasOwnProperty("campaignDetails") ? b.campaignDetails : b;
    b.hasOwnProperty("cfg") ? izooto.cfg = b.cfg : izooto.cfg = 0;
    var e = izooto.parseCfg(izooto.cfg);
    for (var d in b) void 0 != a[d] ? c[a[d]] = b[d] : c[d] = b[d];
    c.viewFlag = e.viewFlag ? e.viewFlag : izooto.viewFlag;
    c.clickFlag = e.clickFlag ? e.clickFlag : izooto.clickFlag;
    c.sysEvents = e.sysEvents ? e.sysEvents : izooto.sysEvents;
    c.domainNum = e.domainNum ? e.domainNum : izooto.domainNum;
    c.key = c.key ? c.key : izooto.client;
    return c
};
izooto.payloadHandler = function(b, a, c) {
    izooto.campData = b;
    izooto.validateCampaignData(c, b);
    console.log("Push data validated");
    return b.hasOwnProperty("fetchURL") && "" != b.fetchURL ? fetch(b.fetchURL).then(function(e) {
        return izooto.dataFetcher(e, b, a)
    })["catch"](function(e) {
        izooto.log(e)
    }) : izooto.showNotification(b).then(function(e) {
        izooto.logNotificationView(a, c, b);
        b.hasOwnProperty("sw") && izooto.swUpdate(b.sw)
    })
};
izooto.getMediationPayload = function(b) {
    return new Promise(function(a, c) {
        (new IZMediatorClass(JSON.stringify(b))).getPayload(function(e) {
            a(e)
        })
    })
};
izooto.filterPayload = function(b, a, c) {
    var e = {};
    c = c ? 1 : 0;
    b.hasOwnProperty("ev") && izooto.evaluator(b.ev);
    if (b.hasOwnProperty("an")) return izooto.getMediationPayload(b).then(function(d) {
        e = izooto.getUpdatedPayload(JSON.parse(d));
        e.pl = c;
        return izooto.payloadHandler(e, a, c)
    });
    e = izooto.getUpdatedPayload(b);
    e.pl = c;
    return izooto.payloadHandler(e, a, c)
};

//This function handles the push notifications.
izooto.pushHandler = function(b) {
    izooto.log("pushEvent ---");
    b.waitUntil(self.registration.pushManager.getSubscription().then(function(a) {
        izooto.bKey = izooto.getEndPoint(a);
        var c = {},
            e = !1;
        if (b.data) try {
            try {
                var d = b.data.json()
            } catch (f) {
                throw Error("Invalid push : " + f.message);
            }
            e = !0;
            return d.hasOwnProperty("gpl") ? izSwFetch(d.gpl, {
                method: "get"
            }).then(function(f) {
                f.text().then(function(g) {
                    return izooto.filterPayload(JSON.parse(g), a, e)
                })
            })["catch"](function(f) {}) : izooto.filterPayload(d, a, e)
        } catch (f) {
            izooto.logError(f)
        } else return izooto.fetchDataURL = izooto.fetchData + "?client=" + izooto.client + "&bkey=" + izooto.bKey, izooto.log("Fetching campaign data from : " + izooto.fetchDataURL), fetch(izooto.fetchDataURL).then(function(f) {
            if (200 !== f.status) throw izooto.log("Looks like there was a problem. Status Code: " + f.status), Error("Status Code: " + f.status);
            return f.json().then(function(g) {
                c = izooto.getUpdatedPayload(g);
                return izooto.filterPayload(c, a, e)
            })
        })["catch"](izooto.logError)
    }))
};

izooto.clickHandler = function(b) {
    izooto.log("notificationClick event ---");
    var a = b.notification.data ? b.notification.data : {},
        c = {},
        e = izooto.campData ? izooto.campData : {};
    c.pid = a.pid ? a.pid : izooto.client;
    c.rid = a.rid ? a.rid : e.rid;
    c.cid = a.cid ? a.cid : e.id;
    c.sysEvents = a.sysEvents ? a.sysEvents : izooto.sysEvents;
    c.clickFlag = a.clickFlag ? a.clickFlag : izooto.clickFlag;
    c.domainNum = a.domainNum ? a.domainNum : izooto.domainNum;
    c.title = b.notification.title ? b.notification.title : e.title;
    a.hasOwnProperty("res") && (c.res = a.res);
    a.hasOwnProperty("rc") && (c.rc = a.rc);
    b.notification.close();
    e = b.notification.icon;
    var d = izooto.url_redirect;
    d = "action1" === b.action ? void 0 != a.act1link ? a.act1link : izooto.getCampaignLink("act1", e, d) : "action2" === b.action ? void 0 != a.act2link ? a.act2link : izooto.getCampaignLink("act2", e, d) : void 0 != a.link ? a.link : izooto.getCampaignLink("act", e, d);
    c.link = d;
    b.waitUntil(clients.matchAll({
        type: "window"
    }).then(function(f) {
        for (var g = 0; g < f.length; g++) {
            var h = f[g];
            if (h.url === d && "focus" in h) return h.focus()
        }
        if (clients.openWindow) return clients.openWindow(d)
    }));
    try {
        izooto.logNotificationClick(b.action, c)
    } catch (f) {
        izooto.log("Logging error : " + f)
    }
};
izooto.installHandler = function(b) {
    izooto.log("installing..." + izVersion);
    izooto.db.init().then(function(a) {
        izooto.db.getData(a, "options", "all").then(function(c) {
            izooto.db.tbl.options = c;
            izooto.versionHandler(a, c, !0)
        })["catch"](function(c) {
            izooto.log(c)
        })
    })["catch"](function(a) {
        izooto.log(a)
    });
    self.skipWaiting()
};
self.addEventListener("install", izooto.installHandler);
self.addEventListener("activate", function(b) {
    b.waitUntil(clients.claim())
});
self.addEventListener("push", izooto.pushHandler);
self.addEventListener("notificationclick", izooto.clickHandler);
var WorkerMessengerCommand = {
    AMP_SUBSCRIPTION_STATE: "amp-web-push-subscription-state",
    AMP_UNSUBSCRIBE: "amp-web-push-unsubscribe",
    AMP_SUBSCRIBE: "amp-web-push-subscribe"
};
self.addEventListener("message", function(b) {
    switch (b.data.command) {
        case WorkerMessengerCommand.AMP_SUBSCRIPTION_STATE:
            onMessageReceivedSubscriptionState();
            break;
        case WorkerMessengerCommand.AMP_SUBSCRIBE:
            onMessageReceivedSubscribe();
            break;
        case WorkerMessengerCommand.AMP_UNSUBSCRIBE:
            onMessageReceivedUnsubscribe()
    }
});

function onMessageReceivedSubscriptionState() {
    var b = null;
    self.registration.pushManager.getSubscription().then(function(a) {
        return (b = a) ? self.registration.pushManager.permissionState(a.options) : null
    }).then(function(a) {
        null == a ? broadcastReply(WorkerMessengerCommand.AMP_SUBSCRIPTION_STATE, !1) : broadcastReply(WorkerMessengerCommand.AMP_SUBSCRIPTION_STATE, !!b && "granted" === a)
    })
}

function onMessageReceivedUnsubscribe() {
    self.registration.pushManager.getSubscription().then(function(b) {
        return b.unsubscribe()
    }).then(function() {
        broadcastReply(WorkerMessengerCommand.AMP_UNSUBSCRIBE, null)
    })
}

function onMessageReceivedSubscribe() {
    self.registration.pushManager.subscribe({
        userVisibleOnly: !0,
        applicationServerKey: urlB64ToUint8Array(izooto.vapidkey)
    }).then(function() {
        self.registration.pushManager.getSubscription().then(function(b) {
            console.log("test sw izooto");
            var a = JSON.parse(JSON.stringify(b)),
                c = {
                    bKey: izooto.getEndPoint(a),
                    pk: a.keys.p256dh,
                    pid: izooto.client,
                    ep: b.endpoint,
                    auth: a.keys.auth,
                    vpk: izooto.vapidkey,
                    allowed: 1,
                    btype: 1,
                    dtype: 3,
                    pte: 2,
                    amp: 1
                };
            izooto.httpRequest("https://enp.izooto.com/enp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: Object.keys(c).map(function(e) {
                    return e + "=" + c[e]
                }).join("&")
            }, function(e) {
                izooto.log(e)
            }, function(e) {
                izooto.log(e)
            })
        });
        broadcastReply(WorkerMessengerCommand.AMP_SUBSCRIBE, null)
    })
}

function broadcastReply(b, a) {
    self.clients.matchAll().then(function(c) {
        for (var e = 0; e < c.length; e++) c[e].postMessage({
            command: b,
            payload: a
        })
    })
}

function urlB64ToUint8Array(b) {
    var a = "=".repeat((4 - b.length % 4) % 4);
    b = (b + a).replace(/\-/g, "+").replace(/_/g, "/");
    b = self.atob(b);
    a = new Uint8Array(b.length);
    for (var c = 0; c < b.length; ++c) a[c] = b.charCodeAt(c);
    return a
};