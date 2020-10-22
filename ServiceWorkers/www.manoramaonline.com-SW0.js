importScripts('/etc/designs/webpush/firebase-app.js');importScripts('/etc/designs/webpush/firebase-messaging.js');firebase.initializeApp({'messagingSenderId':'669210416122'});self.addEventListener('notificationclick',function(e){var lnk="";if(e.notification.data.lnk){var lnk=e.notification.data.lnk}
e.notification.close();e.waitUntil(clients.matchAll({type:"window"}).then(function(clientList){for(var i=0;i<clientList.length;i++){var client=clientList[i];if(client.url==lnk&&'focus' in client)
return client.focus()}
if(clients.openWindow){var ln=genUrl(lnk);return clients.openWindow(ln)}}))});const messaging=firebase.messaging();messaging.setBackgroundMessageHandler(function(pld){var ntitle='';var nop={}
if(pld.data){if(pld.data.title){ntitle=pld.data.title}
if(pld.data.message){nop.body=pld.data.message}
if(pld.data.img){nop.icon=pld.data.img}
if(pld.data.cul){var dt={lnk:pld.data.cul};nop.data=dt}}
nop.requireInteraction=!0;if(nop.body){return self.registration.showNotification(ntitle,nop)}});function genUrl(lnk){var utm="?utm_campaign=Breaking News&utm_medium=web-push&evt_typ=campaign&utm_source=newsalerts";var ulparam=encodeURIComponent(lnk+utm);var sendTo="https://scribe-news.mmonline.io/click?evt_nm=Tapped Push Notification&evt_typ=campaign&app_id=manoramanews&cpg_md=web-push&cpg_nm=Breaking News&url=";var ul=encodeURI(sendTo)+ulparam;return ul}