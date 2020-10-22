try {
    importScripts(decodeURIComponent(
        location.search.substring(location.search.indexOf('ref=') + 4)
    ));
} catch (e) {

}