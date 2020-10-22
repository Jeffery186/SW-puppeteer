/* global self, fetch, clients */

// Receives and displays Chrome push notifications, defaulting to a hardcoded
// practice reminder if anything goes wrong.

// Must be located in static folder root.
// See http://stackoverflow.com/a/29874095

(function() {
  "use strict";

  var PRACTICE_REMINDER_STRINGS = {
    ar:
      "\u0625\u0646\u0651 \u062a\u0639\u0644\u0651\u064f\u0645 \u0627\u0644\u0644\u063a\u0629 \u064a\u062a\u0637\u0644\u0651\u0628 \u0627\u0644\u062a\u062f\u0631\u064a\u0628 \u064a\u0648\u0645\u064a\u0651\u0627\u064b.",
    cs:
      "Studium jazyka vy\u017eaduje ka\u017edodenn\u00ed procvi\u010dov\u00e1n\u00ed",
    de: "Das Erlernen einer Sprache erfordert t\u00e4gliches \u00dcben.",
    el:
      "\u0397 \u03b5\u03ba\u03bc\u03ac\u03b8\u03b7\u03c3\u03b7 \u03bc\u03b9\u03b1\u03c2 \u03b3\u03bb\u03ce\u03c3\u03c3\u03b1\u03c2 \u03b1\u03c0\u03b1\u03b9\u03c4\u03b5\u03af \u03ba\u03b1\u03b8\u03b7\u03bc\u03b5\u03c1\u03b9\u03bd\u03ae \u03c0\u03c1\u03b1\u03ba\u03c4\u03b9\u03ba\u03ae \u03b5\u03be\u03ac\u03c3\u03ba\u03b7\u03c3\u03b7.",
    en: "Learning a language requires practice every day.",
    es: "Para aprender un lenguaje, necesitas practicar diariamente.",
    fr: "Pour apprendre une langue, il faut t'entra\u00eener tous les jours.",
    hi:
      "\u092d\u093e\u0937\u093e \u0938\u0940\u0916\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0926\u0948\u0928\u093f\u0915 \u0905\u092d\u094d\u092f\u093e\u0938 \u0915\u0940 \u095b\u0930\u0942\u0930\u0924 \u0939\u0948\u0964",
    hu: "A nyelvtanul\u00e1shoz sz\u00fcks\u00e9ges, hogy mindennap gyakorolj.",
    id: "Belajar sebuah bahasa butuh latihan tiap hari",
    it: "Per imparare una lingua, bisogna fare pratica ogni giorno.",
    ja:
      "\u8a00\u8a9e\u3092\u5b66\u3076\u306b\u306f\u3001\u65e5\u9803\u304b\u3089\u7df4\u7fd2\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002",
    ko:
      "\uc678\uad6d\uc5b4\ub97c \ubc30\uc6b0\uae30 \uc704\ud574\uc11c\ub294 \ub9e4\uc77c \uc5f0\uc2b5\uc774 \ud544\uc694\ud569\ub2c8\ub2e4.",
    nl: "Het leren van een taal vergt dagelijkse oefening.",
    pl: "Nauka j\u0119zyka wymaga codziennej praktyki.",
    pt: "Para aprender um idioma, \u00e9 preciso praticar diariamente.",
    ro:
      "\u00cenv\u0103\u021barea unei limbi str\u0103ine necesit\u0103 exersare zilnic\u0103.",
    ru:
      "\u041e\u0431\u0443\u0447\u0435\u043d\u0438\u0435 \u044f\u0437\u044b\u043a\u0443 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u0435\u0436\u0435\u0434\u043d\u0435\u0432\u043d\u043e\u0439 \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0438.",
    th:
      "\u0e01\u0e32\u0e23\u0e40\u0e23\u0e35\u0e22\u0e19\u0e20\u0e32\u0e29\u0e32\u0e04\u0e27\u0e23\u0e15\u0e49\u0e2d\u0e07\u0e1d\u0e36\u0e01\u0e1d\u0e19\u0e40\u0e1b\u0e47\u0e19\u0e1b\u0e23\u0e30\u0e08\u0e33\u0e17\u0e38\u0e01\u0e27\u0e31\u0e19",
    tr:
      "Dil \u00f6\u011frenmek i\u00e7in her g\u00fcn al\u0131\u015ft\u0131rma yapmak laz\u0131m.",
    uk:
      "\u0412\u0438\u0432\u0447\u0435\u043d\u043d\u044f \u043c\u043e\u0432\u0438 \u043f\u043e\u0442\u0440\u0435\u0431\u0443\u0454 \u0449\u043e\u0434\u0435\u043d\u043d\u043e\u0457 \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0438.",
    vi:
      "H\u1ecdc m\u1ed9t ng\u00f4n ng\u1eef \u0111\u00f2i h\u1ecfi m\u1ed9t qu\u00e1 tr\u00ecnh luy\u1ec7n t\u1eadp h\u00e0ng ng\u00e0y.",
    zh: "\u5b66\u4e60\u8bed\u8a00\u9700\u8981\u6bcf\u5929\u7ec3\u4e60\u3002",
  };

  var trackNotificationRecieved = function(data) {
    // Get user id of target and short circuit if information is unavailable
    if (!("$target" in data) || typeof data["$target"] !== "number") return;
    let user_id = data["$target"];

    // Setup tracking properties
    let tracking_properties = {};
    if ("track" in data && "notification received" in data["track"]) {
      tracking_properties = data["track"]["notification received"];
    }
    tracking_properties["distinct_id"] = user_id;
    tracking_properties["Client"] = "web";

    // Setup tracking payload
    let payload = {
      event_type: "notification received",
      event_timestamp: Date.now(),
      attributes: tracking_properties,
      client: {
        client_id: "web",
      },
    };

    // Track notification received
    fetch("https://excess.duolingo.com", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
  };

  var showNotification = function(data) {
    data = data || {};
    trackNotificationRecieved(data);
    return self.registration.showNotification(data.title || "Duolingo", {
      body: data.body || PRACTICE_REMINDER_STRINGS[getUiLanguage()],
      icon: data.icon || "/images/notifications/duo_spread_owl.png",
      tag: "renotify",
      renotify: true,
    });
  };

  var getUiLanguage = function() {
    var uiLanguage = "en";
    if (navigator && navigator.language) {
      var navigatorLanguage = navigator.language.split("-")[0].toLowerCase();
      if (navigatorLanguage in PRACTICE_REMINDER_STRINGS) {
        uiLanguage = navigatorLanguage;
      }
    }
    return uiLanguage;
  };

  self.addEventListener("push", function(e) {
    let promise = e.data ? showNotification(e.data.json()) : showNotification();
    e.waitUntil(promise);
  });

  self.addEventListener("notificationclick", function(e) {
    // Android doesn't automatically close notifications on click
    e.notification.close();

    // Focus tab if open
    e.waitUntil(
      clients
        .matchAll({
          type: "window",
        })
        .then(function(clientList) {
          for (var i = 0; i < clientList.length; ++i) {
            var client = clientList[i];
            if (client.url === "/" && "focus" in client) {
              return client.focus();
            }
          }

          if (clients.openWindow) {
            return clients.openWindow("/");
          }
        })
    );
  });
})();
